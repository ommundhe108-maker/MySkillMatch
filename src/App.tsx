/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  initialStudent,
  initialCompany,
  initialJobs,
  initialApplications,
  initialApplicants,
  Job,
  StudentProfile,
  CompanyProfile,
  Application,
  Applicant,
} from './data/mockData';
import { PublicHome, AboutView, LoginView, RegisterView } from './views/PublicViews';
import {
  FindJobsView,
  StudentDashboard,
  StudentProfileView,
  SkillAnalysisView,
  SavedJobsView,
  ApplicationsView,
} from './views/StudentViews';
import {
  CompanyDashboard,
  CompanyProfileView,
  PostJobView,
  ManageJobsView,
  ApplicantsView,
  FindCandidatesView,
} from './views/CompanyViews';
import { AdminDashboard } from './views/AdminDashboard';
import { JobDetailsModal } from './components/JobDetailsModal';
import { ApplicantModal } from './components/ApplicantModal';
import { PythonCodeViewer } from './components/PythonCodeViewer';
import { GeminiChatbot } from './components/GeminiChatbot';
import {
  Briefcase,
  User,
  Building2,
  Shield,
  LogOut,
  Code2,
  Layers,
  ChevronDown,
  MessageSquare,
  Sparkles,
  Database,
} from 'lucide-react';

