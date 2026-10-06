import React, { useState } from 'react';
import { Job, CompanyProfile, Applicant } from '../data/mockData';
import { MetricCard, StatusBadge } from '../components/StatusBadge';
import { Plus, CheckCircle2, AlertCircle, Eye, Trash2, XCircle } from 'lucide-react';

/* ==================================================
   COMPANY DASHBOARD
================================================== */
export const CompanyDashboard: React.FC<{
  company: CompanyProfile;
  jobs: Job[];
  onNavigate: (page: string) => void;
  onSelectJob: (job: Job) => void;
}> = ({ company, jobs, onNavigate, onSelectJob }) => {
  const companyJobs = jobs.filter((j) => j.company === company.name || j.company.includes('TechNova'));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Welcome, {company.name}</h1>
        <p className="text-xs text-slate-500 mt-0.5">Manage your hiring activity.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard label="Active Jobs" value={company.stats.activeJobs} subtext="Currently accepting applicants" />
        <MetricCard label="Applicants" value={company.stats.applicants} subtext="Total candidates received" />
        <MetricCard label="Shortlisted" value={company.stats.shortlisted} subtext="Awaiting initial screening" />
        <MetricCard label="Interviews" value={company.stats.interviews} subtext="Scheduled this week" />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Your Recent Jobs</h2>
          <button
            onClick={() => onNavigate('Post Job')}
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-900 text-white text-xs font-semibold rounded-md hover:bg-blue-800 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Post New Job
          </button>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
              <tr>
                <th className="px-5 py-3">Job Title</th>
                <th className="px-5 py-3">Location</th>
                <th className="px-5 py-3">Applicants</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {companyJobs.map((j) => (
                <tr key={j.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-5 py-3.5 font-bold text-slate-900">{j.title}</td>
                  <td className="px-5 py-3.5">{j.location}</td>
                  <td className="px-5 py-3.5">{j.applicantsCount} applicants</td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={j.status} />
                  </td>
                  <td className="px-5 py-3.5 text-right space-x-2">
                    <button
                      onClick={() => onSelectJob(j)}
                      className="px-2.5 py-1 text-slate-700 border border-slate-300 rounded hover:bg-slate-100 transition-colors"
                    >
                      View
                    </button>
                    <button
                      onClick={() => onNavigate('Applicants')}
                      className="px-2.5 py-1 text-blue-900 font-semibold border border-blue-900/30 rounded hover:bg-blue-50 transition-colors"
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

/* ==================================================
   COMPANY PROFILE VIEW
================================================== */
export const CompanyProfileView: React.FC<{
  company: CompanyProfile;
  onSave: (updated: CompanyProfile) => void;
}> = ({ company, onSave }) => {
  const [form, setForm] = useState<CompanyProfile>(company);
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Company Profile</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Update organization details and recruitment contact information.
          </p>
        </div>
        {saved && (
          <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-1 border border-emerald-200 rounded font-medium">
            Changes saved
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs space-y-4 text-xs">
        <div>
          <label className="block font-semibold text-slate-700 uppercase mb-1">Company Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-blue-900"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 uppercase mb-1">Industry</label>
          <input
            type="text"
            value={form.industry}
            onChange={(e) => setForm({ ...form, industry: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-blue-900"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 uppercase mb-1">Description</label>
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-blue-900"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-slate-700 uppercase mb-1">Location</label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-blue-900"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 uppercase mb-1">Website</label>
            <input
              type="url"
              value={form.website}
              onChange={(e) => setForm({ ...form, website: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-blue-900"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-slate-700 uppercase mb-1">Contact Person</label>
            <input
              type="text"
              value={form.contactPerson}
              onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-blue-900"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 uppercase mb-1">Official Phone</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-blue-900"
            />
          </div>
        </div>

        <button
          type="submit"
          className="px-5 py-2.5 bg-blue-900 text-white text-xs font-semibold rounded-md hover:bg-blue-800 transition-colors mt-2"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

/* ==================================================
   POST JOB VIEW
================================================== */
export const PostJobView: React.FC<{
  companyName: string;
  onJobCreated: (newJob: Job) => void;
  onNavigate: (page: string) => void;
}> = ({ companyName, onJobCreated, onNavigate }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [education, setEducation] = useState('B.Tech in Computer Science / IT / AI');
  const [experience, setExperience] = useState('0–2 years');
  const [location, setLocation] = useState('Pune');
  const [workMode, setWorkMode] = useState('Hybrid');
  const [salary, setSalary] = useState('₹4–7 LPA');
  const [requiredSkills, setRequiredSkills] = useState('Python, SQL, Git, REST API');
  const [preferredSkills, setPreferredSkills] = useState('Docker, FastAPI, PostgreSQL');
  const [status, setStatus] = useState<'Open' | 'Draft'>('Open');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !requiredSkills.trim()) return;

    const newJob: Job = {
      id: `job_${Date.now()}`,
      title,
      company: companyName,
      location,
      workMode,
      experience,
      salary,
      requiredSkills: requiredSkills.split(',').map((s) => s.trim()).filter(Boolean),
      preferredSkills: preferredSkills.split(',').map((s) => s.trim()).filter(Boolean),
      education,
      matchScore: 85,
      breakdown: {
        skills: 85,
        education: 90,
        experience: 85,
        role: 85,
        location: 90,
      },
      description,
      status,
      applicantsCount: 0,
      createdDate: '2026-10-01',
    };

    onJobCreated(newJob);
    onNavigate('Manage Jobs');
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Post a New Job</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Define role requirements, required skills, and compensation criteria.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs space-y-4 text-xs">
        <div>
          <label className="block font-semibold text-slate-700 uppercase mb-1">Job Title</label>
          <input
            type="text"
            required
            placeholder="e.g. Python Developer / Backend Engineer"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-blue-900"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 uppercase mb-1">Job Description</label>
          <textarea
            rows={3}
            placeholder="Summarize key responsibilities, project domain, and team requirements..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-blue-900"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-slate-700 uppercase mb-1">Required Education</label>
            <input
              type="text"
              value={education}
              onChange={(e) => setEducation(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-blue-900"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 uppercase mb-1">Experience Required</label>
            <select
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white text-slate-700"
            >
              <option value="Fresher">Fresher</option>
              <option value="0–1 years">0–1 years</option>
              <option value="0–2 years">0–2 years</option>
              <option value="2–4 years">2–4 years</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block font-semibold text-slate-700 uppercase mb-1">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-blue-900"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 uppercase mb-1">Work Mode</label>
            <select
              value={workMode}
              onChange={(e) => setWorkMode(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white text-slate-700"
            >
              <option value="Hybrid">Hybrid</option>
              <option value="On-site">On-site</option>
              <option value="Remote">Remote</option>
            </select>
          </div>
          <div>
            <label className="block font-semibold text-slate-700 uppercase mb-1">Salary Range</label>
            <input
              type="text"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-blue-900"
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 uppercase mb-1">
            Required Skills (comma separated)
          </label>
          <input
            type="text"
            required
            value={requiredSkills}
            onChange={(e) => setRequiredSkills(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-blue-900"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 uppercase mb-1">
            Preferred Skills (comma separated)
          </label>
          <input
            type="text"
            value={preferredSkills}
            onChange={(e) => setPreferredSkills(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-blue-900"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 uppercase mb-1">Job Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            className="w-full sm:w-48 px-3 py-2 text-sm border border-slate-300 rounded-md bg-white text-slate-700"
          >
            <option value="Open">Open</option>
            <option value="Draft">Draft</option>
          </select>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            className="px-5 py-2.5 bg-blue-900 text-white text-xs font-semibold rounded-md hover:bg-blue-800 transition-colors"
          >
            Publish Job
          </button>
          <button
            type="button"
            onClick={() => onNavigate('Manage Jobs')}
            className="px-4 py-2.5 bg-white text-slate-700 text-xs font-semibold rounded-md border border-slate-300 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

/* ==================================================
   MANAGE JOBS VIEW
================================================== */
export const ManageJobsView: React.FC<{
  jobs: Job[];
  companyName: string;
  onNavigate: (page: string) => void;
  onSelectJob: (job: Job) => void;
  onCloseJob: (jobId: string) => void;
}> = ({ jobs, companyName, onNavigate, onSelectJob, onCloseJob }) => {
  const companyJobs = jobs.filter((j) => j.company === companyName || j.company.includes('TechNova'));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manage Jobs</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Active and archived postings for {companyName}.
          </p>
        </div>
        <button
          onClick={() => onNavigate('Post Job')}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-900 text-white text-xs font-semibold rounded-md hover:bg-blue-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Post New Job
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
            <tr>
              <th className="px-5 py-3">Job Title</th>
              <th className="px-5 py-3">Location</th>
              <th className="px-5 py-3">Applicants</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Created</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {companyJobs.map((j) => (
              <tr key={j.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="px-5 py-3.5 font-bold text-slate-900">{j.title}</td>
                <td className="px-5 py-3.5">{j.location}</td>
                <td className="px-5 py-3.5">{j.applicantsCount}</td>
                <td className="px-5 py-3.5">
                  <StatusBadge status={j.status} />
                </td>
                <td className="px-5 py-3.5 text-slate-500">{j.createdDate}</td>
                <td className="px-5 py-3.5 text-right space-x-1.5">
                  <button
                    onClick={() => onSelectJob(j)}
                    className="px-2.5 py-1 text-slate-700 border border-slate-300 rounded hover:bg-slate-50 transition-colors"
                  >
                    View
                  </button>
                  <button
                    onClick={() => onNavigate('Applicants')}
                    className="px-2.5 py-1 text-blue-900 font-semibold border border-blue-900/30 rounded hover:bg-blue-50 transition-colors"
                  >
                    Applicants
                  </button>
                  {j.status !== 'Closed' && (
                    <button
                      onClick={() => onCloseJob(j.id)}
                      className="px-2.5 py-1 text-rose-700 border border-rose-300 rounded hover:bg-rose-50 transition-colors"
                    >
                      Close
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* ==================================================
   APPLICANTS VIEW
================================================== */
export const ApplicantsView: React.FC<{
  applicants: Applicant[];
  jobs: Job[];
  onViewApplicant: (cand: Applicant) => void;
}> = ({ applicants, jobs, onViewApplicant }) => {
  const [selectedJobTitle, setSelectedJobTitle] = useState('Python Developer');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Applicants</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Review candidate submissions for your open positions.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs flex items-center gap-3">
        <label className="text-xs font-bold text-slate-700 uppercase">Selected Job:</label>
        <select
          value={selectedJobTitle}
          onChange={(e) => setSelectedJobTitle(e.target.value)}
          className="px-3 py-1.5 text-xs border border-slate-300 rounded-md bg-white text-slate-800"
        >
          <option value="Python Developer">Python Developer</option>
          <option value="Data Analyst">Data Analyst</option>
        </select>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
            <tr>
              <th className="px-5 py-3">Candidate</th>
              <th className="px-5 py-3">Education</th>
              <th className="px-5 py-3">Skills</th>
              <th className="px-5 py-3">Match</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {applicants.map((cand) => (
              <tr key={cand.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="px-5 py-3.5 font-bold text-slate-900">{cand.name}</td>
                <td className="px-5 py-3.5 text-slate-600">{cand.education}</td>
                <td className="px-5 py-3.5">{cand.skills.join(', ')}</td>
                <td className="px-5 py-3.5 font-bold text-blue-900">{cand.matchScore}%</td>
                <td className="px-5 py-3.5">
                  <StatusBadge status={cand.status} />
                </td>
                <td className="px-5 py-3.5 text-right">
                  <button
                    onClick={() => onViewApplicant(cand)}
                    className="px-3 py-1.5 bg-blue-900 text-white font-medium rounded hover:bg-blue-800 transition-colors"
                  >
                    View Candidate
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* ==================================================
   FIND CANDIDATES VIEW
================================================== */
export const FindCandidatesView: React.FC<{
  applicants: Applicant[];
  onViewCandidate: (cand: Applicant) => void;
}> = ({ applicants, onViewCandidate }) => {
  const [selectedJob, setSelectedJob] = useState('Python Developer');
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(true);

  const handleSearch = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSearched(true);
    }, 500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Find Matching Candidates</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Discover registered student profiles that fit your criteria.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex flex-wrap items-end gap-3">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
            Select Job Position
          </label>
          <select
            value={selectedJob}
            onChange={(e) => setSelectedJob(e.target.value)}
            className="w-64 px-3 py-2 text-xs border border-slate-300 rounded-md bg-white text-slate-800"
          >
            <option value="Python Developer">Python Developer</option>
            <option value="Data Analyst">Data Analyst</option>
          </select>
        </div>

        <button
          onClick={handleSearch}
          disabled={loading}
          className="px-4 py-2 bg-blue-900 text-white text-xs font-semibold rounded-md hover:bg-blue-800 transition-colors"
        >
          {loading ? 'Finding candidates...' : 'Find Candidates'}
        </button>
      </div>

      {searched && (
        <div className="space-y-4">
          {applicants.map((cand) => (
            <div
              key={cand.id}
              className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex flex-col sm:flex-row sm:items-start justify-between gap-4"
            >
              <div className="space-y-2">
                <div>
                  <h3 className="text-base font-bold text-slate-900">{cand.name}</h3>
                  <div className="text-xs text-slate-500 mt-0.5">{cand.education}</div>
                </div>

                <div className="text-xs space-y-1">
                  <div>
                    <span className="font-semibold text-emerald-800">Matched Skills: </span>
                    <span className="text-slate-700">{cand.matchedSkills.join(' · ')}</span>
                  </div>
                  {cand.missingSkills.length > 0 && (
                    <div>
                      <span className="font-semibold text-slate-500">Missing Skills: </span>
                      <span className="text-slate-600">{cand.missingSkills.join(' · ')}</span>
                    </div>
                  )}
                </div>

                <div className="bg-slate-50 border-l-2 border-blue-900 p-2.5 rounded text-xs text-slate-600">
                  <span className="font-semibold text-slate-800">AI Match Explanation: </span>
                  {cand.explanation}
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                <div className="text-right">
                  <span className="text-lg font-bold text-blue-900">{cand.matchScore}%</span>
                  <span className="block text-[11px] text-slate-400">Compatibility</span>
                </div>
                <button
                  onClick={() => onViewCandidate(cand)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-blue-900 border border-blue-900/30 rounded hover:bg-blue-50 transition-colors"
                >
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
