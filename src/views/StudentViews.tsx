import React, { useState } from 'react';
import { Job, StudentProfile, Application } from '../data/mockData';
import { MetricCard, StatusBadge } from '../components/StatusBadge';
import { Search, Bookmark, Check, Circle, CheckCircle2, AlertCircle, Plus, Trash2 } from 'lucide-react';

/* ==================================================
   FIND JOBS VIEW
================================================== */
export const FindJobsView: React.FC<{
  jobs: Job[];
  savedJobIds: string[];
  onSelectJob: (job: Job) => void;
  onToggleSave: (jobId: string) => void;
}> = ({ jobs, savedJobIds, onSelectJob, onToggleSave }) => {
  const [search, setSearch] = useState('');
  const [locFilter, setLocFilter] = useState('All');
  const [modeFilter, setModeFilter] = useState('All');
  const [expFilter, setExpFilter] = useState('All');

  const filtered = jobs.filter((j) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      j.title.toLowerCase().includes(q) ||
      j.company.toLowerCase().includes(q) ||
      j.requiredSkills.some((s) => s.toLowerCase().includes(q));

    const matchesLoc = locFilter === 'All' || j.location === locFilter;
    const matchesMode = modeFilter === 'All' || j.workMode === modeFilter;
    const matchesExp = expFilter === 'All' || j.experience.includes(expFilter);

    return matchesSearch && matchesLoc && matchesMode && matchesExp;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Find Jobs</h1>
        <p className="text-xs text-slate-500 mt-0.5">Explore opportunities that match your skills.</p>
      </div>

      {/* Search Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by job title, skill, or company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border-none focus:outline-hidden text-slate-800 placeholder-slate-400"
          />
        </div>

        {/* Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-slate-100 text-xs">
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
              Location
            </label>
            <select
              value={locFilter}
              onChange={(e) => setLocFilter(e.target.value)}
              className="w-full p-1.5 border border-slate-200 rounded bg-white text-slate-700"
            >
              <option value="All">All Locations</option>
              <option value="Pune">Pune</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Bengaluru">Bengaluru</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
              Work Mode
            </label>
            <select
              value={modeFilter}
              onChange={(e) => setModeFilter(e.target.value)}
              className="w-full p-1.5 border border-slate-200 rounded bg-white text-slate-700"
            >
              <option value="All">All Modes</option>
              <option value="Hybrid">Hybrid</option>
              <option value="On-site">On-site</option>
              <option value="Remote">Remote</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
              Experience
            </label>
            <select
              value={expFilter}
              onChange={(e) => setExpFilter(e.target.value)}
              className="w-full p-1.5 border border-slate-200 rounded bg-white text-slate-700"
            >
              <option value="All">Any Experience</option>
              <option value="Fresher">Fresher</option>
              <option value="0–1">0–1 years</option>
              <option value="0–2">0–2 years</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSearch('');
                setLocFilter('All');
                setModeFilter('All');
                setExpFilter('All');
              }}
              className="w-full py-1.5 text-xs text-slate-600 border border-slate-200 rounded hover:bg-slate-50 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Job Cards */}
      <div className="text-xs text-slate-500 font-medium">
        Showing {filtered.length} matching positions
      </div>

      <div className="space-y-4">
        {filtered.map((job) => {
          const isSaved = savedJobIds.includes(job.id);
          return (
            <div
              key={job.id}
              className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-2">
                <div>
                  <h3 className="text-base font-bold text-slate-900">{job.title}</h3>
                  <div className="text-xs font-medium text-slate-600 mt-0.5">{job.company}</div>
                </div>

                {/* Metadata with typographic separators */}
                <div className="text-xs text-slate-500 flex items-center flex-wrap gap-1.5">
                  <span>{job.location}</span>
                  <span className="text-slate-300">·</span>
                  <span>{job.workMode}</span>
                  <span className="text-slate-300">·</span>
                  <span>{job.experience}</span>
                  <span className="text-slate-300">·</span>
                  <span className="font-semibold text-slate-800">{job.salary}</span>
                </div>

                <div className="text-xs text-slate-600">
                  <span className="text-slate-400 font-semibold uppercase text-[10px]">
                    Required Skills:{' '}
                  </span>
                  {job.requiredSkills.join(' · ')}
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                <div className="text-right">
                  <span className="text-sm font-bold text-blue-900">{job.matchScore}% Match</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onToggleSave(job.id)}
                    className={`p-2 border rounded-md transition-colors ${
                      isSaved
                        ? 'bg-blue-50 border-blue-300 text-blue-900'
                        : 'border-slate-300 text-slate-600 hover:bg-slate-50'
                    }`}
                    title={isSaved ? 'Remove from saved' : 'Save job'}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-blue-900' : ''}`} />
                  </button>

                  <button
                    onClick={() => onSelectJob(job)}
                    className="px-3.5 py-1.5 bg-blue-900 text-white text-xs font-semibold rounded-md hover:bg-blue-800 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ==================================================
   STUDENT DASHBOARD
================================================== */
export const StudentDashboard: React.FC<{
  student: StudentProfile;
  jobs: Job[];
  savedJobIds: string[];
  onSelectJob: (job: Job) => void;
  onNavigate: (page: string) => void;
}> = ({ student, jobs, savedJobIds, onSelectJob, onNavigate }) => {
  const recommended = jobs.filter((j) => j.matchScore >= 80);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Welcome, {student.name.split(' ')[0]}</h1>
        <p className="text-xs text-slate-500 mt-0.5">Here is your career activity.</p>
      </div>

      {/* Demo statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          label="Profile Completion"
          value={`${student.stats.profileCompletion}%`}
          subtext="Add portfolio to reach 100%"
        />
        <MetricCard
          label="Applications"
          value={student.stats.applications}
          subtext="2 under active review"
        />
        <MetricCard
          label="Saved Jobs"
          value={savedJobIds.length}
          subtext="Available for quick apply"
        />
        <MetricCard
          label="Recommended Jobs"
          value={student.stats.recommendedJobs}
          subtext="Matching verified skills"
        />
      </div>

      {/* Recommended Jobs Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Recommended for You</h2>
          <button
            onClick={() => onNavigate('Find Jobs')}
            className="text-xs text-blue-900 font-semibold hover:underline"
          >
            View all jobs →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommended.map((job) => (
            <div
              key={job.id}
              className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{job.title}</h3>
                    <div className="text-xs text-slate-600 font-medium">{job.company}</div>
                  </div>
                  <span className="text-xs font-bold text-blue-900">{job.matchScore}% Match</span>
                </div>

                <div className="text-xs text-slate-500 flex items-center gap-1.5">
                  <span>{job.location}</span>
                  <span className="text-slate-300">·</span>
                  <span>{job.workMode}</span>
                  <span className="text-slate-300">·</span>
                  <span>{job.salary}</span>
                </div>

                <div className="text-xs text-slate-600">
                  <span className="text-slate-400 font-semibold uppercase text-[10px]">Skills: </span>
                  {job.requiredSkills.slice(0, 3).join(' · ')}
                </div>
              </div>

              <div className="pt-4 mt-3 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => onSelectJob(job)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-blue-900 border border-blue-900/30 rounded hover:bg-blue-50 transition-colors"
                >
                  View Job
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ==================================================
   STUDENT PROFILE VIEW
================================================== */
export const StudentProfileView: React.FC<{
  student: StudentProfile;
  onSaveProfile: (updated: StudentProfile) => void;
}> = ({ student, onSaveProfile }) => {
  const [formData, setFormData] = useState<StudentProfile>(student);
  const [newSkill, setNewSkill] = useState('');
  const [statusMsg, setStatusMsg] = useState(false);

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    const clean = newSkill.trim();
    if (!formData.skills.includes(clean)) {
      setFormData({
        ...formData,
        skills: [...formData.skills, clean],
      });
    }
    setNewSkill('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((s) => s !== skillToRemove),
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(formData);
    setStatusMsg(true);
    setTimeout(() => setStatusMsg(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your verified academic background, skills, and preferences.
          </p>
        </div>
        {statusMsg && (
          <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-1 border border-emerald-200 rounded font-medium">
            Profile saved successfully
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Personal Information */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Personal Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 uppercase mb-1">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-blue-900"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 uppercase mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-blue-900"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 uppercase mb-1">Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-blue-900"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 uppercase mb-1">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-blue-900"
              />
            </div>
          </div>
        </div>

        {/* Education */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Education</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 uppercase mb-1">Degree</label>
              <input
                type="text"
                value={formData.education.degree}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    education: { ...formData.education, degree: e.target.value },
                  })
                }
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-blue-900"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 uppercase mb-1">Branch</label>
              <input
                type="text"
                value={formData.education.branch}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    education: { ...formData.education, branch: e.target.value },
                  })
                }
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-blue-900"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 uppercase mb-1">College</label>
              <input
                type="text"
                value={formData.education.college}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    education: { ...formData.education, college: e.target.value },
                  })
                }
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-blue-900"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-slate-700 uppercase mb-1">
                  Graduation Year
                </label>
                <input
                  type="number"
                  value={formData.education.graduationYear}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      education: { ...formData.education, graduationYear: Number(e.target.value) },
                    })
                  }
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-blue-900"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 uppercase mb-1">CGPA</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.education.cgpa}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      education: { ...formData.education, cgpa: Number(e.target.value) },
                    })
                  }
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-blue-900"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Skills Tag Management */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {formData.skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs border border-slate-300 bg-slate-50 text-slate-800 rounded font-medium"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="text-slate-400 hover:text-rose-600"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="text"
              placeholder="Add skill (e.g. Docker, TypeScript)"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              className="px-3 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-blue-900"
            />
            <button
              type="button"
              onClick={handleAddSkill}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-md border border-slate-300 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Skill
            </button>
          </div>
        </div>

        {/* Experience */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Experience</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 uppercase mb-1">
                Experience Level
              </label>
              <select
                value={formData.experience.type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    experience: { ...formData.experience, type: e.target.value as any },
                  })
                }
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white text-slate-700"
              >
                <option value="Fresher">Fresher</option>
                <option value="Experienced">Experienced</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 uppercase mb-1">
                Years of Experience
              </label>
              <input
                type="number"
                value={formData.experience.years}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    experience: { ...formData.experience, years: Number(e.target.value) },
                  })
                }
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-blue-900"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 uppercase mb-1">
                Previous Role
              </label>
              <input
                type="text"
                value={formData.experience.previousRole}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    experience: { ...formData.experience, previousRole: e.target.value },
                  })
                }
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-blue-900"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 uppercase mb-1">
                Previous Company
              </label>
              <input
                type="text"
                value={formData.experience.previousCompany}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    experience: { ...formData.experience, previousCompany: e.target.value },
                  })
                }
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-blue-900"
              />
            </div>
          </div>
        </div>

        {/* Career Preferences */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Career Preferences
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 uppercase mb-1">
                Desired Role
              </label>
              <input
                type="text"
                value={formData.preferences.desiredRole}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    preferences: { ...formData.preferences, desiredRole: e.target.value },
                  })
                }
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-blue-900"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 uppercase mb-1">
                Preferred Location
              </label>
              <input
                type="text"
                value={formData.preferences.preferredLocation}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    preferences: { ...formData.preferences, preferredLocation: e.target.value },
                  })
                }
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-blue-900"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 uppercase mb-1">Work Mode</label>
              <input
                type="text"
                value={formData.preferences.workMode}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    preferences: { ...formData.preferences, workMode: e.target.value },
                  })
                }
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-blue-900"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 bg-blue-900 text-white text-sm font-semibold rounded-md hover:bg-blue-800 transition-colors"
        >
          Save Profile
        </button>
      </form>
    </div>
  );
};

