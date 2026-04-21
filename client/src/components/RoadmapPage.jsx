import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, GraduationCap, BookOpen, Layers, Printer, Clock, Target, CheckCircle2, ChevronRight, Briefcase } from 'lucide-react';

const RoadmapPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const results = location.state?.results || location.state || { roadmap: [], verdict: {} };
  const roadmap = results.roadmap || [];
  
  // Group roadmap by phase
  const phases = useMemo(() => {
    const p = {};
    roadmap.forEach(item => {
      if (!p[item.phase]) p[item.phase] = [];
      p[item.phase].push(item);
    });
    return p;
  }, [roadmap]);

  const totalTime = useMemo(() => {
    // Basic estimation logic: 2 weeks per missing skill approx
    const count = roadmap.length;
    if (count === 0) return "0 weeks";
    return `${count * 2}–${count * 3} weeks`;
  }, [roadmap]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300 pt-20 pb-16 px-4 md:px-8 font-['Inter']">
      <div className="max-w-4xl mx-auto space-y-12">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="group flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Analysis
            </button>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
              Your Personalized <span className="text-blue-600">Learning Roadmap</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-3 font-medium">
              Target Role: <span className="text-slate-900 dark:text-slate-100 font-bold">{results.role || "Target Profession"}</span>
            </p>
          </div>
          <div className="flex bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm items-center gap-4">
             <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
               <Clock className="w-6 h-6 text-blue-600" />
             </div>
             <div>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Est. Duration</p>
               <p className="text-lg font-black">{totalTime}</p>
             </div>
          </div>
        </div>

        {/* Motivation Card */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <GraduationCap className="w-32 h-32" />
          </div>
          <div className="relative z-10 space-y-4">
            <h3 className="text-xl font-bold italic opacity-90">Career Verdict</h3>
            <p className="text-2xl font-black leading-tight max-w-2xl">
              "{results.verdict?.explanation || "Follow this customized path to achieve maximum JD alignment."}"
            </p>
            <div className="flex items-center gap-2 pt-2">
               <CheckCircle2 className="w-4 h-4" />
               <span className="text-sm font-bold opacity-80">After completing this roadmap, you will be and ready for {results.role || "Target Role"} positions.</span>
            </div>
          </div>
        </div>

        {/* Roadmap Content */}
        {Object.keys(phases).length > 0 ? (
          <div className="space-y-12">
            {Object.entries(phases).map(([phaseName, skills], pIdx) => (
              <div key={phaseName} className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full flex items-center justify-center font-black">
                    {pIdx + 1}
                  </div>
                  <h2 className="text-2xl font-black tracking-tight">{phaseName}</h2>
                </div>

                <div className="grid grid-cols-1 gap-6 ml-4 md:ml-14 border-l-2 border-slate-200 dark:border-slate-800 pl-6 md:pl-10 pb-4">
                  {skills.map((item, sIdx) => (
                    <motion.div
                      key={sIdx}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-sm hover:shadow-md transition-shadow relative group"
                    >
                      <div className="absolute top-8 right-8">
                        <span className="px-3 py-1 bg-slate-50 dark:bg-slate-800 text-[10px] font-black uppercase text-slate-400 rounded-full border border-slate-100 dark:border-slate-700">
                          {item.time || "2-3 Weeks"}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <h3 className="text-xl font-black text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">{item.skill}</h3>
                        <p className="text-xs font-bold text-blue-600 uppercase tracking-widest flex items-center gap-1">
                          <Target className="w-3 h-3" /> Priority Learning Goal
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
                        <div className="space-y-3">
                          <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                             <Layers className="w-3 h-3" /> Core Topics
                          </h4>
                          <ul className="space-y-2">
                            {(item.topics || []).map((t, i) => (
                              <li key={i} className="text-xs font-medium text-slate-600 dark:text-slate-400 flex items-start gap-2">
                                <span className="w-1 h-1 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />
                                {t}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="space-y-3">
                          <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                             <Briefcase className="w-3 h-3" /> Practice Tasks
                          </h4>
                          <ul className="space-y-2">
                            {(item.tasks || []).map((task, i) => (
                              <li key={i} className="text-xs font-medium text-slate-600 dark:text-slate-400 flex items-start gap-2">
                                <div className="w-4 h-4 border border-blue-200 dark:border-blue-800 rounded flex items-center justify-center mt-0.5 flex-shrink-0">
                                   <div className="w-2 h-2 bg-blue-600 rounded-sm opacity-20" />
                                </div>
                                {task}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="space-y-3">
                          <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                             <BookOpen className="w-3 h-3" /> Where to Learn
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {(item.where || []).map((w, i) => (
                              <span key={i} className="px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[10px] font-bold rounded-lg border border-blue-100 dark:border-blue-800">
                                {w}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* New: Milestones & Expert Tip */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-100 dark:border-slate-800/50">
                        <div className="space-y-3">
                          <h4 className="text-[10px] font-black uppercase text-emerald-500 tracking-widest">Growth Milestones</h4>
                          <div className="space-y-2">
                            {(item.milestones || []).map((m, i) => (
                              <div key={i} className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400">
                                <div className="p-0.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-full text-emerald-600">
                                  <CheckCircle2 className="w-3 h-3" />
                                </div>
                                {m}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-xl space-y-2 border border-blue-100 dark:border-blue-900/30">
                           <h4 className="text-[10px] font-black uppercase text-blue-600 tracking-widest">Expert Tip</h4>
                           <p className="text-xs font-medium text-slate-700 dark:text-slate-300 leading-relaxed italic">
                             "{item.expertTip || 'Consistency is key. Focus on one topic until you can explain it to a peer.'}"
                           </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl space-y-4">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto text-emerald-600">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">Expert Profile Detected</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Your resume is already highly aligned with the target role. We recommend focusing on specialized networking and interview preparation.
            </p>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <button
            onClick={() => window.print()}
            className="w-full sm:w-auto px-8 py-4 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-white dark:hover:bg-slate-900 transition-colors"
          >
            <Printer className="w-4 h-4" /> Print Your Journey
          </button>
          <button
            onClick={() => navigate('/upload')}
            className="w-full sm:w-auto px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          >
            Start New Analysis <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoadmapPage;

