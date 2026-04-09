import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, GraduationCap, BookOpen, Layers, Printer } from 'lucide-react';

const RoadmapPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const results = location.state?.results || location.state || { roadmap: [] };
  const roadmap = results.roadmap || [];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300 pt-20 pb-16 px-4 md:px-8">
      <div className="max-w-3xl mx-auto space-y-10">

        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Report
          </button>
          <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400">
            Personalized Career Path
          </span>
        </div>

        <div className="text-center space-y-3">
          <h1 className="text-4xl font-black tracking-tight">
            Skill Acquisition <span className="text-blue-600">Roadmap</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xl mx-auto">
            Based on our AI analysis, these are the critical steps required to achieve full alignment with the target role.
          </p>
        </div>

        {/* Roadmap Steps */}
        {roadmap.length > 0 ? (
          <div className="space-y-6 relative">
            {/* Timeline line */}
            <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-gradient-to-b from-blue-600 to-transparent opacity-20 hidden sm:block" />

            {roadmap.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-5 items-start group"
              >
                {/* Step Number */}
                <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center font-black text-lg shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
                  {index + 1}
                </div>

                {/* Card */}
                <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-5 shadow-sm hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
                  <div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">{item.skill}</h3>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">Priority Skill Acquisition</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Topics */}
                    <div className="p-4 bg-slate-50 dark:bg-slate-950/50 rounded-xl">
                      <div className="flex items-center gap-1.5 mb-3">
                        <Layers className="w-3.5 h-3.5 text-blue-600" />
                        <span className="text-[10px] font-black uppercase tracking-wider text-blue-600">Core Topics</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {(item.topics || []).map((t, i) => (
                          <span key={i} className="px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md text-[10px] font-medium text-slate-700 dark:text-slate-300">{t}</span>
                        ))}
                        {(!item.topics || item.topics.length === 0) && (
                          <span className="text-xs text-slate-400">No topics listed</span>
                        )}
                      </div>
                    </div>

                    {/* Resources */}
                    <div className="p-4 bg-slate-50 dark:bg-slate-950/50 rounded-xl">
                      <div className="flex items-center gap-1.5 mb-3">
                        <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                        <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600">Learning Resources</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {(item.where || []).map((w, i) => (
                          <span key={i} className="px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md text-[10px] font-bold text-indigo-700 dark:text-indigo-400">{w}</span>
                        ))}
                        {(!item.where || item.where.length === 0) && (
                          <span className="text-xs text-slate-400">No resources listed</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
            <GraduationCap className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">No Major Skill Gaps</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">You are 100% aligned with the requirements!</p>
          </div>
        )}

        {/* Print button */}
        <div className="text-center">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-6 py-3 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-300 rounded-full hover:bg-white dark:hover:bg-slate-900 transition-colors"
          >
            <Printer className="w-4 h-4" /> Print Path
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoadmapPage;
