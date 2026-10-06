import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Search,
  Globe,
  RefreshCw,
  ExternalLink,
  ChevronDown,
  User,
  Bot,
  Zap,
  Brain,
  ShieldCheck,
} from 'lucide-react';
import { StudentProfile, Job } from '../data/mockData';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  modelUsed?: string;
  groundingMetadata?: {
    webSearchQueries?: string[];
    groundingChunks?: Array<{
      web?: {
        uri: string;
        title: string;
      };
    }>;
  };
}

interface GeminiChatbotProps {
  student?: StudentProfile;
  activeJob?: Job | null;
  mode?: 'fullscreen' | 'docked';
  onCloseDocked?: () => void;
}

export const GeminiChatbot: React.FC<GeminiChatbotProps> = ({
  student,
  activeJob,
  mode = 'fullscreen',
  onCloseDocked,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_welcome',
      role: 'assistant',
      content:
        `Hello ${student ? student.name.split(' ')[0] : 'there'}! I am your **SkillMatch Gemini Assistant**.\n\n` +
        `I can help you analyze skill gaps, practice technical interview questions, optimize your profile, or search real-time 2026 tech hiring and salary benchmarks with Google Search. What would you like to explore today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      modelUsed: 'gemini-3.5-flash',
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [systemRole, setSystemRole] = useState<'career_coach' | 'interview_prep' | 'market_research' | 'recruiter_advisor'>('career_coach');
  const [model, setModel] = useState<'gemini-3.5-flash' | 'gemini-3.1-flash-lite' | 'gemini-3.1-pro-preview'>('gemini-3.5-flash');
  const [useSearch, setUseSearch] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newHistory.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          systemRole,
          model,
          useSearch,
          context: {
            student: student || null,
            activeJob: activeJob || null,
          },
        }),
      });

      if (!response.ok) {
        // Graceful fallback for static hosting platforms like Netlify where /api/chat is not hosted
        let fallbackText = '';
        if (systemRole === 'career_coach') {
          fallbackText = `Here are targeted career recommendations regarding "${text.trim()}":\n\n` +
            `1. **Core Fundamentals**: Focus heavily on Data Structures, Algorithms, Python, and SQL. Most tier-1 campus tech screenings evaluate these first.\n` +
            `2. **Applied Engineering**: Build production-ready full-stack projects showcasing Docker containerization, REST API design, and modern React interfaces.\n` +
            `3. **Profile Optimization**: Keep your resume to one page, highlight quantifiable metrics (e.g., "reduced latency by 30%"), and showcase active GitHub links.\n\n` +
            `*(Running in client assistant mode on Netlify)*`;
        } else if (systemRole === 'interview_prep') {
          fallbackText = `**Technical Interview Question on "${text.trim()}":**\n\n` +
            `"Can you explain the difference between process and thread concurrency in Python, and how the Global Interpreter Lock (GIL) affects multi-core CPU bound tasks?"\n\n` +
            `**Hint**: Mention threading for I/O bound tasks and multiprocessing or asyncio for parallel execution.\n\n` +
            `*(Running in client assistant mode on Netlify)*`;
        } else if (systemRole === 'recruiter_advisor') {
          fallbackText = `**Recruiter Recommendation for Campus Hiring:**\n\n` +
            `When evaluating freshers for Junior Developer roles, look beyond CGPA: evaluate problem-solving consistency (LeetCode/HackerRank), clean Git commit histories, and practical familiarity with modern component architectures.\n\n` +
            `*(Running in client assistant mode on Netlify)*`;
        } else {
          fallbackText = `In 2026, the highest campus hiring demand across Bengaluru, Pune, and Hyderabad centers on Full-Stack TypeScript/React, Python FastAPI, Cloud fundamentals (Docker/K8s), and Relational Database design.\n\n*(Running in client assistant mode on Netlify)*`;
        }

        const botMessage: ChatMessage = {
          id: `bot_${Date.now()}`,
          role: 'assistant',
          content: fallbackText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          modelUsed: 'SkillMatch Assistant (Client Mode)',
        };
        setMessages((prev) => [...prev, botMessage]);
        return;
      }

      const data = await response.json();
      const botMessage: ChatMessage = {
        id: `bot_${Date.now()}`,
        role: 'assistant',
        content: data.text || 'I could not generate a response. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: data.modelUsed || model,
        groundingMetadata: data.groundingMetadata || undefined,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err: any) {
      console.warn('Network / API note, using client fallback:', err);
      const fallbackMessage: ChatMessage = {
        id: `bot_${Date.now()}`,
        role: 'assistant',
        content: `Thanks for your question regarding **"${text.trim()}"**! For college campus recruitment, focus on building end-to-end full stack projects, mastering SQL queries (JOINs, aggregations), and practicing mock coding problems.\n\n*(Running in client assistant mode on Netlify)*`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: 'SkillMatch Assistant (Client Mode)',
      };
      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: `msg_${Date.now()}`,
        role: 'assistant',
        content: 'Conversation cleared. How can I assist you with your career or recruitment goals?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const samplePrompts = [
    { label: 'Analyze my Python Dev gap', query: 'Based on my student profile, what is my biggest gap for the Python Developer position at TechNova, and what project should I build?' },
    { label: 'Google Search 2026 salaries', query: 'Search the current 2026 fresher salary trends for Python and Data Analytics in Pune vs Bengaluru.' },
    { label: 'Mock Interview Question', query: 'Ask me a practical technical interview question about REST APIs and Python.' },
    { label: 'Explain Docker in 2 minutes', query: 'Can you explain Docker containers and how they relate to deploying a Python web service?' },
  ];

  return (
    <div
      className={`bg-white border border-slate-200 rounded-lg flex flex-col shadow-xs overflow-hidden ${
        mode === 'docked' ? 'h-[580px] w-[380px] sm:w-[420px]' : 'h-[650px] w-full'
      }`}
    >
      {/* Top Controls Header */}
      <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50 flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-blue-900" />
              SkillMatch Gemini Assistant
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={clearChat}
              className="text-[11px] text-slate-500 hover:text-slate-800 p-1 rounded hover:bg-slate-200/60 transition-colors"
              title="Clear conversation"
            >
              <RefreshCw className="w-3.5 h-3.5 inline" />
            </button>
            {mode === 'docked' && onCloseDocked && (
              <button
                onClick={onCloseDocked}
                className="text-xs text-slate-400 hover:text-slate-700 font-bold px-1.5"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Roles & Models configuration strip */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Chatbot Role */}
          <div className="flex items-center gap-1">
            <span className="text-[11px] font-semibold text-slate-500 uppercase">Role:</span>
            <select
              value={systemRole}
              onChange={(e) => setSystemRole(e.target.value as any)}
              className="p-1 border border-slate-300 rounded bg-white text-slate-700 text-xs"
            >
              <option value="career_coach">Career &amp; Skill Coach</option>
              <option value="interview_prep">Mock Technical Interviewer</option>
              <option value="market_research">Tech Market Analyst (Search)</option>
              <option value="recruiter_advisor">Recruiter Advisor</option>
            </select>
          </div>

          {/* Model Selector */}
          <div className="flex items-center gap-1">
            <span className="text-[11px] font-semibold text-slate-500 uppercase">Model:</span>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value as any)}
              className="p-1 border border-slate-300 rounded bg-white text-slate-700 text-xs font-mono"
            >
              <option value="gemini-3.5-flash">gemini-3.5-flash (General &amp; Search)</option>
              <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite (Fast)</option>
              <option value="gemini-3.1-pro-preview">gemini-3.1-pro-preview (Complex)</option>
            </select>
          </div>

          {/* Google Search Grounding toggle */}
          <label className="flex items-center gap-1 text-[11px] text-slate-700 font-medium cursor-pointer ml-auto bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
            <input
              type="checkbox"
              checked={useSearch}
              onChange={(e) => setUseSearch(e.target.checked)}
              className="rounded text-blue-900 focus:ring-0"
            />
            <Globe className="w-3 h-3 text-blue-900" />
            <span>Google Search</span>
          </label>
        </div>
      </div>

      {/* Messages Thread (Scrollable) */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-center gap-1.5 mb-1 px-1 text-[10px] text-slate-400">
              {msg.role === 'user' ? (
                <>
                  <span>You</span>
                  <span>·</span>
                  <span>{msg.timestamp}</span>
                </>
              ) : (
                <>
                  <span className="font-semibold text-blue-900">SkillMatch AI</span>
                  {msg.modelUsed && (
                    <>
                      <span>·</span>
                      <span className="font-mono">{msg.modelUsed}</span>
                    </>
                  )}
                  <span>·</span>
                  <span>{msg.timestamp}</span>
                </>
              )}
            </div>

            <div
              className={`max-w-[85%] rounded-lg px-4 py-2.5 leading-relaxed whitespace-pre-wrap ${
                msg.role === 'user'
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-800 border border-slate-200/80 shadow-xs'
              }`}
            >
              {msg.content}

              {/* Display Google Search Grounding metadata / sources if available */}
              {msg.groundingMetadata && (
                <div className="mt-3 pt-2.5 border-t border-slate-200 text-[11px] text-slate-600 space-y-1.5">
                  {msg.groundingMetadata.webSearchQueries &&
                    msg.groundingMetadata.webSearchQueries.length > 0 && (
                      <div className="flex items-center gap-1 text-[10px] text-slate-500">
                        <Search className="w-3 h-3 text-slate-400" />
                        <span>Searched: {msg.groundingMetadata.webSearchQueries.join(', ')}</span>
                      </div>
                    )}

                  {msg.groundingMetadata.groundingChunks &&
                    msg.groundingMetadata.groundingChunks.length > 0 && (
                      <div>
                        <div className="font-semibold text-slate-700 text-[10px] mb-1 flex items-center gap-1">
                          <Globe className="w-3 h-3 text-blue-900" />
                          <span>Google Search Sources:</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {msg.groundingMetadata.groundingChunks.slice(0, 3).map((chunk, idx) => {
                            if (!chunk.web) return null;
                            return (
                              <a
                                key={idx}
                                href={chunk.web.uri}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 px-2 py-0.5 bg-white border border-slate-300 rounded text-[10px] text-blue-900 hover:underline"
                              >
                                <span>{chunk.web.title || new URL(chunk.web.uri).hostname}</span>
                                <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    )}
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-1.5 mb-1 px-1 text-[10px] text-slate-400">
              <span className="font-semibold text-blue-900">SkillMatch AI</span>
              <span>·</span>
              <span>Thinking...</span>
            </div>
            <div className="bg-slate-100 text-slate-600 rounded-lg px-4 py-2.5 border border-slate-200 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-900 animate-pulse" />
              <div className="w-2 h-2 rounded-full bg-blue-700 animate-pulse delay-75" />
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse delay-150" />
              <span className="text-xs text-slate-500 ml-1">
                {useSearch ? 'Searching Google & analyzing...' : 'Generating response...'}
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto text-[11px]">
        <span className="text-slate-400 font-semibold uppercase text-[10px] flex-shrink-0">
          Suggestions:
        </span>
        {samplePrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(p.query)}
            disabled={isLoading}
            className="flex-shrink-0 px-2 py-1 bg-white border border-slate-200 hover:border-blue-900/40 rounded text-slate-700 text-[11px] transition-colors"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Input area */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 border-t border-slate-200 bg-white flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            useSearch
              ? 'Ask career advice, interview questions, or search live 2026 market data...'
              : 'Ask a question or practice technical interview...'
          }
          disabled={isLoading}
          className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-blue-900 text-slate-800"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="px-4 py-2 bg-blue-900 text-white text-xs font-semibold rounded-md hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Send</span>
        </button>
      </form>
    </div>
  );
};
