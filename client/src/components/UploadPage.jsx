import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, X, AlertCircle, CheckCircle, Zap, Type, File } from 'lucide-react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import API_BASE from '../config';


const UploadPage = () => {
  const navigate = useNavigate();
  const [resume, setResume] = useState(null);
  const [jdFile, setJdFile] = useState(null);
  const [jdText, setJdText] = useState('');
  const [jdMode, setJdMode] = useState('text'); // 'text' or 'file'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isFormValid = useMemo(() => {
    const hasResume = !!resume;
    const hasJD = jdMode === 'text' ? jdText.trim().length > 20 : !!jdFile;
    return hasResume && hasJD;
  }, [resume, jdMode, jdText, jdFile]);

  const handleFileChange = (e, setter, isResume = false) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size === 0) {
      toast.error("Empty file detected. Please upload a valid document.");
      return;
    }

    const type = file.type;
    const name = file.name.toLowerCase();
    const isImage = type.startsWith('image/') || /\.(jpg|jpeg|png|gif)$/.test(name);
    
    if (isImage) {
      toast.error("Images are not supported. Please upload PDF, DOC, or DOCX.");
      return;
    }

    const allowedExtensions = isResume ? ['.pdf', '.docx', '.doc'] : ['.pdf', '.docx', '.doc', '.txt'];
    const ext = name.slice(name.lastIndexOf('.'));

    if (!allowedExtensions.includes(ext)) {
      toast.error(`Invalid format. Please use ${allowedExtensions.join(', ').toUpperCase()}.`);
      return;
    }

    setter(file);
    setError('');
    toast.success(`${isResume ? 'Resume' : 'Job Description'} uploaded successfully!`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resume) {
      toast.error('Resume is required.');
      return;
    }
    if (jdMode === 'text' && jdText.trim().length < 20) {
      toast.error('Please provide a more detailed job description.');
      return;
    }
    if (jdMode === 'file' && !jdFile) {
      toast.error('Please upload a job description file.');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('resume', resume);
    if (jdMode === 'text') {
      formData.append('jdText', jdText);
    } else {
      formData.append('jdFile', jdFile);
    }

    try {
      const response = await axios.post(`${API_BASE}/analyze`, formData);
      navigate('/processing', { state: { results: response.data } });
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.details || err.message || 'Analysis failed. Please try again.';
      setError(msg);
      toast.error(msg);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 flex items-center justify-center p-4 md:p-8 pt-24 text-slate-900 dark:text-white">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* Left Side: Instructions */}
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold">
              <Zap className="w-3 h-3" />
              <span>Version 3.0 Live - Advanced NLP</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tight leading-tight">
              Bridge the <span className="text-blue-600">Skill Gap</span> in Seconds.
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
              Our enhanced NLP engine provides real-time ATS compatibility scores and personalized learning roadmaps.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { t: 'Strict Validation', d: 'Ensures your documents are parsed with 100% accuracy.' },
              { t: 'Synonym Intelligence', d: 'Recognizes skill variants (e.g., React.js vs React).' },
              { t: 'Interactive Roadmap', d: 'Wait for the report to see your phased learning path.' }
            ].map(item => (
              <div key={item.t} className="flex gap-4 items-start">
                <div className="mt-1 p-1 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
                  <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">{item.t}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{item.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl transition-colors w-full">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Resume Upload */}
            <div className="space-y-3">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">1. Your Resume (PDF/DOCX)</h3>
              <div className="relative group">
                <input 
                  type="file" 
                  accept=".pdf,.docx,.doc" 
                  onChange={(e) => handleFileChange(e, setResume, true)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className={`p-6 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all ${
                  resume ? 'border-emerald-500 bg-emerald-50/10 dark:bg-emerald-900/10' : 'border-slate-200 dark:border-slate-800 hover:border-blue-500'
                }`}>
                  {resume ? (
                    <div className="flex items-center gap-3">
                      <FileText className="w-8 h-8 text-emerald-500" />
                      <div className="max-w-[120px] sm:max-w-[150px] overflow-hidden">
                        <p className="text-sm font-bold truncate">{resume.name}</p>
                        <p className="text-[10px] text-slate-500 uppercase">File Ready</p>
                      </div>
                      <button type="button" onClick={() => setResume(null)} className="p-1 hover:bg-red-50 rounded-full text-red-500 z-20">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                      <p className="text-xs font-bold text-slate-400">PDF, DOCX, or DOC only</p>
                      <p className="text-[10px] text-slate-500 mt-1">Images will be rejected</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* JD Input */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">2. Job Description</h3>
                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                  <button 
                    type="button"
                    onClick={() => setJdMode('text')}
                    className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${jdMode === 'text' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500'}`}
                  >
                    <Type className="w-3 h-3 inline mr-1" /> Text
                  </button>
                  <button 
                    type="button"
                    onClick={() => setJdMode('file')}
                    className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${jdMode === 'file' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500'}`}
                  >
                    <File className="w-3 h-3 inline mr-1" /> File
                  </button>
                </div>
              </div>

              {jdMode === 'text' ? (
                <textarea 
                  placeholder="Paste the job requirements (Min 20 chars)..."
                  value={jdText}
                  onChange={(e) => setJdText(e.target.value)}
                  className="w-full h-32 p-4 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none text-slate-900 dark:text-white"
                />
              ) : (
                <div className="relative group">
                  <input 
                    type="file" 
                    accept=".pdf,.docx,.doc,.txt" 
                    onChange={(e) => handleFileChange(e, setJdFile, false)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className={`p-6 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all ${
                    jdFile ? 'border-emerald-500 bg-emerald-50/10 dark:bg-emerald-900/10' : 'border-slate-200 dark:border-slate-800 hover:border-blue-500'
                  }`}>
                    {jdFile ? (
                      <div className="flex items-center gap-3">
                        <FileText className="w-8 h-8 text-emerald-500" />
                        <div className="max-w-[150px] overflow-hidden">
                          <p className="text-sm font-bold truncate">{jdFile.name}</p>
                        </div>
                        <button type="button" onClick={() => setJdFile(null)} className="p-1 hover:bg-red-50 rounded-full text-red-500 z-20">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="text-center text-slate-600 dark:text-slate-300">
                        <Upload className="w-6 h-6 mx-auto mb-2" />
                        <p className="text-[10px] font-bold">Upload JD Document</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-xl flex items-center gap-2 text-red-600 text-[10px] font-bold">
                <AlertCircle className="w-3 h-3" />
                {error}
              </div>
            )}

            <button 
              type="submit"
              disabled={loading || !isFormValid}
              className={`w-full py-4 rounded-2xl text-xs font-black text-white transition-all ${
                loading || !isFormValid 
                  ? 'bg-slate-300 dark:bg-slate-800 cursor-not-allowed text-slate-500' 
                  : 'bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-500/20 active:scale-95'
              }`}
            >
              {loading ? 'Processing Intelligence...' : 'Analyze Match Compatibility'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default UploadPage;