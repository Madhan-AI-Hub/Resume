import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, Loader2, Search, Cpu, BarChart, FileText, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

const Zap = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const steps = [
  { text: "Extracting resume data...", icon: <FileText className="w-5 h-5" /> },
  { text: "Parsing job description...", icon: <Search className="w-5 h-5" /> },
  { text: "Comparing skill profiles...", icon: <Cpu className="w-5 h-5" /> },
  { text: "Generating match report...", icon: <BarChart className="w-5 h-5" /> }
];

const ProcessingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(0);
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    // 15s absolute timeout logic
    const timeoutTimer = setTimeout(() => {
      if (currentStep < steps.length) {
        setTimedOut(true);
        toast.error("Analysis is taking longer than expected. Please try again.");
      }
    }, 15000);

    return () => clearTimeout(timeoutTimer);
  }, [currentStep]);

  useEffect(() => {
    if (timedOut) return;

    if (currentStep < steps.length) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      setTimeout(() => {
        navigate('/report', { state: location.state });
      }, 1000);
    }
  }, [currentStep, navigate, location.state, timedOut]);

  if (timedOut) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white dark:bg-slate-900 p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full space-y-6">
          <div className="w-20 h-20 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto">
            <AlertTriangle className="w-10 h-10 text-amber-600" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Analysis Timeout</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Analysis is taking longer than expected. This could be due to connectivity issues or heavy file processing.
          </p>
          <button 
            onClick={() => navigate('/upload')}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/20 transition-all"
          >
            Go Back & Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 transition-colors duration-500 overflow-hidden">
      
      {/* Background Animated Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-[100px]"
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.15, 0.1] }}
          transition={{ duration: 6, repeat: Infinity, delay: 1 }}
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-500 rounded-full blur-[120px]"
        />
      </div>

      <div className="max-w-xl w-full relative z-10">
        
        {/* Core Animation Area */}
        <div className="flex flex-col items-center mb-12">
          <div className="relative w-32 h-32 mb-8">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 border-t-4 border-blue-600 rounded-full"
            />
            <motion.div 
              animate={{ rotate: -360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute inset-2 border-b-4 border-indigo-400 rounded-full opacity-50"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: [0.8, 1.1, 0.8] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Zap className="w-10 h-10 text-blue-600 drop-shadow-[0_0_10px_rgba(37,99,235,0.5)]" />
              </motion.div>
            </div>
          </div>

          <h2 className="text-3xl font-black text-slate-900 dark:text-white text-center tracking-tight mb-2">
            AI Analysis <span className="text-blue-600">Active</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-widest">
            Step {Math.min(currentStep + 1, steps.length)} of {steps.length}
          </p>
        </div>

        {/* Steps Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-2xl space-y-4">
          <AnimatePresence mode="popLayout">
            {steps.map((step, index) => {
              const isPast = index < currentStep;
              const isCurrent = index === currentStep;
              
              if (index > currentStep + 1 || index < currentStep - 1) return null;

              return (
                <motion.div 
                  key={step.text}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: isCurrent ? 1 : 0.4, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`flex items-center gap-4 transition-all ${isCurrent ? 'scale-105' : 'scale-95'}`}
                >
                  <div className={`p-2 rounded-xl border ${
                    isPast ? 'bg-emerald-50 border-emerald-100 text-emerald-500 dark:bg-emerald-900/10 dark:border-emerald-900' :
                    isCurrent ? 'bg-blue-50 border-blue-100 text-blue-600 animate-pulse dark:bg-blue-900/10 dark:border-blue-900' :
                    'bg-slate-50 border-slate-100 text-slate-300 dark:bg-slate-800 dark:border-slate-700'
                  }`}>
                    {isPast ? <CheckCircle className="w-5 h-5" /> : step.icon}
                  </div>
                  <span className={`text-sm font-bold ${
                    isCurrent ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500'
                  }`}>
                    {step.text}
                  </span>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Progress Bar */}
        <div className="mt-10 space-y-2">
          <div className="flex justify-between text-[10px] font-black uppercase text-slate-400 tracking-tighter">
            <span>Scanning Intensity</span>
            <span>{Math.round((Math.min(currentStep, steps.length) / steps.length) * 100)}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(Math.min(currentStep, steps.length) / steps.length) * 100}%` }}
              className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProcessingPage;