export default function App() {
  // App state
  const [userRole, setUserRole] = useState<'guest' | 'student' | 'company' | 'admin'>('guest');
  const [userName, setUserName] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<string>('Home');
  const [activeTab, setActiveTab] = useState<'ui' | 'code'>('ui');

  // Domain data state with localStorage persistence for standalone Netlify deployment
  const [student, setStudent] = useState<StudentProfile>(() => {
    try {
      const saved = localStorage.getItem('skillmatch_student');
      return saved ? JSON.parse(saved) : initialStudent;
    } catch {
      return initialStudent;
    }
  });

  const [company, setCompany] = useState<CompanyProfile>(() => {
    try {
      const saved = localStorage.getItem('skillmatch_company');
      return saved ? JSON.parse(saved) : initialCompany;
    } catch {
      return initialCompany;
    }
  });

  const [jobs, setJobs] = useState<Job[]>(() => {
    try {
      const saved = localStorage.getItem('skillmatch_jobs');
      return saved ? JSON.parse(saved) : initialJobs;
    } catch {
      return initialJobs;
    }
  });

  const [applications, setApplications] = useState<Application[]>(() => {
    try {
      const saved = localStorage.getItem('skillmatch_applications');
      return saved ? JSON.parse(saved) : initialApplications;
    } catch {
      return initialApplications;
    }
  });

  const [applicants, setApplicants] = useState<Applicant[]>(() => {
    try {
      const saved = localStorage.getItem('skillmatch_applicants');
      return saved ? JSON.parse(saved) : initialApplicants;
    } catch {
      return initialApplicants;
    }
  });

  const [savedJobIds, setSavedJobIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('skillmatch_saved_job_ids');
      return saved ? JSON.parse(saved) : ['job_01', 'job_03'];
    } catch {
      return ['job_01', 'job_03'];
    }
  });

  // Sync state to localStorage for Netlify persistence
  useEffect(() => {
    try {
      localStorage.setItem('skillmatch_jobs', JSON.stringify(jobs));
    } catch {}
  }, [jobs]);

  useEffect(() => {
    try {
      localStorage.setItem('skillmatch_applications', JSON.stringify(applications));
    } catch {}
  }, [applications]);

  useEffect(() => {
    try {
      localStorage.setItem('skillmatch_applicants', JSON.stringify(applicants));
    } catch {}
  }, [applicants]);

  useEffect(() => {
    try {
      localStorage.setItem('skillmatch_saved_job_ids', JSON.stringify(savedJobIds));
    } catch {}
  }, [savedJobIds]);

  useEffect(() => {
    try {
      localStorage.setItem('skillmatch_student', JSON.stringify(student));
    } catch {}
  }, [student]);

  useEffect(() => {
    try {
      localStorage.setItem('skillmatch_company', JSON.stringify(company));
    } catch {}
  }, [company]);

  // Live Python DB stats
  const [pythonDbStatus, setPythonDbStatus] = useState<{ connected: boolean; activeJobs?: number }>({
    connected: false,
  });

  // Fetch initial data from Python SQLite backend
  useEffect(() => {
    const syncWithPythonDb = async () => {
      try {
        const statusRes = await fetch('/api/python/status');
        if (statusRes.ok) {
          const statusData = await statusRes.json();
          setPythonDbStatus({
            connected: true,
            activeJobs: statusData.stats?.active_jobs,
          });
        }

        const jobsRes = await fetch('/api/python/jobs');
        if (jobsRes.ok) {
          const pythonJobs = await jobsRes.json();
          if (Array.isArray(pythonJobs) && pythonJobs.length > 0) {
            // Map python DB fields to Job model
            const mappedJobs: Job[] = pythonJobs.map((j: any) => {
              const skills = Array.isArray(j.skills) ? j.skills : [];
              return {
                id: j.id,
                title: j.title,
                company: j.company,
                location: j.location,
                workMode: j.location?.includes('Remote') ? 'Remote' : (j.location?.includes('Hybrid') ? 'Hybrid' : 'On-site'),
                experience: j.experience || '0-1 Years',
                salary: j.salary,
                requiredSkills: skills.slice(0, 4),
                preferredSkills: skills.slice(4),
                education: 'B.Tech / B.E. in CS / IT',
                matchScore: j.match_score || 85,
                breakdown: {
                  skills: Math.min(100, (j.match_score || 85) + 2),
                  education: 95,
                  experience: 85,
                  role: 90,
                  location: 88,
                },
                description: j.description || '',
                status: (j.status as 'Open' | 'Closed' | 'Draft') || 'Open',
                applicantsCount: j.applicants_count || 0,
                createdDate: j.posted_date || '28 Sep 2026',
              };
            });
            setJobs(mappedJobs);
          }
        }

        const appsRes = await fetch('/api/python/applications');
        if (appsRes.ok) {
          const pythonApps = await appsRes.json();
          if (Array.isArray(pythonApps) && pythonApps.length > 0) {
            const mappedApps: Application[] = pythonApps.map((a: any) => ({
              id: a.id,
              jobId: a.job_id,
              jobTitle: a.job_title,
              company: a.company,
              location: a.location,
              appliedOn: a.applied_on || '01 Oct 2026',
              matchScore: a.match_score || 85,
              status: (a.status as Application['status']) || 'Applied',
            }));
            setApplications(mappedApps);
          }
        }
      } catch (err) {
        console.warn('Note: Python DB sync error, using in-memory dataset:', err);
      }
    };

    syncWithPythonDb();
  }, []);

  // Modals state
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [isDockedChatOpen, setIsDockedChatOpen] = useState(false);

  // Role login handler
  const handleLoginRole = (role: 'student' | 'company' | 'admin') => {
    setUserRole(role);
    if (role === 'student') {
      setUserName('Rahul Patil');
      setCurrentPage('Student Dashboard');
    } else if (role === 'company') {
      setUserName('TechNova Solutions');
      setCurrentPage('Company Dashboard');
    } else if (role === 'admin') {
      setUserName('Admin User');
      setCurrentPage('Admin Dashboard');
    }
  };

  const handleLogout = () => {
    setUserRole('guest');
    setUserName('');
    setCurrentPage('Home');
  };

  // Job saving toggle
  const handleToggleSaveJob = (jobId: string) => {
    setSavedJobIds((prev) =>
      prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]
    );
  };

  // Job apply handler with Python SQLite backend persistence
  const handleApplyJob = async (job: Job) => {
    const exists = applications.some((a) => a.jobId === job.id || a.jobTitle === job.title);
    if (!exists) {
      const newApp: Application = {
        id: `app_${Date.now()}`,
        jobId: job.id,
        jobTitle: job.title,
        company: job.company,
        location: job.location,
        appliedOn: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        matchScore: job.matchScore,
        status: 'Applied',
      };
      setApplications([newApp, ...applications]);
      setStudent((prev) => ({
        ...prev,
        stats: {
          ...prev.stats,
          applications: prev.stats.applications + 1,
        },
      }));

      // Persist to Python SQLite database
      try {
        await fetch('/api/python/apply', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: newApp.id,
            jobId: job.id,
            jobTitle: job.title,
            company: job.company,
            location: job.location,
            matchScore: job.matchScore,
            studentId: 'student_01',
            studentName: 'Rahul Patil',
          }),
        });
      } catch (err) {
        console.error('Failed to persist application in SQLite database:', err);
      }
    }
  };

  // New job created by company with Python SQLite backend persistence
  const handleJobCreated = async (newJob: Job) => {
    setJobs([newJob, ...jobs]);
    setCompany((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        activeJobs: prev.stats.activeJobs + 1,
      },
    }));

    // Persist to Python SQLite database
    try {
      await fetch('/api/python/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newJob),
      });
    } catch (err) {
      console.error('Failed to persist job to Python database:', err);
    }
  };

  // Close job
  const handleCloseJob = (jobId: string) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, status: 'Closed' as const } : j))
    );
  };

  // Applicant status change with Python SQLite backend persistence
  const handleApplicantStatusChange = async (newStatus: Applicant['status']) => {
    if (!selectedApplicant) return;
    setApplicants((prev) =>
      prev.map((a) => (a.id === selectedApplicant.id ? { ...a, status: newStatus } : a))
    );
    setSelectedApplicant((prev) => (prev ? { ...prev, status: newStatus } : null));

    // Persist to Python SQLite database
    try {
      await fetch('/api/python/applicant-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicantId: selectedApplicant.id,
          status: newStatus,
        }),
      });
    } catch (err) {
      console.error('Failed to update status in Python SQLite database:', err);
    }
  };

  // Dynamic Navigation menu items based on current role
  let navItems: string[] = [];
  if (userRole === 'guest') {
    navItems = ['Home', 'Find Jobs', 'AI Assistant', 'About', 'Login', 'Register'];
  } else if (userRole === 'student') {
    navItems = [
      'Student Dashboard',
      'My Profile',
      'Find Jobs',
      'Skill Analysis',
      'Saved Jobs',
      'My Applications',
      'AI Assistant',
    ];
  } else if (userRole === 'company') {
    navItems = [
      'Company Dashboard',
      'Company Profile',
      'Post Job',
      'Manage Jobs',
      'Applicants',
      'Find Candidates',
      'AI Assistant',
    ];
  } else if (userRole === 'admin') {
    navItems = ['Admin Dashboard', 'AI Assistant'];
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Utility Ribbon */}
      <div className="bg-slate-900 text-slate-300 text-xs px-4 py-2 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-white tracking-wide">SkillMatch</span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-400 hidden sm:inline">
            College Hackathon Recruitment Platform
          </span>
          <span className="text-slate-600 hidden md:inline">|</span>
          <button
            onClick={() => setActiveTab('code')}
            className="hidden md:inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] bg-slate-800 border border-slate-700 text-emerald-400 hover:bg-slate-700 transition-colors"
            title="Inspect live SQLite database and Streamlit Community Cloud hosting files"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Python &amp; SQLite DB Active
            {pythonDbStatus.activeJobs !== undefined && (
              <span className="text-slate-400">({pythonDbStatus.activeJobs} jobs)</span>
            )}
          </button>
        </div>

        <div className="flex items-center gap-3">
          {/* View mode toggle */}
          <div className="flex items-center bg-slate-800 rounded p-0.5 text-[11px]">
            <button
              onClick={() => setActiveTab('ui')}
              className={`px-2 py-0.5 rounded transition-colors flex items-center gap-1 ${
                activeTab === 'ui' ? 'bg-blue-800 text-white font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3 h-3" />
              Interactive UI
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`px-2 py-0.5 rounded transition-colors flex items-center gap-1 ${
                activeTab === 'code' ? 'bg-blue-800 text-white font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Code2 className="w-3 h-3" />
              Python &amp; Streamlit Cloud
            </button>
          </div>

          {/* Quick Demo Switcher */}
          <div className="flex items-center gap-1 text-[11px]">
            <span className="text-slate-400 hidden md:inline">Demo Switch:</span>
            <button
              onClick={() => handleLoginRole('student')}
              className={`px-2 py-0.5 rounded transition-colors ${
                userRole === 'student'
                  ? 'bg-blue-700 text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Student
            </button>
            <button
              onClick={() => handleLoginRole('company')}
              className={`px-2 py-0.5 rounded transition-colors ${
                userRole === 'company'
                  ? 'bg-blue-700 text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Company
            </button>
            <button
              onClick={() => handleLoginRole('admin')}
              className={`px-2 py-0.5 rounded transition-colors ${
                userRole === 'admin'
                  ? 'bg-blue-700 text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Admin
            </button>
            {userRole !== 'guest' && (
              <button
                onClick={handleLogout}
                className="text-slate-400 hover:text-rose-400 px-1.5 py-0.5 ml-1"
                title="Logout to Guest"
              >
                <LogOut className="w-3 h-3 inline" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo Branding */}
          <div
            onClick={() => setCurrentPage(userRole === 'guest' ? 'Home' : `${userRole.charAt(0).toUpperCase() + userRole.slice(1)} Dashboard`)}
            className="cursor-pointer flex items-baseline gap-2 select-none"
          >
            <span className="text-xl font-bold tracking-tight text-blue-900">SkillMatch</span>
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">
              · Find the right job for your skills
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1 sm:gap-2">
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => {
                  setActiveTab('ui');
                  setCurrentPage(item);
                }}
                className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  currentPage === item && activeTab === 'ui'
                    ? 'text-blue-900 bg-blue-50 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {item}
              </button>
            ))}

            {userRole !== 'guest' && (
              <div className="flex items-center pl-2 ml-1 border-l border-slate-200">
                <span className="text-xs font-semibold text-slate-800 mr-2 hidden md:inline">
                  {userName}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-2.5 py-1 text-xs text-slate-600 border border-slate-300 rounded hover:bg-slate-100 transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </nav>
        </div>
      </header>

      {/* Main Application Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6">
        {activeTab === 'code' ? (
          <PythonCodeViewer />
        ) : (
          <>
            {/* PUBLIC PAGES */}
            {currentPage === 'Home' && (
              <PublicHome
                onNavigate={setCurrentPage}
                onExploreJobs={() => setCurrentPage('Find Jobs')}
              />
            )}
            {currentPage === 'Find Jobs' && (
              <FindJobsView
                jobs={jobs}
                savedJobIds={savedJobIds}
                onSelectJob={(job) => setSelectedJob(job)}
                onToggleSave={handleToggleSaveJob}
              />
            )}
            {currentPage === 'About' && <AboutView />}
            {currentPage === 'Login' && (
              <LoginView
                onLogin={handleLoginRole}
                onNavigateRegister={() => setCurrentPage('Register')}
              />
            )}
            {currentPage === 'Register' && (
              <RegisterView
                onRegistered={handleLoginRole}
                onNavigateLogin={() => setCurrentPage('Login')}
              />
            )}

            {/* STUDENT PAGES */}
            {currentPage === 'Student Dashboard' && (
              <StudentDashboard
                student={student}
                jobs={jobs}
                savedJobIds={savedJobIds}
                onSelectJob={(job) => setSelectedJob(job)}
                onNavigate={setCurrentPage}
              />
            )}
            {currentPage === 'My Profile' && (
              <StudentProfileView student={student} onSaveProfile={setStudent} />
            )}
            {currentPage === 'Skill Analysis' && (
              <SkillAnalysisView student={student} jobs={jobs} />
            )}
            {currentPage === 'Saved Jobs' && (
              <SavedJobsView
                jobs={jobs}
                savedJobIds={savedJobIds}
                onSelectJob={(job) => setSelectedJob(job)}
                onRemoveSaved={handleToggleSaveJob}
                onNavigate={setCurrentPage}
              />
            )}
            {currentPage === 'My Applications' && (
              <ApplicationsView applications={applications} />
            )}

            {/* COMPANY PAGES */}
            {currentPage === 'Company Dashboard' && (
              <CompanyDashboard
                company={company}
                jobs={jobs}
                onNavigate={setCurrentPage}
                onSelectJob={(job) => setSelectedJob(job)}
              />
            )}
            {currentPage === 'Company Profile' && (
              <CompanyProfileView company={company} onSave={setCompany} />
            )}
            {currentPage === 'Post Job' && (
              <PostJobView
                companyName={company.name}
                onJobCreated={handleJobCreated}
                onNavigate={setCurrentPage}
              />
            )}
            {currentPage === 'Manage Jobs' && (
              <ManageJobsView
                jobs={jobs}
                companyName={company.name}
                onNavigate={setCurrentPage}
                onSelectJob={(job) => setSelectedJob(job)}
                onCloseJob={handleCloseJob}
              />
            )}
            {currentPage === 'Applicants' && (
              <ApplicantsView
                applicants={applicants}
                jobs={jobs}
                onViewApplicant={(cand) => setSelectedApplicant(cand)}
              />
            )}
            {currentPage === 'Find Candidates' && (
              <FindCandidatesView
                applicants={applicants}
                onViewCandidate={(cand) => setSelectedApplicant(cand)}
              />
            )}

            {/* ADMIN PAGE */}
            {currentPage === 'Admin Dashboard' && <AdminDashboard />}

            {/* GEMINI CHATBOT PAGE */}
            {currentPage === 'AI Assistant' && (
              <div className="space-y-4">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-blue-900" />
                    AI Career &amp; Recruitment Assistant
                  </h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Powered by Gemini 3.5 &amp; 3.1 with real-time Google Search Grounding for live 2026 tech hiring benchmarks.
                  </p>
                </div>
                <GeminiChatbot student={student} activeJob={selectedJob} mode="fullscreen" />
              </div>
            )}
          </>
        )}
      </main>

      {/* Floating Docked Gemini Chatbot Button & Drawer */}
      <div className="fixed bottom-5 right-5 z-50">
        {isDockedChatOpen ? (
          <div className="shadow-2xl rounded-lg">
            <GeminiChatbot
              student={student}
              activeJob={selectedJob}
              mode="docked"
              onCloseDocked={() => setIsDockedChatOpen(false)}
            />
          </div>
        ) : (
          <button
            onClick={() => setIsDockedChatOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-900 text-white rounded-full shadow-lg hover:bg-blue-800 transition-all text-xs font-semibold hover:scale-105 active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Chat with Gemini AI</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </button>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            <span className="font-semibold text-slate-800">SkillMatch</span>
            <span className="mx-2">·</span>
            <span>Skill-to-Job Matching Platform for College Recruitment</span>
          </div>
          <div>Designed for genuine college hackathon presentation (Frontend Ready)</div>
        </div>
      </footer>

      {/* Modals */}
      {selectedJob && (
        <JobDetailsModal
          job={selectedJob}
          student={student}
          isSaved={savedJobIds.includes(selectedJob.id)}
          hasApplied={applications.some(
            (a) => a.jobId === selectedJob.id || a.jobTitle === selectedJob.title
          )}
          onClose={() => setSelectedJob(null)}
          onApply={(job) => {
            handleApplyJob(job);
            setSelectedJob(null);
          }}
          onToggleSave={handleToggleSaveJob}
        />
      )}

      {selectedApplicant && (
        <ApplicantModal
          applicant={selectedApplicant}
          onClose={() => setSelectedApplicant(null)}
          onStatusChange={handleApplicantStatusChange}
        />
      )}
    </div>
  );
}
