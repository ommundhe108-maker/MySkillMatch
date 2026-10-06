import React from 'react';
import { Job, StudentProfile } from '../data/mockData';
import { Bookmark, Check, Circle, X } from 'lucide-react';

interface JobDetailsModalProps {
  job: Job | null;
  student: StudentProfile;
  isSaved: boolean;
  hasApplied: boolean;
  onClose: () => void;
  onApply: (job: Job) => void;
  onToggleSave: (jobId: string) => void;
}

export const JobDetailsModal: React.FC<JobDetailsModalProps> = ({
  job,
  student,
  isSaved,
  hasApplied,
  onClose,
  onApply,
  onToggleSave,
}) => {
  if (!job) return null;

  const studentSkills = new Set(student.skills);
  const matched = job.requiredSkills.filter((s) => studentSkills.has(s));
  const missing = job.requiredSkills.filter((s) => !studentSkills.has(s));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
      <div className="bg-white border border-slate-200 rounded-lg max-w-2xl w-full max-h-[90vh] flex flex-col shadow-lg overflow-hidden">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">{job.title}</h2>
            <div className="text-sm text-slate-600 mt-0.5">
              <span>{job.company}</span>
              <span className="mx-2 text-slate-300">·</span>
              <span>{job.location}</span>
              <span className="mx-2 text-slate-300">·</span>
              <span>{job.workMode}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="px-6 py-5 overflow-y-auto space-y-6 text-sm text-slate-700">
          {/* Match Score Bar */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-slate-900">Calculated Compatibility</span>
              <span className="text-base font-bold text-blue-900">{job.matchScore}% Match</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-blue-900 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${job.matchScore}%` }}
              />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-3 pt-3 border-t border-slate-200 text-xs text-slate-600">
              <div>
                <span className="text-slate-400 block">Skills</span>
                <span className="font-medium text-slate-800">{job.breakdown.skills}%</span>
              </div>
              <div>
                <span className="text-slate-400 block">Education</span>
                <span className="font-medium text-slate-800">{job.breakdown.education}%</span>
              </div>
              <div>
                <span className="text-slate-400 block">Experience</span>
                <span className="font-medium text-slate-800">{job.breakdown.experience}%</span>
              </div>
              <div>
                <span className="text-slate-400 block">Role</span>
                <span className="font-medium text-slate-800">{job.breakdown.role}%</span>
              </div>
              <div>
                <span className="text-slate-400 block">Location</span>
                <span className="font-medium text-slate-800">{job.breakdown.location}%</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-2">Job Description</h3>
            <p className="leading-relaxed text-slate-600">{job.description}</p>
          </div>

          {/* Specifications */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-b border-slate-200 py-4">
            <div>
              <span className="text-xs text-slate-400 uppercase font-semibold block">Education</span>
              <span className="font-medium text-slate-800">{job.education}</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 uppercase font-semibold block">Experience</span>
              <span className="font-medium text-slate-800">{job.experience}</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 uppercase font-semibold block">Compensation</span>
              <span className="font-medium text-slate-800">{job.salary}</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 uppercase font-semibold block">Work Mode</span>
              <span className="font-medium text-slate-800">
                {job.workMode} ({job.location})
              </span>
            </div>
          </div>

          {/* Skills Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Required Skills</h3>
              <div className="space-y-1.5">
                {job.requiredSkills.map((s) => {
                  const has = studentSkills.has(s);
                  return (
                    <div key={s} className="flex items-center text-xs">
                      {has ? (
                        <Check className="w-4 h-4 text-emerald-600 mr-2 flex-shrink-0" />
                      ) : (
                        <Circle className="w-3.5 h-3.5 text-slate-400 mr-2 flex-shrink-0" />
                      )}
                      <span className={has ? 'font-medium text-slate-900' : 'text-slate-600'}>
                        {s}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Preferred Skills</h3>
              <div className="space-y-1.5">
                {job.preferredSkills.map((s) => {
                  const has = studentSkills.has(s);
                  return (
                    <div key={s} className="flex items-center text-xs">
                      {has ? (
                        <Check className="w-4 h-4 text-emerald-600 mr-2 flex-shrink-0" />
                      ) : (
                        <Circle className="w-3.5 h-3.5 text-slate-400 mr-2 flex-shrink-0" />
                      )}
                      <span className={has ? 'font-medium text-slate-900' : 'text-slate-600'}>
                        {s}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Clean AI Skill Gap Section */}
          <div className="bg-slate-50 border-l-2 border-blue-900 rounded p-4 text-xs space-y-2">
            <div className="font-semibold text-slate-900">AI Skill Gap Analysis</div>
            <p className="text-slate-600 leading-relaxed">
              {missing.length > 0 ? (
                <>
                  You have matched <strong>{matched.join(', ')}</strong>. To enhance qualification
                  for this role, acquire foundational knowledge in:{' '}
                  <strong className="text-slate-900">{missing.join(', ')}</strong>.
                </>
              ) : (
                'You meet all specified core skill requirements for this position. Your profile has high recruitment viability.'
              )}
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            onClick={() => onToggleSave(job.id)}
            className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium border rounded-md transition-colors ${
              isSaved
                ? 'bg-blue-50 text-blue-900 border-blue-300'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-blue-900' : ''}`} />
            {isSaved ? 'Saved' : 'Save Job'}
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 border border-slate-300 rounded-md bg-white hover:bg-slate-100 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => onApply(job)}
              disabled={hasApplied}
              className={`px-4 py-2 text-xs font-medium rounded-md transition-colors ${
                hasApplied
                  ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                  : 'bg-blue-900 text-white hover:bg-blue-800'
              }`}
            >
              {hasApplied ? 'Applied' : 'Apply Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
