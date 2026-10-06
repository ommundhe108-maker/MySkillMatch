import React from 'react';

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const s = status.toLowerCase();

  let styles = 'bg-slate-100 text-slate-700 border-slate-200';
  if (s.includes('shortlist') || s.includes('select')) {
    styles = 'bg-emerald-50 text-emerald-800 border-emerald-200';
  } else if (s.includes('interview')) {
    styles = 'bg-amber-50 text-amber-800 border-amber-200';
  } else if (s.includes('reject') || s.includes('close')) {
    styles = 'bg-rose-50 text-rose-800 border-rose-200';
  } else if (s.includes('open')) {
    styles = 'bg-sky-50 text-sky-800 border-sky-200';
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium border rounded ${styles}`}>
      {status}
    </span>
  );
};

export const MetricCard: React.FC<{
  label: string;
  value: string | number;
  subtext?: string;
}> = ({ label, value, subtext }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</div>
      <div className="text-2xl font-bold text-slate-900 mt-1">{value}</div>
      {subtext && <div className="text-xs text-slate-400 mt-1">{subtext}</div>}
    </div>
  );
};
