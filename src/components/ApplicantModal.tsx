import React from 'react';
import { Applicant } from '../data/mockData';
import { StatusBadge } from './StatusBadge';
import { X, CheckCircle2, AlertCircle } from 'lucide-react';

interface ApplicantModalProps {
  applicant: Applicant | null;
  onClose: () => void;
  onStatusChange?: (status: Applicant['status']) => void;
}

export const ApplicantModal: React.FC<ApplicantModalProps> = ({
  applicant,
  onClose,
  onStatusChange,
}) => {
  if (!applicant) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
      <div className="bg-white border border-slate-200 rounded-lg max-w-xl w-full max-h-[90vh] flex flex-col shadow-lg overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">{applicant.name}</h2>
              <StatusBadge status={applicant.status} />
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {applicant.education} · Applied on {applicant.appliedDate}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5 overflow-y-auto space-y-5 text-sm text-slate-700">
          {/* Match Score Summary */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-500 uppercase font-semibold">Match Score</div>
              <div className="text-xl font-bold text-blue-900">{applicant.matchScore}%</div>
            </div>
            <div className="text-xs text-slate-600 text-right">
              Verified through coursework &amp; profile data
            </div>
          </div>

          {/* Skill Breakdown */}
          <div className="space-y-3">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase block mb-1.5">
                Matched Requirements
              </span>
              <div className="flex flex-wrap gap-1.5">
                {applicant.matchedSkills.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded border border-emerald-200 bg-emerald-50 text-emerald-800"
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {applicant.missingSkills.length > 0 && (
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase block mb-1.5">
                  Missing Requirements
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {applicant.missingSkills.map((s) => (
                    <span
                      key={s}
                      className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded border border-slate-200 bg-slate-100 text-slate-600"
                    >
                      <AlertCircle className="w-3 h-3 text-slate-400" />
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* AI Match Explanation */}
          <div className="bg-slate-50 border-l-2 border-blue-900 p-3.5 rounded text-xs">
            <div className="font-semibold text-slate-900 mb-1">AI Match Explanation</div>
            <p className="text-slate-600 leading-relaxed">{applicant.explanation}</p>
          </div>

          {/* Status update actions */}
          {onStatusChange && (
            <div className="border-t border-slate-200 pt-3">
              <span className="text-xs font-semibold text-slate-500 uppercase block mb-2">
                Update Candidate Status
              </span>
              <div className="flex flex-wrap gap-2">
                {(['Applied', 'Shortlisted', 'Interview', 'Selected', 'Rejected'] as const).map(
                  (st) => (
                    <button
                      key={st}
                      onClick={() => onStatusChange(st)}
                      className={`text-xs px-2.5 py-1 rounded border font-medium transition-colors ${
                        applicant.status === st
                          ? 'bg-blue-900 text-white border-blue-900'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {st}
                    </button>
                  )
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-slate-600 border border-slate-300 rounded-md bg-white hover:bg-slate-100 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
