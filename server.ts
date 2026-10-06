import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { execFile } from 'child_process';
import fs from 'fs/promises';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Helper to execute Python database operations via database.py
function runPython(args: string[]): Promise<any> {
  return new Promise((resolve, reject) => {
    const pythonScript = path.resolve(__dirname, 'database.py');
    execFile('python3', [pythonScript, ...args], { maxBuffer: 10 * 1024 * 1024 }, (error, stdout, stderr) => {
      if (error) {
        console.error('Python execution error:', stderr || error.message);
        return reject(error);
      }
      try {
        const parsed = JSON.parse(stdout.trim());
        resolve(parsed);
      } catch (e) {
        resolve({ output: stdout.trim() });
      }
    });
  });
}

// -------------------------------------------------------------
// Python & SQLite Database API Endpoints
// -------------------------------------------------------------
app.get('/api/python/status', async (req, res) => {
  try {
    const stats = await runPython(['get_stats']);
    res.json({
      status: 'connected',
      backend: 'Python 3 + SQLite3',
      database: 'skillmatch.db',
      stats,
    });
  } catch (error: any) {
    res.status(500).json({ status: 'error', error: error.message });
  }
});

app.get('/api/python/jobs', async (req, res) => {
  try {
    const filter = (req.query.status as string) || 'All';
    const jobs = await runPython(['get_jobs', filter]);
    res.json(jobs);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/python/jobs', async (req, res) => {
  try {
    const result = await runPython(['create_job', JSON.stringify(req.body)]);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/python/applications', async (req, res) => {
  try {
    const studentId = (req.query.studentId as string) || '';
    const apps = await runPython(['get_applications', studentId]);
    res.json(apps);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/python/apply', async (req, res) => {
  try {
    const result = await runPython(['apply_job', JSON.stringify(req.body)]);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/python/applicants', async (req, res) => {
  try {
    const jobId = (req.query.jobId as string) || '';
    const applicants = await runPython(['get_applicants', jobId]);
    res.json(applicants);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/python/applicant-status', async (req, res) => {
  try {
    const { applicantId, status } = req.body;
    const result = await runPython(['update_status', applicantId, status]);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Returns Streamlit deployment files for user inspection & download
app.get('/api/python/files', async (req, res) => {
  try {
    const appPy = await fs.readFile(path.resolve(__dirname, 'app.py'), 'utf-8');
    const databasePy = await fs.readFile(path.resolve(__dirname, 'database.py'), 'utf-8');
    const reqs = await fs.readFile(path.resolve(__dirname, 'requirements.txt'), 'utf-8');
    const toml = await fs.readFile(path.resolve(__dirname, '.streamlit/config.toml'), 'utf-8');

    res.json({
      'app.py': appPy,
      'database.py': databasePy,
      'requirements.txt': reqs,
      '.streamlit/config.toml': toml,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Read-only SQL query execution on SQLite
app.post('/api/python/query', async (req, res) => {
  try {
    const { query } = req.body;
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Query is required' });
    }
    const sanitized = query.trim();
    if (!sanitized.toLowerCase().startsWith('select')) {
      return res.status(400).json({ error: 'Only read-only SELECT queries are permitted' });
    }

    execFile(
      'python3',
      [
        '-c',
        `
import database, json, sys
conn = database.get_connection()
cur = conn.cursor()
cur.execute(sys.argv[1])
rows = [dict(r) for r in cur.fetchall()]
print(json.dumps(rows))
`,
        sanitized,
      ],
      (err, stdout, stderr) => {
        if (err) {
          return res.status(400).json({ error: stderr || err.message });
        }
        try {
          res.json(JSON.parse(stdout.trim()));
        } catch (e) {
          res.json([]);
        }
      }
    );
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

app.post('/api/chat', async (req, res) => {
  try {
    const { messages, systemRole, model, useSearch, context } = req.body;

    // Model selection logic matching user specifications:
    // - gemini-3.1-pro-preview for particularly complex tasks
    // - gemini-3.5-flash for general tasks and search grounding
    // - gemini-3.1-flash-lite for tasks that should happen fast
    let selectedModel = model || 'gemini-3.5-flash';
    if (useSearch) {
      selectedModel = 'gemini-3.5-flash';
    }

    let baseSystemInstruction = `You are SkillMatch AI, an intelligent skill-to-job matching assistant for the SkillMatch college recruitment platform.`;

    if (systemRole === 'career_coach') {
      baseSystemInstruction += `\nRole: Career Coach. You guide students (like Rahul Patil) to bridge skill gaps, select high-demand tech stacks, evaluate job fit, and prepare competitive resumes. Speak in a helpful, professional, and clear tone without buzzwords.`;
    } else if (systemRole === 'interview_prep') {
      baseSystemInstruction += `\nRole: Mock Technical Interviewer. You ask realistic technical interview questions for junior developers and data analysts (Python, SQL, REST APIs, Git, Docker, System Design fundamentals). Grade answers and provide constructive hints.`;
    } else if (systemRole === 'recruiter_advisor') {
      baseSystemInstruction += `\nRole: Recruiter Matching Advisor. You assist hiring managers and companies (like TechNova Solutions) in drafting targeted skill requirements, interpreting candidate match percentages, and finding qualified campus talent.`;
    } else if (systemRole === 'market_research') {
      baseSystemInstruction += `\nRole: Tech Job Market Analyst with real-time Google Search data. Provide up-to-date hiring trends, salary ranges in Indian tech hubs (Pune, Mumbai, Bengaluru), in-demand frameworks, and college campus recruitment news.`;
    }

    if (context) {
      baseSystemInstruction += `\n\nPlatform Context:\n${typeof context === 'string' ? context : JSON.stringify(context, null, 2)}`;
    }

    const contents = (messages || []).map((m: any) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content || '' }],
    }));

    const config: any = {
      systemInstruction: baseSystemInstruction,
    };

    if (useSearch) {
      config.tools = [{ googleSearch: {} }];
    }

    const response = await ai.models.generateContent({
      model: selectedModel,
      contents,
      config,
    });

    const text = response.text || '';
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;

    res.json({
      text,
      groundingMetadata: groundingMetadata || null,
      modelUsed: selectedModel,
    });
  } catch (error: any) {
    console.error('Gemini API error in /api/chat:', error);
    res.status(500).json({
      error: error.message || 'Failed to generate response from Gemini API',
    });
  }
});

// Mount Vite middleware in development or serve static in production
async function startServer() {
  // Prime the Python SQLite database
  try {
    const initRes = await runPython(['init']);
    console.log('[SkillMatch] Python SQLite database ready:', initRes);
  } catch (err: any) {
    console.warn('[SkillMatch] Python database initialization notice:', err?.message || err);
  }

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`SkillMatch server running on http://0.0.0.0:${port}`);
  });
}

startServer();
