import React, { useState } from 'react';
import { MetricCard, StatusBadge } from '../components/StatusBadge';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'students' | 'companies' | 'jobs' | 'apps'>('students');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          System oversight, institutional metrics, and entity management.
        </p>
      </div>

      {/* Admin stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard label="Registered Students" value="284" subtext="Active candidate accounts" />
        <MetricCard label="Partner Companies" value="42" subtext="Verified hiring recruiters" />
        <MetricCard label="Active Jobs" value="68" subtext="Across engineering & tech" />
        <MetricCard label="Total Applications" value="512" subtext="Platform submissions" />
      </div>

      {/* Tabs */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('students')}
            className={`px-4 py-3 transition-colors ${
              activeTab === 'students'
                ? 'bg-white text-blue-900 border-b-2 border-blue-900 font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Manage Students
          </button>
          <button
            onClick={() => setActiveTab('companies')}
            className={`px-4 py-3 transition-colors ${
              activeTab === 'companies'
                ? 'bg-white text-blue-900 border-b-2 border-blue-900 font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Manage Companies
          </button>
          <button
            onClick={() => setActiveTab('jobs')}
            className={`px-4 py-3 transition-colors ${
              activeTab === 'jobs'
                ? 'bg-white text-blue-900 border-b-2 border-blue-900 font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Manage Jobs
          </button>
          <button
            onClick={() => setActiveTab('apps')}
            className={`px-4 py-3 transition-colors ${
              activeTab === 'apps'
                ? 'bg-white text-blue-900 border-b-2 border-blue-900 font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Manage Applications
          </button>
        </div>

        <div className="p-4 overflow-x-auto text-xs">
          {activeTab === 'students' && (
            <table className="w-full text-left">
              <thead className="text-slate-400 uppercase font-semibold border-b border-slate-100">
                <tr>
                  <th className="pb-2.5">Student ID</th>
                  <th className="pb-2.5">Name</th>
                  <th className="pb-2.5">College</th>
                  <th className="pb-2.5">CGPA</th>
                  <th className="pb-2.5">Core Skills</th>
                  <th className="pb-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="py-2.5 font-mono text-slate-500">STD-101</td>
                  <td className="py-2.5 font-bold text-slate-900">Rahul Patil</td>
                  <td className="py-2.5">PICT Pune (AI &amp; DS)</td>
                  <td className="py-2.5">8.7</td>
                  <td className="py-2.5">Python, SQL, ML</td>
                  <td className="py-2.5"><StatusBadge status="Shortlisted" /></td>
                </tr>
                <tr>
                  <td className="py-2.5 font-mono text-slate-500">STD-102</td>
                  <td className="py-2.5 font-bold text-slate-900">Amit Sharma</td>
                  <td className="py-2.5">COEP Pune (CSE)</td>
                  <td className="py-2.5">8.2</td>
                  <td className="py-2.5">Python, Java, SQL</td>
                  <td className="py-2.5"><StatusBadge status="Applied" /></td>
                </tr>
                <tr>
                  <td className="py-2.5 font-mono text-slate-500">STD-103</td>
                  <td className="py-2.5 font-bold text-slate-900">Sneha Kulkarni</td>
                  <td className="py-2.5">MIT Pune (IT)</td>
                  <td className="py-2.5">9.1</td>
                  <td className="py-2.5">Python, Git, Docker</td>
                  <td className="py-2.5"><StatusBadge status="Interview" /></td>
                </tr>
                <tr>
                  <td className="py-2.5 font-mono text-slate-500">STD-104</td>
                  <td className="py-2.5 font-bold text-slate-900">Rohan Deshmukh</td>
                  <td className="py-2.5">VIT Pune (CSE)</td>
                  <td className="py-2.5">7.9</td>
                  <td className="py-2.5">Django, HTML, CSS</td>
                  <td className="py-2.5"><StatusBadge status="Applied" /></td>
                </tr>
              </tbody>
            </table>
          )}

          {activeTab === 'companies' && (
            <table className="w-full text-left">
              <thead className="text-slate-400 uppercase font-semibold border-b border-slate-100">
                <tr>
                  <th className="pb-2.5">Company ID</th>
                  <th className="pb-2.5">Name</th>
                  <th className="pb-2.5">Industry</th>
                  <th className="pb-2.5">Location</th>
                  <th className="pb-2.5">Active Jobs</th>
                  <th className="pb-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="py-2.5 font-mono text-slate-500">CMP-201</td>
                  <td className="py-2.5 font-bold text-slate-900">TechNova Solutions</td>
                  <td className="py-2.5">Software &amp; Cloud</td>
                  <td className="py-2.5">Pune</td>
                  <td className="py-2.5">4</td>
                  <td className="py-2.5"><StatusBadge status="Open" /></td>
                </tr>
                <tr>
                  <td className="py-2.5 font-mono text-slate-500">CMP-202</td>
                  <td className="py-2.5 font-bold text-slate-900">DataWorks Analytics</td>
                  <td className="py-2.5">Big Data Analytics</td>
                  <td className="py-2.5">Mumbai</td>
                  <td className="py-2.5">2</td>
                  <td className="py-2.5"><StatusBadge status="Open" /></td>
                </tr>
                <tr>
                  <td className="py-2.5 font-mono text-slate-500">CMP-203</td>
                  <td className="py-2.5 font-bold text-slate-900">CognitiveGrid AI</td>
                  <td className="py-2.5">AI / Machine Learning</td>
                  <td className="py-2.5">Bengaluru</td>
                  <td className="py-2.5">3</td>
                  <td className="py-2.5"><StatusBadge status="Open" /></td>
                </tr>
                <tr>
                  <td className="py-2.5 font-mono text-slate-500">CMP-204</td>
                  <td className="py-2.5 font-bold text-slate-900">InnoStack Labs</td>
                  <td className="py-2.5">Full Stack Web</td>
                  <td className="py-2.5">Pune</td>
                  <td className="py-2.5">1</td>
                  <td className="py-2.5"><StatusBadge status="Applied" /></td>
                </tr>
              </tbody>
            </table>
          )}

          {activeTab === 'jobs' && (
            <table className="w-full text-left">
              <thead className="text-slate-400 uppercase font-semibold border-b border-slate-100">
                <tr>
                  <th className="pb-2.5">Job ID</th>
                  <th className="pb-2.5">Title</th>
                  <th className="pb-2.5">Company</th>
                  <th className="pb-2.5">Location</th>
                  <th className="pb-2.5">Applicants</th>
                  <th className="pb-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="py-2.5 font-mono text-slate-500">JOB-01</td>
                  <td className="py-2.5 font-bold text-slate-900">Python Developer</td>
                  <td className="py-2.5">TechNova Solutions</td>
                  <td className="py-2.5">Pune</td>
                  <td className="py-2.5">14</td>
                  <td className="py-2.5"><StatusBadge status="Open" /></td>
                </tr>
                <tr>
                  <td className="py-2.5 font-mono text-slate-500">JOB-02</td>
                  <td className="py-2.5 font-bold text-slate-900">Data Analyst</td>
                  <td className="py-2.5">DataWorks Analytics</td>
                  <td className="py-2.5">Mumbai</td>
                  <td className="py-2.5">8</td>
                  <td className="py-2.5"><StatusBadge status="Open" /></td>
                </tr>
                <tr>
                  <td className="py-2.5 font-mono text-slate-500">JOB-03</td>
                  <td className="py-2.5 font-bold text-slate-900">ML Intern</td>
                  <td className="py-2.5">CognitiveGrid AI</td>
                  <td className="py-2.5">Bengaluru</td>
                  <td className="py-2.5">21</td>
                  <td className="py-2.5"><StatusBadge status="Open" /></td>
                </tr>
                <tr>
                  <td className="py-2.5 font-mono text-slate-500">JOB-04</td>
                  <td className="py-2.5 font-bold text-slate-900">Junior Web Developer</td>
                  <td className="py-2.5">InnoStack Labs</td>
                  <td className="py-2.5">Pune</td>
                  <td className="py-2.5">11</td>
                  <td className="py-2.5"><StatusBadge status="Open" /></td>
                </tr>
              </tbody>
            </table>
          )}

          {activeTab === 'apps' && (
            <table className="w-full text-left">
              <thead className="text-slate-400 uppercase font-semibold border-b border-slate-100">
                <tr>
                  <th className="pb-2.5">App ID</th>
                  <th className="pb-2.5">Candidate</th>
                  <th className="pb-2.5">Job Role</th>
                  <th className="pb-2.5">Company</th>
                  <th className="pb-2.5">Match</th>
                  <th className="pb-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="py-2.5 font-mono text-slate-500">APP-501</td>
                  <td className="py-2.5 font-bold text-slate-900">Rahul Patil</td>
                  <td className="py-2.5">Python Developer</td>
                  <td className="py-2.5">TechNova Solutions</td>
                  <td className="py-2.5 font-bold text-blue-900">88%</td>
                  <td className="py-2.5"><StatusBadge status="Shortlisted" /></td>
                </tr>
                <tr>
                  <td className="py-2.5 font-mono text-slate-500">APP-502</td>
                  <td className="py-2.5 font-bold text-slate-900">Amit Sharma</td>
                  <td className="py-2.5">Python Developer</td>
                  <td className="py-2.5">TechNova Solutions</td>
                  <td className="py-2.5 font-bold text-blue-900">76%</td>
                  <td className="py-2.5"><StatusBadge status="Applied" /></td>
                </tr>
                <tr>
                  <td className="py-2.5 font-mono text-slate-500">APP-503</td>
                  <td className="py-2.5 font-bold text-slate-900">Sneha Kulkarni</td>
                  <td className="py-2.5">Python Developer</td>
                  <td className="py-2.5">TechNova Solutions</td>
                  <td className="py-2.5 font-bold text-blue-900">96%</td>
                  <td className="py-2.5"><StatusBadge status="Interview" /></td>
                </tr>
                <tr>
                  <td className="py-2.5 font-mono text-slate-500">APP-504</td>
                  <td className="py-2.5 font-bold text-slate-900">Rahul Patil</td>
                  <td className="py-2.5">Data Analyst</td>
                  <td className="py-2.5">DataWorks Analytics</td>
                  <td className="py-2.5 font-bold text-blue-900">81%</td>
                  <td className="py-2.5"><StatusBadge status="Applied" /></td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
