import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Shield, Target, ArrowRight, BarChart2, Users, CheckCircle } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-500 overflow-hidden font-['Inter']">
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-4">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none opacity-20 dark:opacity-30">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600 rounded-full blur-[120px]" />
          <div className="absolute top-1/2 right-0 w-80 h-80 bg-purple-600 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-xs font-black tracking-widest uppercase mb-6 animate-fade-in">
            <Zap className="w-4 h-4" />
            <span>Next-Gen Career Intelligence</span>
          </div>
          
          <h1 className="text-5xl md:text-8xl font-black text-slate-900 dark:text-white tracking-tighter leading-[0.9] mb-8">
            Stop Guessing. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Start Landing.</span>
          </h1>

          <p className="max-w-2xl mx-auto text-slate-600 dark:text-slate-400 text-lg md:text-xl leading-relaxed mb-10">
            Smart Resume Skill Gap Analyzer uses advanced AI to bridge the gap between your profile and your dream job. Detailed scores, keyword analysis, and personalized roadmaps.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => navigate('/upload')}
              className="group px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-xl shadow-blue-500/20 flex items-center gap-3 transition-all hover:scale-105 active:scale-95"
            >
              Get Started for Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-8 py-4 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 font-bold rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
              Watch Demo
            </button>
          </div>

          {/* Social Proof */}
          <div className="mt-16 flex flex-wrap justify-center items-center gap-8 opacity-40 grayscale dark:invert">
            <span className="text-xl font-black uppercase">Google</span>
            <span className="text-xl font-black uppercase">Meta</span>
            <span className="text-xl font-black uppercase">Airbnb</span>
            <span className="text-xl font-black uppercase">Stripe</span>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-4 bg-slate-50 dark:bg-slate-900/50 transition-colors">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4">Precision Engineering</h2>
            <p className="text-slate-500 dark:text-slate-400">Everything you need to outsmart the ATS and stand out.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <Shield className="text-blue-600" />, title: 'ATS Optimization', desc: 'Identify missing keywords and formatting issues that keep you from getting past robots.' },
              { icon: <BarChart2 className="text-indigo-600" />, title: 'Skill Gap Matrix', desc: 'Visualize where your experience matches and where you need growth with high-res charts.' },
              { icon: <Target className="text-purple-600" />, title: 'Direct Roadmap', desc: 'Recieve tailored courses and project ideas to bridge specific skill gaps in days.' }
            ].map(f => (
              <div key={f.title} className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl hover:border-blue-500 dark:hover:border-blue-400 transition-all group">
                <div className="p-3 bg-slate-50 dark:bg-slate-950 w-fit rounded-2xl mb-6 group-hover:scale-110 transition-transform">{f.icon}</div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{f.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 px-4 bg-blue-600 dark:bg-blue-900">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 text-center text-white">
          <div>
            <div className="text-4xl md:text-5xl font-black mb-2">15k+</div>
            <div className="text-xs uppercase font-bold text-blue-100">Users Monthly</div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-black mb-2">94%</div>
            <div className="text-xs uppercase font-bold text-blue-100">Interview Rate</div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-black mb-2">200+</div>
            <div className="text-xs uppercase font-bold text-blue-100">Top Companies</div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-black mb-2">10s</div>
            <div className="text-xs uppercase font-bold text-blue-100">Avg. Analysis</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="p-1 bg-blue-600 rounded">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-black text-slate-900 dark:text-white">SkillScan.AI</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">© 2026 SkillScan AI. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="text-xs font-bold text-slate-500 hover:text-blue-600 cursor-pointer">Terms</span>
            <span className="text-xs font-bold text-slate-500 hover:text-blue-600 cursor-pointer">Privacy</span>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