/* ==================================================
   SKILL ANALYSIS VIEW
================================================== */
export const SkillAnalysisView: React.FC<{
  student: StudentProfile;
  jobs: Job[];
}> = ({ student, jobs }) => {
  const [selectedJobTitle, setSelectedJobTitle] = useState(jobs[0]?.title || 'Python Developer');
  const [analyzed, setAnalyzed] = useState(false);
  const [loading, setLoading] = useState(false);

  const selectedJob = jobs.find((j) => j.title === selectedJobTitle) || jobs[0];
  const studentSkills = new Set(student.skills);
  const matched = selectedJob.requiredSkills.filter((s) => studentSkills.has(s));
  const missing = selectedJob.requiredSkills.filter((s) => !studentSkills.has(s));

  const handleAnalyze = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setAnalyzed(true);
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Skill Analysis</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Understand how your skills compare with your target roles.
        </p>
      </div>

      {/* Your Current Skills */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
          Your Skills
        </h2>
        <div className="text-sm font-medium text-slate-800">{student.skills.join(' · ')}</div>
      </div>

      {/* Target Job Selector */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
            Target Job
          </label>
          <select
            value={selectedJobTitle}
            onChange={(e) => {
              setSelectedJobTitle(e.target.value);
              setAnalyzed(false);
            }}
            className="w-full sm:w-80 px-3 py-2 text-sm border border-slate-300 rounded-md bg-white text-slate-800"
          >
            {jobs.map((j) => (
              <option key={j.id} value={j.title}>
                {j.title} ({j.company})
              </option>
            ))}
          </select>
        </div>

        {/* Required Skills Checklist */}
        <div>
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
            Required Skills Comparison
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-emerald-50/50 border border-emerald-200 rounded-md p-3.5">
              <div className="text-xs font-semibold text-emerald-800 mb-2">
                Matched Skills ({matched.length})
              </div>
              <div className="space-y-1 text-xs">
                {matched.map((s) => (
                  <div key={s} className="flex items-center text-emerald-700">
                    <Check className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-md p-3.5">
              <div className="text-xs font-semibold text-slate-700 mb-2">
                Missing Skills ({missing.length})
              </div>
              <div className="space-y-1 text-xs">
                {missing.length > 0 ? (
                  missing.map((s) => (
                    <div key={s} className="flex items-center text-slate-600">
                      <Circle className="w-3 h-3 mr-1.5 flex-shrink-0 text-slate-400" />
                      <span>{s}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-emerald-700 font-medium">All core requirements met!</div>
                )}
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="px-4 py-2 bg-blue-900 text-white text-xs font-semibold rounded-md hover:bg-blue-800 transition-colors"
        >
          {loading ? 'Analyzing skill gaps...' : 'Analyze Skill Gap'}
        </button>
      </div>

      {/* Suggested Areas to Improve Result Panel */}
      {analyzed && (
        <div className="bg-white border-l-4 border-blue-900 border-t border-r border-b border-slate-200 rounded-r-lg p-5 shadow-xs space-y-2">
          <h3 className="text-sm font-bold text-slate-900">Suggested Areas to Improve</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {missing.length > 0 ? (
              <>
                To qualify with 90%+ match score for <strong>{selectedJob.title}</strong>, focus on
                gaining practical experience in{' '}
                <strong className="text-slate-800">{missing.join(', ')}</strong>. Consider
                completing an open-source project or laboratory exercise demonstrating these
                competencies.
              </>
            ) : (
              <>
                Your profile covers all core skills required for <strong>{selectedJob.title}</strong>.
                We suggest practicing system architecture questions and interview communication.
              </>
            )}
          </p>
        </div>
      )}
    </div>
  );
};

/* ==================================================
   SAVED JOBS VIEW
================================================== */
export const SavedJobsView: React.FC<{
  jobs: Job[];
  savedJobIds: string[];
  onSelectJob: (job: Job) => void;
  onRemoveSaved: (jobId: string) => void;
  onNavigate: (page: string) => void;
}> = ({ jobs, savedJobIds, onSelectJob, onRemoveSaved, onNavigate }) => {
  const saved = jobs.filter((j) => savedJobIds.includes(j.id));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Saved Jobs</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Track openings you've bookmarked for later review.
        </p>
      </div>

      {saved.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-lg p-10 text-center space-y-3">
          <p className="text-sm text-slate-600">You haven't saved any jobs yet.</p>
          <button
            onClick={() => onNavigate('Find Jobs')}
            className="px-4 py-2 bg-blue-900 text-white text-xs font-semibold rounded-md hover:bg-blue-800 transition-colors"
          >
            Explore Open Positions
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {saved.map((job) => (
            <div
              key={job.id}
              className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex items-center justify-between"
            >
              <div>
                <h3 className="text-base font-bold text-slate-900">{job.title}</h3>
                <div className="text-xs text-slate-600 font-medium">{job.company}</div>
                <div className="text-xs text-slate-500 mt-1">
                  <span>{job.location}</span>
                  <span className="mx-1.5 text-slate-300">·</span>
                  <span className="font-semibold text-blue-900">{job.matchScore}% Match</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onSelectJob(job)}
                  className="px-3 py-1.5 text-xs font-semibold text-blue-900 border border-blue-900/30 rounded hover:bg-blue-50 transition-colors"
                >
                  View
                </button>
                <button
                  onClick={() => onRemoveSaved(job.id)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 border border-slate-300 rounded hover:bg-slate-50 transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ==================================================
   APPLICATIONS VIEW
================================================== */
export const ApplicationsView: React.FC<{
  applications: Application[];
}> = ({ applications }) => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Applications</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Review current status across your submitted job applications.
        </p>
      </div>

      {applications.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-lg p-10 text-center text-sm text-slate-600">
          You haven't applied to any jobs yet.
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
              <tr>
                <th className="px-5 py-3">Job Title</th>
                <th className="px-5 py-3">Company</th>
                <th className="px-5 py-3">Applied On</th>
                <th className="px-5 py-3">Match</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-5 py-3.5 font-bold text-slate-900">{app.jobTitle}</td>
                  <td className="px-5 py-3.5">{app.company}</td>
                  <td className="px-5 py-3.5 text-slate-500">{app.appliedOn}</td>
                  <td className="px-5 py-3.5 font-semibold text-blue-900">{app.matchScore}%</td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={app.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
