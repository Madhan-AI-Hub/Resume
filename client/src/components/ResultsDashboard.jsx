import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, XCircle, AlertTriangle, Lightbulb, Map, Download, RefreshCcw, Zap } from 'lucide-react';

const ResultsDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const results = location.state?.results || location.state || {
    score: 0,
    overallScore: 0,
    summary: 'Analysis pending.',
    skills: { matched: [], missing: [], weak: [] },
    suggestions: [],
    roadmap: []
  };

  const score = results.overallScore || results.score || 0;
  const summary = results.aiInterpretation || results.summary || '';
  const skills = results.skills || {};
  const matched = skills.matched || skills.present || [];
  const missing = skills.missing || [];
  const weak = skills.weak || [];
  const suggestions = results.suggestions || [];

  const getScoreColor = () => {
    if (score >= 80) return { ring: '#10b981', text: 'text-emerald-500', label: 'Premium Alignment' };
    if (score >= 50) return { ring: '#f59e0b', text: 'text-amber-500', label: 'Balanced Match' };
    return { ring: '#ef4444', text: 'text-rose-500', label: 'Significant Variance' };
  };

  const scoreStyle = getScoreColor();
  const circumference = 2 * Math.PI * 88;
  const offset = circumference - (circumference * score) / 100;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300 pt-20 pb-16 px-4 md:px-8">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight">Analysis Results</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">AI-powered skill gap analysis complete</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/upload')}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <RefreshCcw className="w-4 h-4" /> Re-analyze
            </button>
            <button
              onClick={() => navigate('/roadmap', { state: location.state })}
              className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-indigo-500/20"
            >
              <Map className="w-4 h-4" /> View Roadmap
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* Score Hero */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 flex flex-col items-center text-center shadow-sm"
          >
            <div className="relative w-48 h-48 mb-6">
              <svg className="w-full h-full -rotate-90">
                <circle cx="96" cy="96" r="88" strokeWidth="10" stroke="currentColor" fill="transparent" className="text-slate-100 dark:text-slate-800" />
                <circle
                  cx="96" cy="96" r="88" strokeWidth="10" strokeDasharray={circumference}
                  strokeDashoffset={offset} strokeLinecap="round" fill="transparent"
                  stroke={scoreStyle.ring} className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-black">{score}</span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Score</span>
              </div>
            </div>
            <h2 className={`text-xl font-black mb-2 ${scoreStyle.text}`}>{scoreStyle.label}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{summary}</p>
            <div className="mt-6 flex gap-3 w-full">
              <button
                onClick={() => navigate('/report', { state: location.state })}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors"
              >
                <Zap className="w-4 h-4" /> Full Report
              </button>
              <button
                onClick={() => window.print()}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <Download className="w-4 h-4" /> PDF
              </button>
            </div>
          </motion.div>

          {/* Skills & Suggestions */}
          <div className="lg:col-span-3 space-y-6">

            {/* Skill Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: 'Matched Skills', skills: matched, color: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30', icon: CheckCircle, iconColor: 'text-emerald-500' },
                { label: 'Missing Skills', skills: missing, color: 'bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 border-rose-100 dark:border-rose-900/30', icon: XCircle, iconColor: 'text-rose-500' },
                { label: 'Weak Skills', skills: weak, color: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-900/30', icon: AlertTriangle, iconColor: 'text-amber-500' }
              ].map(({ label, skills: list, color, icon: Icon, iconColor }) => (
                <div key={label} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Icon className={`w-4 h-4 ${iconColor}`} />
                    <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      {label} ({list.length})
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {list.length > 0 ? list.map((skill, i) => (
                      <span key={i} className={`px-2 py-1 rounded-md text-[10px] font-bold border ${color}`}>{skill}</span>
                    )) : (
                      <span className="text-xs text-slate-400 dark:text-slate-500">None detected</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Suggestions */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                </div>
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">Optimization Strategies</h3>
              </div>
              {suggestions.length > 0 ? (
                <div className="space-y-3">
                  {suggestions.map((s, i) => (
                    <motion.div
                      key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
                    >
                      {typeof s === 'string' ? (
                        <p className="text-sm text-slate-600 dark:text-slate-300">{s}</p>
                      ) : (
                        <>
                          <p className="text-sm font-bold text-blue-600 dark:text-blue-400">{s.title}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{s.desc || s.description}</p>
                        </>
                      )}
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-400 dark:text-slate-500">No specific suggestions generated.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsDashboard;
