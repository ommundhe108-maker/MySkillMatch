import React, { useState, useEffect } from 'react';
import {
  Copy,
  Check,
  Terminal,
  Database,
  Server,
  Play,
  FileCode,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  Code2,
  Table,
  UploadCloud,
} from 'lucide-react';

export const PythonCodeViewer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'netlify' | 'cloud' | 'db' | 'app' | 'database' | 'req' | 'config' | 'run'>('netlify');
  const [copied, setCopied] = useState<string | null>(null);

  // Files from server
  const [fileContents, setFileContents] = useState<Record<string, string>>({});
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);

  // Database stats & status
  const [dbStatus, setDbStatus] = useState<any>(null);
  const [isLoadingDb, setIsLoadingDb] = useState(false);

  // Custom SQL Runner
  const [sqlQuery, setSqlQuery] = useState("SELECT id, title, company, salary, applicants_count, status FROM jobs");
  const [sqlResult, setSqlResult] = useState<any[] | null>(null);
  const [sqlError, setSqlError] = useState<string | null>(null);
  const [isExecutingSql, setIsExecutingSql] = useState(false);

  // Fetch files and DB status on mount
  const fetchDbStatus = async () => {
    setIsLoadingDb(true);
    try {
      const res = await fetch('/api/python/status');
      const data = await res.json();
      setDbStatus(data);
    } catch (e) {
      console.error('Failed to fetch DB status:', e);
    } finally {
      setIsLoadingDb(false);
    }
  };

  const fetchFiles = async () => {
    setIsLoadingFiles(true);
    try {
      const res = await fetch('/api/python/files');
      const data = await res.json();
      setFileContents(data);
    } catch (e) {
      console.error('Failed to fetch Python files:', e);
    } finally {
      setIsLoadingFiles(false);
    }
  };

  useEffect(() => {
    fetchDbStatus();
    fetchFiles();
  }, []);

  const handleExecuteSql = async () => {
    if (!sqlQuery.trim()) return;
    setIsExecutingSql(true);
    setSqlError(null);
    setSqlResult(null);
    try {
      const res = await fetch('/api/python/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: sqlQuery }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setSqlError(data.error || 'SQL query execution failed');
      } else {
        setSqlResult(data);
      }
    } catch (err: any) {
      setSqlError(err?.message || 'Failed to connect to Python backend');
    } finally {
      setIsExecutingSql(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const downloadFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const runCommands = `# 1. Create Python virtual environment
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\\Scripts\\activate

# 2. Install Streamlit dependencies
pip install -r requirements.txt

# 3. Initialize SQLite Database
python3 database.py init

# 4. Launch Streamlit Application Server
streamlit run app.py
`;

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs space-y-6">
      {/* Header with live Python SQLite status banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">Python Backend &amp; Streamlit Cloud Host</h2>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              SQLite Live Connected
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Connected to <code>database.py</code> &amp; <code>skillmatch.db</code>. Ready for one-click hosting on <strong>Streamlit Community Cloud</strong>.
          </p>
        </div>

        {/* Quick DB Stats badge */}
        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-700">
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Database</div>
            <div className="font-mono font-semibold text-blue-900">skillmatch.db</div>
          </div>
          <div className="h-6 w-px bg-slate-200"></div>
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Active Jobs</div>
            <div className="font-semibold text-slate-900">{dbStatus?.stats?.active_jobs ?? '...'}</div>
          </div>
          <div className="h-6 w-px bg-slate-200"></div>
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Size</div>
            <div className="font-semibold text-slate-900">{dbStatus?.stats?.db_size_kb ?? '...'} KB</div>
          </div>
          <button
            onClick={() => {
              fetchDbStatus();
              fetchFiles();
            }}
            disabled={isLoadingDb}
            className="p-1.5 text-slate-500 hover:text-blue-700 rounded hover:bg-slate-200 transition-colors"
            title="Refresh DB status"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingDb ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-lg text-xs font-medium">
        <button
          onClick={() => setActiveTab('netlify')}
          className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
            activeTab === 'netlify' ? 'bg-teal-700 text-white shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <UploadCloud className="w-3.5 h-3.5" />
          Deploy to Netlify (Exact Interface)
        </button>

        <button
          onClick={() => setActiveTab('cloud')}
          className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
            activeTab === 'cloud' ? 'bg-white text-blue-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Server className="w-3.5 h-3.5 text-blue-600" />
          Streamlit Cloud Info
        </button>

        <button
          onClick={() => setActiveTab('db')}
          className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
            activeTab === 'db' ? 'bg-white text-blue-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Database className="w-3.5 h-3.5 text-amber-600" />
          SQLite Live Query Runner
        </button>

        <button
          onClick={() => setActiveTab('app')}
          className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
            activeTab === 'app' ? 'bg-white text-blue-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileCode className="w-3.5 h-3.5 text-indigo-600" />
          app.py (Streamlit App)
        </button>

        <button
          onClick={() => setActiveTab('database')}
          className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
            activeTab === 'database' ? 'bg-white text-blue-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Code2 className="w-3.5 h-3.5 text-emerald-600" />
          database.py (SQLite Layer)
        </button>

        <button
          onClick={() => setActiveTab('req')}
          className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
            activeTab === 'req' ? 'bg-white text-blue-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          requirements.txt
        </button>

        <button
          onClick={() => setActiveTab('config')}
          className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
            activeTab === 'config' ? 'bg-white text-blue-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          .streamlit/config.toml
        </button>

        <button
          onClick={() => setActiveTab('run')}
          className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
            activeTab === 'run' ? 'bg-white text-blue-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Terminal className="w-3.5 h-3.5 text-slate-600" />
          Local Terminal Commands
        </button>
      </div>

      {/* TAB: NETLIFY DEPLOYMENT GUIDE (EXACT INTERFACE) */}
      {activeTab === 'netlify' && (
        <div className="space-y-6">
          <div className="border border-teal-200 bg-teal-50/70 rounded-lg p-5">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-teal-700 text-white rounded-md mt-0.5">
                <UploadCloud className="w-5 h-5" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-teal-950">
                    Deploy this Exact Interface to Netlify (100% Identical React UI)
                  </h3>
                  <span className="px-2 py-0.5 text-[11px] font-semibold bg-teal-200 text-teal-900 rounded-full">
                    Pre-configured
                  </span>
                </div>
                <p className="text-xs text-teal-900 leading-relaxed">
                  Netlify is designed specifically for modern <strong>Vite &amp; React</strong> single-page applications. When you deploy to Netlify, you get the <strong>exact same responsive navbar, student/company dashboards, application modals, and Tailwind styling</strong> that you see right here.
                </p>
                <div className="text-[11px] text-teal-800 bg-white/80 border border-teal-200 rounded p-2.5">
                  ✅ <strong>netlify.toml</strong> and <strong>public/_redirects</strong> have already been created in this codebase to handle SPA client routing automatically.
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-slate-200 rounded-lg p-4 bg-slate-50 space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <span className="w-6 h-6 rounded-full bg-teal-700 text-white flex items-center justify-center text-xs">1</span>
                Push to GitHub
              </div>
              <p className="text-xs text-slate-600">
                Commit and push all files to your GitHub repository:
              </p>
              <div className="bg-slate-900 text-slate-200 p-2.5 rounded text-[11px] font-mono leading-relaxed">
                git add .<br />
                git commit -m "Configure Netlify deployment"<br />
                git push origin main
              </div>
            </div>

            <div className="border border-slate-200 rounded-lg p-4 bg-slate-50 space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <span className="w-6 h-6 rounded-full bg-teal-700 text-white flex items-center justify-center text-xs">2</span>
                Import in Netlify
              </div>
              <p className="text-xs text-slate-600">
                Log into <strong>app.netlify.com</strong> with GitHub and select:
              </p>
              <div className="bg-white border border-slate-200 p-2.5 rounded text-xs space-y-1.5 text-slate-700">
                <div><strong>1.</strong> Click <strong>Add new site</strong> &gt; <strong>Import an existing project</strong></div>
                <div><strong>2.</strong> Choose <strong>GitHub</strong> &amp; pick your repository</div>
                <div><strong>3.</strong> Netlify will auto-detect <code>netlify.toml</code></div>
              </div>
            </div>

            <div className="border border-slate-200 rounded-lg p-4 bg-slate-50 space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <span className="w-6 h-6 rounded-full bg-teal-700 text-white flex items-center justify-center text-xs">3</span>
                Verify Build Settings &amp; Deploy
              </div>
              <p className="text-xs text-slate-600">
                Settings are pre-configured:
              </p>
              <div className="bg-slate-900 text-slate-200 p-2.5 rounded text-[11px] font-mono space-y-1">
                <div>Build command: <span className="text-teal-400">npm run build</span></div>
                <div>Publish directory: <span className="text-teal-400">dist</span></div>
                <div>Node version: <span className="text-teal-400">22</span></div>
              </div>
              <div className="text-[11px] text-emerald-700 font-semibold pt-1">
                Click "Deploy site" — live in under 45 seconds!
              </div>
            </div>
          </div>

          <div className="border border-slate-200 rounded-lg p-4 bg-white space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-900">
                Configuration File: <code>netlify.toml</code> (Present in repository root)
              </span>
              <button
                onClick={() =>
                  copyToClipboard(
                    `[build]\n  command = "npm run build"\n  publish = "dist"\n\n[build.environment]\n  NODE_VERSION = "22"\n\n[[redirects]]\n  from = "/*"\n  to = "/index.html"\n  status = 200\n`,
                    'netlify_toml'
                  )
                }
                className="px-2.5 py-1 text-teal-800 bg-teal-50 hover:bg-teal-100 rounded text-xs font-semibold transition-colors flex items-center gap-1"
              >
                {copied === 'netlify_toml' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copied === 'netlify_toml' ? 'Copied' : 'Copy netlify.toml'}
              </button>
            </div>
            <div className="bg-slate-900 text-slate-200 p-3.5 rounded-lg text-xs font-mono">
              <pre>{`[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "22"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200`}</pre>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-900 text-slate-200 rounded-lg">
            <div>
              <div className="font-semibold text-sm text-white">Ready to deploy to Netlify?</div>
              <div className="text-xs text-slate-400">Deploy your repository with the exact React interface right now:</div>
            </div>
            <a
              href="https://app.netlify.com/start"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold rounded-md transition-colors shadow-xs"
            >
              Open Netlify Dashboard <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}

      {/* TAB: STREAMLIT CLOUD DEPLOYMENT GUIDE */}
      {activeTab === 'cloud' && (
        <div className="space-y-6">
          {/* Why UI Changes explanation banner */}
          <div className="border border-amber-300 bg-amber-50/80 rounded-lg p-5">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-amber-600 text-white rounded-md mt-0.5">
                <Code2 className="w-5 h-5" />
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-bold text-amber-950">
                  Why does the interface change when deployed to Streamlit?
                </h3>
                <p className="text-xs text-amber-900 leading-relaxed">
                  In this AI Studio preview, you are interacting with a <strong>React 19 Single-Page Application (SPA)</strong> built with Tailwind CSS, custom modals, tabs, and animations.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  <div className="bg-white/80 border border-amber-200 rounded p-3 text-xs text-slate-800 space-y-1">
                    <div className="font-bold text-blue-900">React Frontend (AI Studio preview):</div>
                    <p className="text-slate-600">
                      Renders HTML, CSS, JavaScript, and Tailwind components. To deploy <em>this exact interface</em>, host the repository on <strong>Vercel</strong> or <strong>Netlify</strong>.
                    </p>
                  </div>
                  <div className="bg-white/80 border border-amber-200 rounded p-3 text-xs text-slate-800 space-y-1">
                    <div className="font-bold text-blue-900">Streamlit Server (share.streamlit.io):</div>
                    <p className="text-slate-600">
                      Executes <code>app.py</code> in Python, which renders native Streamlit widgets. We added custom CSS to <code>app.py</code> so it shares the same brand colors, metric cards, and SQLite database.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border border-blue-200 bg-blue-50/60 rounded-lg p-5">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-600 text-white rounded-md mt-0.5">
                <Server className="w-5 h-5" />
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-bold text-blue-950">How to Host on Streamlit Community Cloud (Streamlit Server)</h3>
                <p className="text-xs text-blue-900/80 leading-relaxed">
                  Streamlit Community Cloud offers free, instantaneous hosting with automatic GitHub deployment and continuous integration.
                  All 4 required files (<code>app.py</code>, <code>database.py</code>, <code>requirements.txt</code>, and <code>.streamlit/config.toml</code>) are created and ready in this project.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-slate-200 rounded-lg p-4 bg-slate-50 space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <span className="w-6 h-6 rounded-full bg-blue-700 text-white flex items-center justify-center text-xs">1</span>
                Push to GitHub
              </div>
              <p className="text-xs text-slate-600">
                Commit <code>app.py</code>, <code>database.py</code>, <code>requirements.txt</code>, and <code>.streamlit/config.toml</code> to your GitHub repository (e.g. <code>vanshita-Sawale07/SkillMatch</code>).
              </p>
              <div className="bg-slate-900 text-slate-200 p-2.5 rounded text-[11px] font-mono">
                git add .<br/>
                git commit -m "Add Streamlit portal &amp; SQLite DB"<br/>
                git push origin main
              </div>
            </div>

            <div className="border border-slate-200 rounded-lg p-4 bg-slate-50 space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <span className="w-6 h-6 rounded-full bg-blue-700 text-white flex items-center justify-center text-xs">2</span>
                Link on share.streamlit.io
              </div>
              <p className="text-xs text-slate-600">
                Navigate to <strong>share.streamlit.io</strong>, sign in with your GitHub account, and click <strong>New app</strong>.
              </p>
              <div className="bg-white border border-slate-200 p-2.5 rounded text-xs space-y-1 text-slate-700">
                <div><strong>Repository:</strong> your-username/SkillMatch</div>
                <div><strong>Branch:</strong> main</div>
                <div><strong>Main file path:</strong> <code>app.py</code></div>
              </div>
            </div>

            <div className="border border-slate-200 rounded-lg p-4 bg-slate-50 space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <span className="w-6 h-6 rounded-full bg-blue-700 text-white flex items-center justify-center text-xs">3</span>
                Set Secrets &amp; Launch
              </div>
              <p className="text-xs text-slate-600">
                Under <strong>Advanced settings &gt; Secrets</strong>, paste your Gemini API key (optional for career coach features) and click <strong>Deploy!</strong>
              </p>
              <div className="bg-slate-900 text-slate-200 p-2.5 rounded text-[11px] font-mono">
                GEMINI_API_KEY = "AIzaSy..."
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-900 text-slate-200 rounded-lg">
            <div>
              <div className="font-semibold text-sm text-white">Streamlit Community Cloud Portal URL</div>
              <div className="text-xs text-slate-400">Once deployed, your live app will be accessible worldwide:</div>
            </div>
            <a
              href="https://share.streamlit.io"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded transition-colors"
            >
              Open share.streamlit.io <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}

      {/* TAB: SQLITE LIVE QUERY RUNNER */}
      {activeTab === 'db' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Database className="w-4 h-4 text-amber-600" />
                Live SQLite Query Runner (`skillmatch.db`)
              </h3>
              <p className="text-xs text-slate-500">
                Execute real-time SELECT queries against the Python SQLite database directly from the browser.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSqlQuery("SELECT id, title, company, salary, applicants_count, status FROM jobs")}
                className="text-[11px] text-blue-700 hover:underline"
              >
                Sample: Jobs
              </button>
              <span className="text-slate-300">|</span>
              <button
                onClick={() => setSqlQuery("SELECT id, job_title, company, applied_on, status, match_score FROM applications")}
                className="text-[11px] text-blue-700 hover:underline"
              >
                Sample: Applications
              </button>
              <span className="text-slate-300">|</span>
              <button
                onClick={() => setSqlQuery("SELECT name, college, branch, cgpa, match_score, status FROM applicants")}
                className="text-[11px] text-blue-700 hover:underline"
              >
                Sample: Applicants
              </button>
            </div>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={sqlQuery}
              onChange={(e) => setSqlQuery(e.target.value)}
              placeholder="SELECT * FROM jobs..."
              className="flex-1 px-3 py-2 text-xs font-mono border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleExecuteSql}
              disabled={isExecutingSql}
              className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold rounded-md flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              {isExecutingSql ? 'Running...' : 'Execute SQL'}
            </button>
          </div>

          {sqlError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-md">
              <strong>Error:</strong> {sqlError}
            </div>
          )}

          {sqlResult && (
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <div className="bg-slate-50 px-3 py-2 border-b border-slate-200 text-xs font-semibold text-slate-700 flex items-center justify-between">
                <span>Result: {sqlResult.length} rows returned</span>
                <span className="text-slate-400 font-normal">Database: skillmatch.db</span>
              </div>
              {sqlResult.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-500">No rows matched the query.</div>
              ) : (
                <div className="overflow-x-auto max-h-80">
                  <table className="min-w-full divide-y divide-slate-200 text-xs font-mono">
                    <thead className="bg-slate-100 text-slate-700 uppercase">
                      <tr>
                        {Object.keys(sqlResult[0]).map((col) => (
                          <th key={col} className="px-3 py-2 text-left font-semibold">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                      {sqlResult.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          {Object.values(row).map((val: any, vIdx) => (
                            <td key={vIdx} className="px-3 py-2 text-slate-800 whitespace-nowrap">
                              {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB: APP.PY */}
      {activeTab === 'app' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600 font-medium">
              Entry point for Streamlit server: <code>/app.py</code>
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => downloadFile('app.py', fileContents['app.py'] || '')}
                className="px-2.5 py-1 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded text-xs font-medium transition-colors"
              >
                Download app.py
              </button>
              <button
                onClick={() => copyToClipboard(fileContents['app.py'] || '', 'app.py')}
                className="px-2.5 py-1 text-blue-700 bg-blue-50 hover:bg-blue-100 rounded text-xs font-semibold transition-colors flex items-center gap-1"
              >
                {copied === 'app.py' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copied === 'app.py' ? 'Copied!' : 'Copy Code'}
              </button>
            </div>
          </div>
          <div className="bg-slate-900 text-slate-100 rounded-lg p-4 font-mono text-xs max-h-96 overflow-y-auto">
            <pre className="whitespace-pre">{fileContents['app.py'] || '# Loading app.py from disk...'}</pre>
          </div>
        </div>
      )}

      {/* TAB: DATABASE.PY */}
      {activeTab === 'database' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600 font-medium">
              SQLite database manager &amp; schema: <code>/database.py</code>
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => downloadFile('database.py', fileContents['database.py'] || '')}
                className="px-2.5 py-1 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded text-xs font-medium transition-colors"
              >
                Download database.py
              </button>
              <button
                onClick={() => copyToClipboard(fileContents['database.py'] || '', 'database.py')}
                className="px-2.5 py-1 text-blue-700 bg-blue-50 hover:bg-blue-100 rounded text-xs font-semibold transition-colors flex items-center gap-1"
              >
                {copied === 'database.py' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copied === 'database.py' ? 'Copied!' : 'Copy Code'}
              </button>
            </div>
          </div>
          <div className="bg-slate-900 text-slate-100 rounded-lg p-4 font-mono text-xs max-h-96 overflow-y-auto">
            <pre className="whitespace-pre">{fileContents['database.py'] || '# Loading database.py from disk...'}</pre>
          </div>
        </div>
      )}

      {/* TAB: REQUIREMENTS.TXT */}
      {activeTab === 'req' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600 font-medium">
              Streamlit Server dependencies: <code>/requirements.txt</code>
            </span>
            <button
              onClick={() => copyToClipboard(fileContents['requirements.txt'] || '', 'req.txt')}
              className="px-2.5 py-1 text-blue-700 bg-blue-50 hover:bg-blue-100 rounded text-xs font-semibold transition-colors flex items-center gap-1"
            >
              {copied === 'req.txt' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copied === 'req.txt' ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <div className="bg-slate-900 text-slate-100 rounded-lg p-4 font-mono text-xs">
            <pre className="whitespace-pre">{fileContents['requirements.txt'] || 'streamlit>=1.35.0\npandas>=2.0.0\ngoogle-genai>=2.4.0'}</pre>
          </div>
        </div>
      )}

      {/* TAB: CONFIG.TOML */}
      {activeTab === 'config' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600 font-medium">
              Streamlit server &amp; brand theme: <code>/.streamlit/config.toml</code>
            </span>
            <button
              onClick={() => copyToClipboard(fileContents['.streamlit/config.toml'] || '', 'config.toml')}
              className="px-2.5 py-1 text-blue-700 bg-blue-50 hover:bg-blue-100 rounded text-xs font-semibold transition-colors flex items-center gap-1"
            >
              {copied === 'config.toml' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copied === 'config.toml' ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <div className="bg-slate-900 text-slate-100 rounded-lg p-4 font-mono text-xs">
            <pre className="whitespace-pre">{fileContents['.streamlit/config.toml'] || '[theme]\nprimaryColor = "#1e40af"\n...'}</pre>
          </div>
        </div>
      )}

      {/* TAB: LOCAL RUN COMMANDS */}
      {activeTab === 'run' && (
        <div className="space-y-4">
          <div className="bg-slate-900 text-slate-100 rounded-lg p-4 font-mono text-xs relative overflow-x-auto">
            <button
              onClick={() => copyToClipboard(runCommands, 'cmds')}
              className="absolute top-3 right-3 text-slate-400 hover:text-white p-1 rounded bg-slate-800"
              title="Copy commands"
            >
              {copied === 'cmds' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
            <pre className="whitespace-pre">{runCommands}</pre>
          </div>

          <div className="border border-slate-200 rounded-lg p-4 bg-slate-50 space-y-2 text-xs text-slate-700">
            <div className="font-semibold text-slate-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Streamlit Architecture &amp; SQLite Integration Notes
            </div>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li>
                <strong>Database Sync:</strong> All records are stored in <code>skillmatch.db</code> via SQLite, shared between Python and the Node.js API bridge.
              </li>
              <li>
                <strong>Cloud Ready:</strong> When deployed to Streamlit Community Cloud, SQLite initializes automatically and persists during the session.
              </li>
              <li>
                <strong>Multi-Role Views:</strong> Guest, Student, Company, and Admin modes are supported in both Streamlit and this React SPA.
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
