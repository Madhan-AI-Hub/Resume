import React, { useState, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Alert,
  LinearProgress,
  Tabs,
  Tab,
  useTheme,
  useMediaQuery,
  CircularProgress
} from '@mui/material';
import { Grid } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DeleteIcon from '@mui/icons-material/Delete';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';

const MotionPaper = motion(Paper);
const MotionButton = motion(Button);
const MotionBox = motion(Box);

const FileUploadArea = ({ accept, onFileSelect, file, height = 300 }) => {
  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles?.length > 0) {
        onFileSelect(acceptedFiles[0]);
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles: 1,
    multiple: false
  });

  return (
    <Box sx={{ height }}>
      <AnimatePresence mode="wait">
        {!file ? (
          <MotionPaper
            {...getRootProps()}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            whileHover={{
              borderColor: 'primary.main',
              boxShadow: '0 0 20px rgba(99, 102, 241, 0.2)',
              backgroundColor: 'rgba(255, 255, 255, 0.05)'
            }}
            sx={{
              border: '2px dashed rgba(255,255,255,0.15)',
              p: 4,
              textAlign: 'center',
              cursor: 'pointer',
              borderRadius: 4,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'rgba(255,255,255,0.02)',
              backdropFilter: 'blur(8px)',
              transition: 'all 0.3s ease'
            }}
          >
            <input {...getInputProps()} />
            <motion.div
              animate={{ y: isDragActive ? -10 : 0 }}
              transition={{ repeat: Infinity, duration: 1, repeatType: 'reverse' }}
            >
              <CloudUploadIcon sx={{ fontSize: 50, color: isDragActive ? 'primary.main' : 'text.secondary', transition: 'color 0.3s' }} />
            </motion.div>
            <Typography mt={2} color="text.secondary" sx={{ fontWeight: 500 }}>
              {isDragActive ? 'Drop your file here' : 'Click or Drag file to upload'}
            </Typography>
            <Typography variant="caption" color="text.disabled" sx={{ mt: 1 }}>
              PDF, DOCX or TXT (Max 5MB)
            </Typography>
          </MotionPaper>
        ) : (
          <MotionPaper
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            sx={{
              p: 3,
              border: '1px solid',
              borderColor: 'success.main',
              borderRadius: 4,
              textAlign: 'center',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'rgba(34, 197, 94, 0.08)',
              backdropFilter: 'blur(12px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
            }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            >
              <InsertDriveFileIcon color="success" sx={{ fontSize: 48 }} />
            </motion.div>
            <Typography mt={1.5} fontWeight="bold" color="text.primary">
              {file.name}
            </Typography>
            <Typography variant="caption" color="success.main" sx={{ mb: 2 }}>
              File Ready for Analysis
            </Typography>
            <Button
              variant="outlined"
              startIcon={<DeleteIcon />}
              color="error"
              size="small"
              onClick={() => onFileSelect(null)}
              sx={{
                borderRadius: 50,
                borderColor: 'rgba(239, 68, 68, 0.3)',
                '&:hover': { borderColor: 'error.main', bgcolor: 'rgba(239, 68, 68, 0.1)' }
              }}
            >
              Remove File
            </Button>
          </MotionPaper>
        )}
      </AnimatePresence>
    </Box>
  );
};

const UploadPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [resume, setResume] = useState(null);
  const [jdFile, setJdFile] = useState(null);
  const [jdText, setJdText] = useState('');
  const [jdMode, setJdMode] = useState(0);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleAnalyze = async () => {
    setError('');

    if (!resume) {
      setError('Please upload your resume to continue.');
      return;
    }

    if (jdMode === 0 && !jdFile) {
      setError('Please upload a job description file.');
      return;
    }

    if (jdMode === 1 && !jdText.trim()) {
      setError('Please provide a job description for comparison.');
      return;
    }

    setUploading(true);
    setProgress(10);

    const formData = new FormData();

    // Append text fields FIRST for better multer parsing
    if (jdMode === 1) {
      formData.append('jdText', jdText);
    }

    formData.append('resume', resume);

    if (jdMode === 0) {
      formData.append('jdFile', jdFile);
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/api/resume/analyze',
        formData,
        {
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 90) / progressEvent.total);
            setProgress(10 + percentCompleted);
          }
        }
      );

      setProgress(100);

      setTimeout(() => {
        navigate('/processing', { state: { results: response.data } });
      }, 800);

    } catch (err) {
      console.error(err.response?.data || err.message);
      const serverError = err.response?.data?.error;
      const debugInfo = err.response?.data?.debug;

      let errorMsg = serverError || 'Analysis failed. Please try again.';
      if (debugInfo) {
        console.log("Server Debug Info:", debugInfo);
        const version = debugInfo.v || 'v1';
        errorMsg += ` [${version}] (Resume: ${debugInfo.resumeLen || 0}, JD: ${debugInfo.jdLen || 0}, Files: [${debugInfo.files?.join(', ')}])`;
      }

      setError(errorMsg);
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      bgcolor: 'background.default',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <Navbar />

      {/* Background Mesh Elements */}
      <Box sx={{
        position: 'absolute',
        top: '10%',
        right: '-5%',
        width: '40vw',
        height: '40vw',
        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
        filter: 'blur(60px)',
        zIndex: 0
      }} />
      <Box sx={{
        position: 'absolute',
        bottom: '10%',
        left: '-5%',
        width: '30vw',
        height: '30vw',
        background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
        filter: 'blur(60px)',
        zIndex: 0
      }} />

      <Container maxWidth="lg" sx={{ pt: { xs: 12, md: 16 }, pb: 8, position: 'relative', zIndex: 1 }}>
        <MotionBox
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          sx={{ textAlign: 'center', mb: 8 }}
        >
          <Typography
            variant="h2"
            fontWeight={800}
            gutterBottom
            sx={{
              background: 'linear-gradient(135deg, #fff 0%, #94A3B8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: { xs: '2.5rem', md: '3.5rem' }
            }}
          >
            Analyze Your Potential
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto', fontWeight: 400 }}>
            Upload your documents below. Our AI will scan for skill gaps and provide a tailored optimization roadmap.
          </Typography>
        </MotionBox>

        <Grid container spacing={4} sx={{ mb: 6 }}>
          {/* Resume Section */}
          <Grid xs={12} md={6}>
            <MotionPaper
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              sx={{
                p: 3,
                borderRadius: 4,
                bgcolor: 'rgba(30, 41, 59, 0.5)',
                backdropFilter: 'blur(12px)',
                height: '100%'
              }}
            >
              <Box sx={{ height: 48, mb: 1, display: 'flex', alignItems: 'center' }}>
                <Typography variant="h6" fontWeight="bold">
                  1. Your Resume
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Provide your latest professional resume for deep skill extraction.
              </Typography>
              <FileUploadArea
                height={300}
                accept={{
                  'application/pdf': ['.pdf'],
                  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
                }}
                onFileSelect={setResume}
                file={resume}
              />
            </MotionPaper>
          </Grid>

          {/* Job Description Section */}
          <Grid xs={12} md={6}>
            <MotionPaper
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              sx={{
                p: 3,
                borderRadius: 4,
                bgcolor: 'rgba(30, 41, 59, 0.5)',
                backdropFilter: 'blur(12px)',
                height: '100%'
              }}
            >
              <Box sx={{ mb: 1 }}>
                <Tabs
                  value={jdMode}
                  onChange={(e, v) => setJdMode(v)}
                  sx={{
                    minHeight: 48,
                    '& .MuiTabs-indicator': { height: 3, borderRadius: '3px 3px 0 0' }
                  }}
                >
                  <Tab label="File Upload" sx={{ fontWeight: 'bold' }} />
                  <Tab label="Text Paste" sx={{ fontWeight: 'bold' }} />
                </Tabs>
              </Box>

              <Typography variant="body2" color="text.secondary" mb={3}>
                Specify the target job roles and requirements to compare against.
              </Typography>

              {jdMode === 0 ? (
                <FileUploadArea
                  height={300}
                  accept={{
                    'application/pdf': ['.pdf'],
                    'text/plain': ['.txt']
                  }}
                  onFileSelect={setJdFile}
                  file={jdFile}
                />
              ) : (
                <TextField
                  multiline
                  fullWidth
                  value={jdText}
                  onChange={(e) => setJdText(e.target.value)}
                  placeholder="Paste the target job description here..."
                  sx={{
                    '& .MuiInputBase-root': {
                      height: 300,
                      alignItems: 'flex-start',
                      bgcolor: 'rgba(15, 23, 42, 0.3)',
                      borderRadius: 3,
                      p: 2
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255,255,255,0.1)'
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255,255,255,0.2)'
                    }
                  }}
                />
              )}
            </MotionPaper>
          </Grid>
        </Grid>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <Alert
                severity="error"
                variant="filled"
                onClose={() => setError('')}
                sx={{
                  mb: 4,
                  borderRadius: 2,
                  boxShadow: '0 4px 12px rgba(239, 68, 68, 0.2)'
                }}
              >
                {error}
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {uploading && (
          <Box sx={{ width: '100%', mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="caption" color="primary.light" fontWeight="bold">
                ANALYZING SKILL GAPS...
              </Typography>
              <Typography variant="caption" color="primary.light" fontWeight="bold">
                {progress}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: 'rgba(99, 102, 241, 0.1)',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 4,
                  background: 'linear-gradient(90deg, #6366F1 0%, #8B5CF6 100%)'
                }
              }}
            />
          </Box>
        )}

        <Box sx={{ textAlign: 'center' }}>
          <MotionButton
            variant="contained"
            size="large"
            onClick={handleAnalyze}
            disabled={uploading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            sx={{
              px: 6,
              py: 2,
              fontSize: '1.1rem',
              fontWeight: 700,
              boxShadow: '0 8px 16px rgba(99, 102, 241, 0.3)',
              borderRadius: 50,
              background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)'
            }}
            startIcon={
              uploading ? <CircularProgress size={20} color="inherit" /> : <AutoAwesomeIcon />
            }
          >
            {uploading ? 'Processing Analysis...' : 'Start Intelligence Scan'}
          </MotionButton>
        </Box>
      </Container>
    </Box>
  );
};

export default UploadPage;