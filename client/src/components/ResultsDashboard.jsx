import React, { useEffect } from 'react';
import { 
    Box, Container, Typography, Paper, Chip, Stack, Button, 
    CircularProgress, Divider, useTheme 
} from '@mui/material';
import { Grid } from '@mui/material';
import { motion } from 'framer-motion';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import LightbulbCircleIcon from '@mui/icons-material/LightbulbCircle';
import MapIcon from '@mui/icons-material/Map';
import DownloadIcon from '@mui/icons-material/Download';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from './Navbar';

const MotionPaper = motion(Paper);

const ScoreHero = ({ score, summary }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    
    const getColor = () => {
        if (score >= 80) return theme.palette.success.main;
        if (score >= 50) return theme.palette.warning.main;
        return theme.palette.error.main;
    };

    return (
        <MotionPaper
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            sx={{
                p: 5,
                borderRadius: 6,
                textAlign: 'center',
                background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.4) 0%, rgba(15, 23, 42, 0.8) 100%)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            <Box sx={{ position: 'relative', display: 'inline-flex', mb: 3 }}>
                <CircularProgress
                    variant="determinate"
                    value={score}
                    size={200}
                    thickness={4}
                    sx={{ color: getColor(), filter: `drop-shadow(0 0 10px ${getColor()}44)` }}
                />
                <Box sx={{
                    top: 0, left: 0, bottom: 0, right: 0,
                    position: 'absolute', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', flexDirection: 'column'
                }}>
                    <Typography variant="h1" sx={{ fontWeight: 900, color: '#fff' }}>
                        {score}
                    </Typography>
                    <Typography variant="overline" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>
                        Alignment Index
                    </Typography>
                </Box>
            </Box>
            
            <Typography variant="h4" fontWeight="800" sx={{ mb: 2 }}>
                {score >= 80 ? "Premium Alignment" : score >= 50 ? "Balanced Match" : "Significant Variance"}
            </Typography>
            
            <Paper sx={{ p: 2, mb: 4, bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 3, border: '1px dashed rgba(255,255,255,0.1)' }}>
                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', lineHeight: 1.6 }}>
                    "{summary}"
                </Typography>
            </Paper>

            <Stack direction="column" spacing={2}>
                <Button 
                    variant="contained" 
                    fullWidth 
                    size="large"
                    startIcon={<MapIcon />}
                    onClick={() => navigate('/roadmap', { state: location.state })}
                    sx={{ py: 1.5, fontWeight: 800, background: 'linear-gradient(45deg, #6366F1, #8B5CF6)' }}
                >
                    View Career Roadmap
                </Button>
                <Stack direction="row" spacing={2}>
                    <Button variant="outlined" fullWidth startIcon={<DownloadIcon />}>
                        PDF Report
                    </Button>
                    <Button variant="outlined" fullWidth startIcon={<AutoFixHighIcon />}>
                        Optimize
                    </Button>
                </Stack>
            </Stack>
        </MotionPaper>
    );
};

const SkillCategory = ({ title, skills, type, delay }) => {
    const icons = {
        match: <CheckCircleIcon sx={{ fontSize: 16, mr: 0.5 }} />,
        missing: <ErrorOutlineIcon sx={{ fontSize: 16, mr: 0.5 }} />,
        weak: <WarningAmberIcon sx={{ fontSize: 16, mr: 0.5 }} />
    };
    
    const colors = {
        match: 'success',
        missing: 'error',
        weak: 'warning'
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay }}
        >
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 800, mb: 1, display: 'block', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                {title} ({skills.length})
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 4 }}>
                {skills.length > 0 ? skills.map((skill, i) => (
                    <Chip 
                        key={i} 
                        label={skill} 
                        size="small"
                        color={colors[type]}
                        icon={icons[type]}
                        sx={{ 
                            borderRadius: '8px', 
                            fontWeight: 700,
                            bgcolor: `rgba(${type === 'match' ? '16, 185, 129' : type === 'missing' ? '239, 68, 68' : '245, 158, 11'}, 0.1)`,
                            border: '1px solid currentColor'
                        }} 
                    />
                )) : (
                    <Typography variant="body2" color="text.disabled">No indicators detected</Typography>
                )}
            </Box>
        </motion.div>
    );
};

const ResultsDashboard = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    const results = location.state?.results || location.state || {
        score: 0,
        summary: "Analysis pending.",
        skills: { matched: [], missing: [], weak: [] },
        suggestions: [],
        roadmap: []
    };

    useEffect(() => {
        if (!location.state) {
            // navigate('/upload');
        }
    }, [location.state, navigate]);

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', position: 'relative' }}>
            <Navbar />
            
            {/* Background elements */}
            <Box sx={{
                position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                background: 'radial-gradient(circle at 50% -20%, rgba(99, 102, 241, 0.1) 0%, transparent 80%)',
                zIndex: 0, pointerEvents: 'none'
            }} />

            <Container maxWidth="lg" sx={{ pt: 16, pb: 10, position: 'relative', zIndex: 1 }}>
                <Grid container spacing={5}>
                    {/* Left: Score Column */}
                    <Grid item xs={12} md={5}>
                        <ScoreHero score={results.score} summary={results.summary} />
                    </Grid>

                    {/* Right: Skills & Intelligence Column */}
                    <Grid item xs={12} md={7}>
                        <Stack spacing={4}>
                            <Box>
                                <Typography variant="h5" fontWeight="900" gutterBottom>
                                    Intelligence Analysis
                                </Typography>
                                <Divider sx={{ mb: 3, opacity: 0.1 }} />
                                <SkillCategory title="Matched Proficiencies" skills={results.skills.matched} type="match" delay={0.3} />
                                <SkillCategory title="Critical Deficiencies" skills={results.skills.missing} type="missing" delay={0.4} />
                                <SkillCategory title="Growth Opportunities" skills={results.skills.weak} type="weak" delay={0.5} />
                            </Box>

                            <Box>
                                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                                    <LightbulbCircleIcon color="warning" />
                                    <Typography variant="h6" fontWeight="800">Optimization Strategies</Typography>
                                </Stack>
                                <Grid container spacing={2}>
                                    {results.suggestions.map((s, i) => (
                                        <Grid item xs={12} key={i}>
                                            <Paper sx={{ 
                                                p: 2, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.02)',
                                                border: '1px solid rgba(255,255,255,0.05)',
                                                '&:hover': { borderColor: 'primary.main', bgcolor: 'rgba(99, 102, 241, 0.05)' },
                                                transition: 'all 0.2s'
                                            }}>
                                                <Typography variant="subtitle2" fontWeight="bold" color="primary.light">{s.title}</Typography>
                                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>{s.desc}</Typography>
                                            </Paper>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>
                        </Stack>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default ResultsDashboard;
