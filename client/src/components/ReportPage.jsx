import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { 
  CheckCircle, XCircle, AlertTriangle, Lightbulb, TrendingUp, 
  Map, Target, Award, BookOpen, Briefcase, GraduationCap, 
  Download, RefreshCcw, FileText, ChevronRight, Brain, Zap, Search
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
    Search: <Search className={className} />
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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Analysis Report</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Candidate: <span className="font-semibold text-slate-700 dark:text-slate-200">{data.user || "Candidate"}</span> • Target: <span className="font-semibold text-slate-700 dark:text-slate-200">{data.role || "Target Role"}</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/upload')}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <RefreshCcw className="w-4 h-4" />
              Re-analyze
            </button>
            <button 
              onClick={handlePrint}
              className="flex items-center gap-2 px-6 py-2 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all active:scale-95"
            >
              <Download className="w-4 h-4" />
              Download PDF
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
                : 'bg-amber-50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/30'
            }`}>
              <div className={`p-3 rounded-xl ${data.verdict?.status === 'Strong Fit' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}`}>
                {data.verdict?.status === 'Strong Fit' ? <CheckCircle className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
              </div>
              <div>
                <h4 className={`font-bold text-lg ${data.verdict?.status === 'Strong Fit' ? 'text-emerald-900 dark:text-emerald-400' : 'text-amber-900 dark:text-amber-400'}`}>
                  {data.verdict?.status || "Analysis Update"}
                </h4>
                <p className={`text-sm mt-1 ${data.verdict?.status === 'Strong Fit' ? 'text-emerald-700 dark:text-emerald-500/80' : 'text-amber-700 dark:text-amber-500/80'}`}>
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
                    {block.list.map(s => <span key={s} className={`px-2 py-1 rounded-md text-[10px] font-bold border ${block.color}`}>{s}</span>)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Intelligence Methodology Section */}
        <Card className="p-8 border-blue-100 dark:border-blue-900/30 bg-gradient-to-br from-white to-blue-50/50 dark:from-slate-900 dark:to-blue-950/20 relative">
          <div className="absolute top-4 right-8 px-3 py-1 bg-blue-600 text-[10px] font-black text-white rounded-full uppercase tracking-tighter">
            NLP Engine v2.0
          </div>
          <SectionHeader title="The Intelligence Behind Your Score" icon={<Brain className="w-5 h-5" />} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-600/10 text-blue-600 rounded-lg"><Search className="w-4 h-4" /></div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Semantic Parsing</h4>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                We use deterministic regex patterns to convert PDFs and Word docs into normalized semantic buffers, ensuring no crucial keyword is left behind during extraction.
              </p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-600/10 text-blue-600 rounded-lg"><Zap className="w-4 h-4" /></div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Natural Language Processing</h4>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                Leveraging the **Natural NLP Library**, we perform tokenization and categorical clustering to identify the underlying technical intent of your experience.
              </p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-600/10 text-blue-600 rounded-lg"><Target className="w-4 h-4" /></div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Cosine Similarity Model</h4>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                Your score is calculated using an N-dimensional vector space model. We measure the "Angular Distance" between your resume and the JD to ensure objective accuracy.
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

        {/* Roadmap Roadmap */}
        <Card className="p-8">
           <SectionHeader title="Personalized Growth Roadmap" icon={<Map className="w-5 h-5" />} />
           <div className="space-y-6">
             {(data.roadmap && data.roadmap.length > 0) ? data.roadmap.map((item, idx) => (
                <div key={idx} className="flex gap-6 items-start group">
                  <div className="flex flex-col items-center">
                    <div className="p-2 bg-blue-600 rounded-lg text-white shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    {idx !== data.roadmap.length - 1 && <div className="w-0.5 h-full bg-slate-100 dark:bg-slate-800 mt-2" />}
                  </div>
                  <div className="flex-1 pb-8">
                    <h4 className="text-lg font-black text-slate-900 dark:text-white mb-2">{item.skill}</h4>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                      <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl">
                        <span className="text-[10px] font-black uppercase text-blue-600 block mb-2">Core Topics</span>
                        <div className="flex flex-wrap gap-2">
                          {item.topics.map(t => <span key={t} className="px-2 py-1 bg-white dark:bg-slate-900 rounded-md text-[10px] border border-slate-200 dark:border-slate-800">{t}</span>)}
                        </div>
                      </div>
                      <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl">
                        <span className="text-[10px] font-black uppercase text-indigo-600 block mb-2">Learning Resources</span>
                        <div className="flex flex-wrap gap-2">
                          {item.where.map(w => <span key={w} className="px-2 py-1 bg-white dark:bg-slate-900 rounded-md text-[10px] border border-slate-200 dark:border-slate-800 font-bold">{w}</span>)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
             )) : (
               <div className="text-center py-12 bg-slate-50 dark:bg-slate-950/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 text-slate-500">
                 No major skill gaps identified. Continue optimizing your project descriptions!
               </div>
             )}
           </div>
        </Card>

      </div>
    </div>
  );
};

export default ReportPage;
