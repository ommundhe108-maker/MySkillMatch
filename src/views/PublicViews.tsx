import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Search, Briefcase, GraduationCap, Building2 } from 'lucide-react';
import { Job } from '../data/mockData';

interface PublicHomeProps {
  onNavigate: (page: string) => void;
  onExploreJobs: () => void;
}

export const PublicHome: React.FC<PublicHomeProps> = ({ onNavigate, onExploreJobs }) => {
  return (
    <div className="space-y-10">
      {/* Compact Hero */}
      <div className="bg-white border border-slate-200 rounded-lg p-8 sm:p-10 shadow-xs">
        <div className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-2">
          Skill-to-Job Matching Platform
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Find the right job for your skills.
        </h1>
        <p className="text-slate-600 text-base max-w-2xl mt-3 leading-relaxed">
          Build your profile, discover relevant opportunities, and identify the skills you need to
          grow.
        </p>

        <div className="flex flex-wrap items-center gap-3 mt-6">
          <button
            onClick={() => onNavigate('Register')}
            className="px-5 py-2.5 bg-blue-900 text-white text-sm font-semibold rounded-md hover:bg-blue-800 transition-colors inline-flex items-center gap-2"
          >
            Create Profile
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onExploreJobs}
            className="px-5 py-2.5 bg-white text-slate-700 text-sm font-semibold rounded-md border border-slate-300 hover:bg-slate-50 transition-colors"
          >
            Explore Jobs
          </button>
        </div>
      </div>

      {/* 3 Core Feature Cards */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-4">Core Platform Capabilities</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-2">Personalized Job Matching</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Find opportunities based on your skills, education and preferences with clean,
              transparent compatibility scores.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-2">Skill Gap Analysis</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Understand which skills you already have and what you can improve to qualify for your
              target career roles.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-2">Recruiter Matching</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Companies can discover and shortlist candidates based on concrete job requirements
              rather than keyword guesswork.
            </p>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-4">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* For Students */}
          <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs">
            <div className="text-sm font-bold text-blue-900 mb-4 flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              For Students
            </div>
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <span className="font-mono text-blue-900 font-bold text-base leading-none">01</span>
                <div>
                  <div className="font-semibold text-slate-900">Create Your Profile</div>
                  <div className="text-slate-600 text-xs mt-0.5">
                    Add your degree, branch, verified technical skills, and career preferences.
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="font-mono text-blue-900 font-bold text-base leading-none">02</span>
                <div>
                  <div className="font-semibold text-slate-900">Find Matching Jobs</div>
                  <div className="text-slate-600 text-xs mt-0.5">
                    Browse job openings scored against your specific skill set and academic credentials.
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="font-mono text-blue-900 font-bold text-base leading-none">03</span>
                <div>
                  <div className="font-semibold text-slate-900">Apply &amp; Track</div>
                  <div className="text-slate-600 text-xs mt-0.5">
                    Submit applications with a single click and monitor your recruitment milestones.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* For Companies */}
          <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs">
            <div className="text-sm font-bold text-blue-900 mb-4 flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              For Companies
            </div>
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <span className="font-mono text-blue-900 font-bold text-base leading-none">01</span>
                <div>
                  <div className="font-semibold text-slate-900">Create Company Profile</div>
                  <div className="text-slate-600 text-xs mt-0.5">
                    Set up your organization profile, industry sector, and recruitment contacts.
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="font-mono text-blue-900 font-bold text-base leading-none">02</span>
                <div>
                  <div className="font-semibold text-slate-900">Post Requirements</div>
                  <div className="text-slate-600 text-xs mt-0.5">
                    Define required competencies, preferred libraries, education, and compensation.
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="font-mono text-blue-900 font-bold text-base leading-none">03</span>
                <div>
                  <div className="font-semibold text-slate-900">Find Candidates</div>
                  <div className="text-slate-600 text-xs mt-0.5">
                    Discover and review candidates ranked by skill alignment and qualification score.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AboutView: React.FC = () => {
  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">About SkillMatch</h1>
        <p className="text-sm text-slate-500 mt-1">
          Skill-to-job matching platform built for college hackathon recruitment.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs">
        <p className="text-base text-slate-700 leading-relaxed">
          <strong>SkillMatch</strong> is a skill-based recruitment platform designed to connect job
          seekers with companies using structured profile information and intelligent matching.
        </p>
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900">Our Purpose</h2>
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs text-sm text-slate-600 leading-relaxed">
          College campus recruitment often encounters a mismatch: students struggle to identify
          openings matching their exact technical coursework, while recruiters spend hours sifting
          through generic resumes. SkillMatch creates structural clarity by standardizing technical
          skill inventories and surfacing real skill gap analysis without hyperbole.
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900">How It Works</h2>
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs text-sm text-slate-600 leading-relaxed">
          Profiles and job postings are mapped to canonical skill sets, academic prerequisites, and
          work mode preferences. An objective compatibility calculation computes the match
          percentage, clearly detailing matched competencies alongside missing requirements.
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs text-sm space-y-2">
          <h3 className="font-bold text-slate-900 text-blue-900">For Students</h3>
          <ul className="list-disc pl-5 space-y-1 text-slate-600 text-xs leading-relaxed">
            <li>Find opportunities aligned with your verified degree &amp; programming skills</li>
            <li>Identify exact missing competencies via structured skill gap analysis</li>
            <li>Maintain a clean, academic-focused profile</li>
            <li>Track application status seamlessly</li>
          </ul>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs text-sm space-y-2">
          <h3 className="font-bold text-slate-900 text-blue-900">For Companies</h3>
          <ul className="list-disc pl-5 space-y-1 text-slate-600 text-xs leading-relaxed">
            <li>Post precise required and preferred technical criteria</li>
            <li>Receive ranked applicant queues based on real qualification fit</li>
            <li>Search candidates directly with match reasoning</li>
            <li>Streamline campus and junior developer hiring</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export const LoginView: React.FC<{
  onLogin: (role: 'student' | 'company' | 'admin') => void;
  onNavigateRegister: () => void;
}> = ({ onLogin, onNavigateRegister }) => {
  const [email, setEmail] = useState('student@test.com');
  const [password, setPassword] = useState('password123');
  const [role, setRole] = useState<'student' | 'company' | 'admin'>('student');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(role);
  };

  const setPreset = (selectedRole: 'student' | 'company' | 'admin') => {
    setRole(selectedRole);
    if (selectedRole === 'student') setEmail('student@test.com');
    if (selectedRole === 'company') setEmail('company@test.com');
    if (selectedRole === 'admin') setEmail('admin@test.com');
  };

  return (
    <div className="max-w-md mx-auto py-6">
      <div className="bg-white border border-slate-200 rounded-lg p-8 shadow-xs space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
          <p className="text-xs text-slate-500 mt-1">Sign in to your SkillMatch account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-blue-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-blue-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-blue-900 bg-white"
            >
              <option value="student">Student</option>
              <option value="company">Company</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-blue-900 text-white text-sm font-semibold rounded-md hover:bg-blue-800 transition-colors"
          >
            Login
          </button>
        </form>

        <div className="text-center text-xs text-slate-600 pt-2 border-t border-slate-200">
          Don't have an account?{' '}
          <button
            onClick={onNavigateRegister}
            className="text-blue-900 font-semibold hover:underline"
          >
            Register
          </button>
        </div>

        {/* Demo Fast Login Switcher */}
        <div className="pt-2">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 text-center">
            Demo 1-Click Credentials
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <button
              type="button"
              onClick={() => {
                setPreset('student');
                onLogin('student');
              }}
              className="p-2 border border-slate-200 rounded text-slate-700 hover:bg-slate-50 font-medium"
            >
              Student Demo
            </button>
            <button
              type="button"
              onClick={() => {
                setPreset('company');
                onLogin('company');
              }}
              className="p-2 border border-slate-200 rounded text-slate-700 hover:bg-slate-50 font-medium"
            >
              Company Demo
            </button>
            <button
              type="button"
              onClick={() => {
                setPreset('admin');
                onLogin('admin');
              }}
              className="p-2 border border-slate-200 rounded text-slate-700 hover:bg-slate-50 font-medium"
            >
              Admin Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const RegisterView: React.FC<{
  onRegistered: (role: 'student' | 'company') => void;
  onNavigateLogin: () => void;
}> = ({ onRegistered, onNavigateLogin }) => {
  const [roleTab, setRoleTab] = useState<'student' | 'company'>('student');

  return (
    <div className="max-w-xl mx-auto py-6">
      <div className="bg-white border border-slate-200 rounded-lg p-8 shadow-xs space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Create an Account</h1>
          <p className="text-xs text-slate-500 mt-1">
            Choose your account type to register on SkillMatch.
          </p>
        </div>

        {/* Role Segmented Tabs */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-md text-xs font-semibold">
          <button
            onClick={() => setRoleTab('student')}
            className={`py-2 rounded transition-colors ${
              roleTab === 'student'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Register as Student
          </button>
          <button
            onClick={() => setRoleTab('company')}
            className={`py-2 rounded transition-colors ${
              roleTab === 'company'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Register as Company
          </button>
        </div>

        {roleTab === 'student' ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onRegistered('student');
            }}
            className="space-y-4 text-xs"
          >
            <div>
              <label className="block font-semibold text-slate-700 uppercase mb-1">Full Name</label>
              <input
                type="text"
                required
                defaultValue="Rahul Patil"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-blue-900"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 uppercase mb-1">Email</label>
                <input
                  type="email"
                  required
                  defaultValue="rahul@example.com"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-blue-900"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 uppercase mb-1">Phone</label>
                <input
                  type="tel"
                  defaultValue="+91 98765 43210"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-blue-900"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 uppercase mb-1">Password</label>
                <input
                  type="password"
                  required
                  defaultValue="studentpass123"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-blue-900"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 uppercase mb-1">Location</label>
                <input
                  type="text"
                  defaultValue="Pune, Maharashtra"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-blue-900"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-blue-900 text-white text-sm font-semibold rounded-md hover:bg-blue-800 transition-colors mt-2"
            >
              Create Account
            </button>
          </form>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onRegistered('company');
            }}
            className="space-y-4 text-xs"
          >
            <div>
              <label className="block font-semibold text-slate-700 uppercase mb-1">
                Company Name
              </label>
              <input
                type="text"
                required
                defaultValue="TechNova Solutions"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-blue-900"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 uppercase mb-1">
                  Official Email
                </label>
                <input
                  type="email"
                  required
                  defaultValue="careers@technova.com"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-blue-900"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 uppercase mb-1">
                  Contact Person
                </label>
                <input
                  type="text"
                  defaultValue="Priya Sharma"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-blue-900"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 uppercase mb-1">Password</label>
                <input
                  type="password"
                  required
                  defaultValue="companypass123"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-blue-900"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 uppercase mb-1">Phone</label>
                <input
                  type="tel"
                  defaultValue="+91 98220 11223"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-blue-900"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 uppercase mb-1">Location</label>
                <input
                  type="text"
                  defaultValue="Pune, Maharashtra"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-blue-900"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 uppercase mb-1">Industry</label>
                <input
                  type="text"
                  defaultValue="Software Development"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-blue-900"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-blue-900 text-white text-sm font-semibold rounded-md hover:bg-blue-800 transition-colors mt-2"
            >
              Create Account
            </button>
          </form>
        )}

        <div className="text-center text-xs text-slate-600 pt-2 border-t border-slate-200">
          Already have an account?{' '}
          <button onClick={onNavigateLogin} className="text-blue-900 font-semibold hover:underline">
            Login
          </button>
        </div>
      </div>
    </div>
  );
};
