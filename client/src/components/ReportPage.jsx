import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { 
  CheckCircle, XCircle, AlertTriangle, Lightbulb, TrendingUp, 
  Map, Target, Award, BookOpen, Briefcase, GraduationCap, 
  Download, RefreshCcw, FileText, ChevronRight, Brain, Zap, Search, Layout, Ruler, Gauge
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';


// --- Sub-components (Defined before ReportPage for hoisting safety) ---

const Card = ({ children, className = "" }) => (
  <div className={`bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden ${className}`}>
    {children}
  </div>
);

const SectionHeader = ({ title, icon }) => (
  <div className="flex items-center gap-2 mb-6">
    <div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
      {icon}
    </div>
    <h2 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">{title}</h2>
  </div>
);

const IconMapper = ({ name, className }) => {
  const icons = {
    Award: <Award className={className} />,
    Briefcase: <Briefcase className={className} />,
    Target: <Target className={className} />,
    GraduationCap: <GraduationCap className={className} />,
    TrendingUp: <TrendingUp className={className} />,
    Brain: <Brain className={className} />,
    Zap: <Zap className={className} />,
    Search: <Search className={className} />,
    Layout: <Layout className={className} />,
    Ruler: <Ruler className={className} />,
    Gauge: <Gauge className={className} />
  };
  return icons[name] || <CheckCircle className={className} />;
};

const mockData = {
  user: "Candidate",
  role: "Full Stack Developer",
  overallScore: 78,
  aiInterpretation: "Your profile exhibits strong technical alignment with core requirements, but lacks some cloud-native operational experience.",
  skills: {
    present: ["React", "Node.js", "JavaScript", "REST APIs", "Git"],
    missing: ["AWS Lambda", "Terraform", "GraphQL"],
    weak: ["Docker", "Kubernetes", "TypeScript"]
  },
  resumeQuality: {
    atsScore: 82,
    formatting: { score: 90, sections: ["Experience", "Education", "Skills", "Projects"] },
    readability: "Good",
    contentStrength: { score: 75, quantified: true, actionVerbs: true }
  },
  breakdown: [
    { name: "Skills", score: 85, icon: "Award" },
    { name: "Experience", score: 72, icon: "Briefcase" },
    { name: "Projects", score: 90, icon: "Target" },
    { name: "Education", score: 100, icon: "GraduationCap" }
  ],
  verdict: {
    status: "Strong Fit",
    explanation: "You possess over 80% of the core competencies. Significant growth potential exists in the cloud infrastructure domain."
  },
  charts: {
    bar: [
      { name: 'React', Resume: 95, Job: 100 },
      { name: 'Node.js', Resume: 88, Job: 90 },
      { name: 'Cloud', Resume: 40, Job: 75 },
      { name: 'DevOps', Resume: 55, Job: 80 }
    ],
    radar: [
      { subject: 'Frontend', A: 95, fullMark: 100 },
      { subject: 'Backend', A: 90, fullMark: 100 },
      { subject: 'DevOps', A: 45, fullMark: 100 },
      { subject: 'Data', A: 92, fullMark: 100 }
    ]
  },
  roadmap: []
};

const ReportPage = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const rawResults = location.state?.results || location.state;
  const data = (rawResults && (rawResults.overallScore || rawResults.score)) ? rawResults : mockData;

  const handlePrint = () => window.print();
  const finalScore = data.overallScore || data.score || 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-4 md:p-8 font-['Inter'] transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-8 pt-16 pb-20">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Analysis Report</h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-2">
               <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-bold rounded-full">NLP v2.0 ACTIVE</span>
               <p className="text-sm text-slate-500 dark:text-slate-400">
                Candidate: <span className="font-semibold text-slate-700 dark:text-slate-200">{data.user || "Candidate"}</span> 
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <button 
              onClick={() => navigate('/upload')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <RefreshCcw className="w-4 h-4" />
              Re-analyze
            </button>
            <button 
              onClick={() => navigate('/roadmap', { state: { results: data } })}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2 text-sm font-black text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all active:scale-95"
            >
              Learn Roadmap <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Score & Verdict */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          <Card className="lg:col-span-1 p-6 md:p-8 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 dark:bg-blue-900/10 rounded-full blur-3xl -mr-16 -mt-16" />
            <div className="relative w-40 h-40 md:w-48 md:h-48 mb-6">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="96" cy="96" r="88" strokeWidth="12" stroke="currentColor" fill="transparent" className="text-slate-100 dark:text-slate-800" />
                <circle 
                  cx="96" cy="96" r="88" strokeWidth="12" strokeDasharray={552.92} 
                  strokeDashoffset={552.92 - (552.92 * finalScore) / 100}
                  strokeLinecap="round" stroke="#2563eb" fill="transparent" className="transition-all duration-1000" 
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-black text-slate-900 dark:text-white">{finalScore}%</span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Match Score</span>
              </div>
            </div>
            <p className="text-center text-slate-600 dark:text-slate-400 text-sm leading-relaxed px-4 font-medium">
              {data.aiInterpretation || data.summary || "Generating alignment insights..."}
            </p>
          </Card>

          <div className="lg:col-span-2 space-y-8">
            <div className={`p-6 rounded-2xl border-2 flex items-start gap-4 ${
              data.verdict?.status === 'Strong Fit' 
                ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30' 
                : data.verdict?.status === 'High Mismatch' 
                  ? 'bg-rose-50 dark:bg-rose-950/20 border-rose-100 dark:border-rose-900/30'
                  : 'bg-amber-50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/30'
            }`}>
              <div className={`p-3 rounded-xl ${
                data.verdict?.status === 'Strong Fit' ? 'bg-emerald-500 text-white' : 
                data.verdict?.status === 'High Mismatch' ? 'bg-rose-500 text-white' : 'bg-amber-500 text-white'
              }`}>
                {data.verdict?.status === 'Strong Fit' ? <CheckCircle className="w-6 h-6" /> : 
                 data.verdict?.status === 'High Mismatch' ? <XCircle className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
              </div>
              <div>
                <h4 className={`font-bold text-lg ${
                  data.verdict?.status === 'Strong Fit' ? 'text-emerald-900 dark:text-emerald-400' : 
                  data.verdict?.status === 'High Mismatch' ? 'text-rose-900 dark:text-rose-400' : 'text-amber-900 dark:text-amber-400'
                }`}>
                  {data.verdict?.status || "Analysis Update"}
                </h4>
                <p className={`text-sm mt-1 font-medium ${
                  data.verdict?.status === 'Strong Fit' ? 'text-emerald-700 dark:text-emerald-500/80' : 
                  data.verdict?.status === 'High Mismatch' ? 'text-rose-700 dark:text-rose-500/80' : 'text-amber-700 dark:text-amber-500/80'
                }`}>
                  {data.verdict?.explanation || "Parsing alignment criteria..."}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: 'Skills Present', list: data.skills?.present || data.skills?.matched || [], color: 'bg-emerald-50 dark:bg-emerald-900/10 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/20' },
                { label: 'Missing Skills', list: data.skills?.missing || [], color: 'bg-rose-50 dark:bg-rose-900/10 text-rose-700 dark:text-rose-400 border-rose-100 dark:border-rose-900/20' },
                { label: 'Weak Skills', list: data.skills?.weak || [], color: 'bg-amber-50 dark:bg-amber-900/10 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-900/20' }
              ].map(block => (
                <div key={block.label} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-3">{block.label}</span>
                  <div className="flex flex-wrap gap-2">
                    {block.list.length > 0 ? block.list.map(s => <span key={s} className={`px-2 py-1 rounded-md text-[10px] font-bold border ${block.color}`}>{s}</span>) : <span className="text-[10px] text-slate-300 italic">None detected</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* New: Resume Quality Check Section */}
        <div className="space-y-6">
          <SectionHeader title="Resume Quality Check" icon={<Gauge className="w-5 h-5" />} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">ATS Compatibility</span>
                <span className="text-xl font-black text-blue-600">{data.resumeQuality?.atsScore || 0}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full" style={{ width: `${data.resumeQuality?.atsScore || 0}%` }} />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Likelihood of passing automated scanning filters.</p>
            </Card>

            <Card className="p-6 space-y-4">
               <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Section Formatting</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${data.resumeQuality?.formatting?.score > 70 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                  {data.resumeQuality?.formatting?.score > 70 ? 'PRO' : 'BASIC'}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(data.resumeQuality?.formatting?.sections || []).map(s => (
                  <span key={s} className="px-1.5 py-0.5 bg-slate-50 dark:bg-slate-800 text-[9px] font-bold rounded border border-slate-200 dark:border-slate-700">{s}</span>
                ))}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Standard resume sections identified.</p>
            </Card>

            <Card className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Readability</span>
                <span className={`text-sm font-black ${(data.resumeQuality?.readability || 'Average') === 'Good' ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {data.resumeQuality?.readability || 'Average'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Ruler className="w-4 h-4 text-slate-400" />
                <div className="flex-1 h-1 bg-slate-100 dark:bg-slate-800 rounded-full flex gap-1">
                   {[1,2,3].map(i => <div key={i} className={`flex-1 h-full rounded-full ${i <= ((data.resumeQuality?.readability === 'Good' ? 3 : 2)) ? 'bg-indigo-500' : 'bg-slate-200 dark:bg-slate-700'}`} />)}
                </div>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Flow and length optimization for human readers.</p>
            </Card>

            <Card className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Content Strength</span>
                <span className="text-xl font-black text-indigo-600">{data.resumeQuality?.contentStrength?.score || 0}%</span>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-[10px] font-bold">
                  {data.resumeQuality?.contentStrength?.quantified ? <CheckCircle className="w-3 h-3 text-emerald-500" /> : <XCircle className="w-3 h-3 text-rose-400" />}
                  <span className={data.resumeQuality?.contentStrength?.quantified ? 'text-slate-700 dark:text-slate-200' : 'text-slate-400 italic'}>Quantified Results</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold">
                  {data.resumeQuality?.contentStrength?.actionVerbs ? <CheckCircle className="w-3 h-3 text-emerald-500" /> : <XCircle className="w-3 h-3 text-rose-400" />}
                  <span className={data.resumeQuality?.contentStrength?.actionVerbs ? 'text-slate-700 dark:text-slate-200' : 'text-slate-400 italic'}>Action Verbs Usage</span>
                </div>
              </div>
               <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Measurement of impactful language.</p>
            </Card>
          </div>
        </div>

        {/* Intelligence Methodology Section */}
        <Card className="p-8 border-blue-100 dark:border-blue-900/30 bg-gradient-to-br from-white to-blue-50/50 dark:from-slate-900 dark:to-blue-950/20 relative">
          <div className="absolute top-4 right-8 px-3 py-1 bg-blue-600 text-[10px] font-black text-white rounded-full uppercase tracking-tighter">
            NLP Engine v3.0
          </div>
          <SectionHeader title="The Intelligence Behind Your Score" icon={<Brain className="w-5 h-5" />} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-600/10 text-blue-600 rounded-lg"><Search className="w-4 h-4" /></div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Semantic Normalization</h4>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                We normalize variants (e.g. "React.js" and "React Native") into unified semantic tokens to ensure your expertise is accurately mapped regardless of phrasing.
              </p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-600/10 text-blue-600 rounded-lg"><Zap className="w-4 h-4" /></div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Porter Stemming Algorithm</h4>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                Leveraging linguistic stemming, we compare the "root" of words, allowing us to match context even when you use different grammatical forms.
              </p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-600/10 text-blue-600 rounded-lg"><Target className="w-4 h-4" /></div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Phased Roadmap AI</h4>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                Gaps are categorized into foundational and core phases, providing a step-by-step priority queue for your professional development.
              </p>
            </div>
          </div>
        </Card>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-8">
            <SectionHeader title="Technical Alignment" icon={<TrendingUp className="w-5 h-5" />} />
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.charts?.bar || []}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#1e293b' : '#f1f5f9'} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: isDarkMode ? '#94a3b8' : '#64748b' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: isDarkMode ? '#94a3b8' : '#64748b' }} />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '12px', 
                      backgroundColor: isDarkMode ? '#0f172a' : '#fff',
                      border: isDarkMode ? '1px solid #1e293b' : '1px solid #e2e8f0',
                      color: isDarkMode ? '#f8fafc' : '#0f172a'
                    }} 
                  />
                  <Bar dataKey="Resume" fill="#2563eb" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Job" fill={isDarkMode ? '#1e293b' : '#e2e8f0'} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6 md:p-8">
            <SectionHeader title="Metric Breakdown" icon={<Target className="w-5 h-5" />} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(data.breakdown || []).map(item => (
                <div key={item.name} className="p-4 bg-slate-50 dark:bg-slate-950/50 rounded-xl border border-slate-100 dark:border-slate-800/50">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{item.name}</span>
                    <span className="text-xs font-black dark:text-slate-200">{item.score}%</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <IconMapper name={typeof item.icon === 'string' ? item.icon : 'Award'} className="w-3 h-3 text-blue-500" />
                    <span className="text-[10px] text-slate-400">Analysis Segment</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-1 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full transition-all duration-1000" style={{ width: `${item.score}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Verdict Call to Action */}
        <div className="text-center py-10">
          <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">Ready to Bridge the Gaps?</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Explore your personalized phased learning path.</p>
          <button 
            onClick={() => navigate('/roadmap', { state: { results: data } })}
            className="inline-flex items-center gap-3 px-10 py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-3xl font-black shadow-2xl shadow-blue-500/40 transition-all active:scale-95 group"
          >
            View Full Learning Roadmap
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>
    </div>
  );
};

export default ReportPage;
