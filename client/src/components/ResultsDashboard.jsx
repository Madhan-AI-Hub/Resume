import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Paper, Chip, Stack, Button, CircularProgress, Divider, Avatar, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import { Grid } from '@mui/material';
import { motion } from 'framer-motion';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import WarningIcon from '@mui/icons-material/Warning';
import SchoolIcon from '@mui/icons-material/School';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import DownloadIcon from '@mui/icons-material/Download';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { useNavigate, useLocation } from 'react-router-dom';

const MotionPaper = motion(Paper);

const MatchScore = ({ score }) => {
    return (
        <Box sx={{ position: 'relative', display: 'inline-flex', justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress
                variant="determinate"
                value={score}
                size={180}
                thickness={4}
                sx={{
                    color: score >= 80 ? 'success.main' : score >= 50 ? 'warning.main' : 'error.main',
                    bgcolor: 'rgba(255,255,255,0.05)',
                    borderRadius: '50%'
                }}
            />
            <Box
                sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column'
                }}
            >
                <Typography variant="h2" component="div" fontWeight="800">
                    {score}%
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    MATCH SCORE
                </Typography>
            </Box>
        </Box>
    );
};

const SkillChip = ({ label, type }) => {
    let color = 'default';
    let icon = null;

    if (type === 'match') {
        color = 'success';
        icon = <CheckCircleIcon />;
    } else if (type === 'missing') {
        color = 'error';
        icon = <CancelIcon />;
    } else if (type === 'weak') {
        color = 'warning';
        icon = <WarningIcon />;
    }

    return (
        <Chip
            label={label}
            color={color}
            icon={icon}
            sx={{ m: 0.5, fontWeight: 'medium' }}
            variant={type === 'match' ? 'filled' : 'outlined'}
        />
    );
};

const SuggestionCard = ({ title, description }) => (
    <MotionPaper
        whileHover={{ scale: 1.02 }}
        sx={{ p: 2, mb: 2, borderLeft: '4px solid', borderColor: 'info.main' }}
    >
        <Stack direction="row" spacing={2} alignItems="flex-start">
            <LightbulbIcon color="info" />
            <Box>
                <Typography variant="subtitle1" fontWeight="bold">
                    {title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {description}
                </Typography>
            </Box>
        </Stack>
    </MotionPaper>
);

const RoadmapStep = ({ num, title, desc }) => (
    <Box sx={{ display: 'flex', mb: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mr: 2 }}>
            <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32, fontSize: '0.9rem' }}>{num}</Avatar>
            {num !== 4 && <Box sx={{ width: 2, flexGrow: 1, bgcolor: 'divider', mt: 1 }} />}
        </Box>
        <Box sx={{ pb: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold">
                {title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
                {desc}
            </Typography>
        </Box>
    </Box>
);

const ResultsDashboard = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Fallback/Mock data if no state (e.g., direct access)
    const initialResults = location.state?.results || {
        score: 0,
        skills: { matched: [], missing: [], weak: [] },
        suggestions: [],
        roadmap: []
    };

    const [results, setResults] = useState(initialResults);

    useEffect(() => {
        if (!location.state?.results) {
            // Optional: Redirect or show empty state
            // navigate('/upload');
        }
    }, [location, navigate]);

    // Helper to ensure arrays exist
    const safeResults = {
        score: results.score || 0,
        skills: {
            matched: results.skills?.matched || [],
            missing: results.skills?.missing || [],
            weak: results.skills?.weak || []
        },
        suggestions: results.suggestions || [],
        roadmap: results.roadmap || []
    };

    return (
        <Container maxWidth="lg" sx={{ py: 8 }}>
            <Grid container spacing={6}>
                {/* Score & Summary */}
                <Grid xs={12} md={4} sx={{ textAlign: 'center' }}>
                    <Paper sx={{ p: 4, borderRadius: 4, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <MatchScore score={results.score} />
                        <Typography variant="h5" sx={{ mt: 3, mb: 1, fontWeight: 'bold' }}>
                            Good Match!
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                            You profile is strong, but there are a few key areas to improve to be a top candidate.
                        </Typography>
                        <Button variant="contained" startIcon={<DownloadIcon />} fullWidth sx={{ mb: 2 }}>
                            Download Full Report
                        </Button>
                        <Button variant="outlined" color="secondary" fullWidth>
                            Optimized Resume Template
                        </Button>
                    </Paper>
                </Grid>

                {/* Skills Breakdown */}
                <Grid xs={12} md={8}>
                    <Typography variant="h4" gutterBottom fontWeight="bold">
                        Skills Breakdown
                    </Typography>
                    <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>MATCHED SKILLS</Typography>
                        <Box sx={{ mb: 3 }}>
                            {results.skills.matched.map(skill => <SkillChip key={skill} label={skill} type="match" />)}
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>MISSING SKILLS (CRITICAL)</Typography>
                        <Box sx={{ mb: 3 }}>
                            {results.skills.missing.map(skill => <SkillChip key={skill} label={skill} type="missing" />)}
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>WEAK SKILLS (NEEDS IMPROVEMENT)</Typography>
                        <Box>
                            {results.skills.weak.map(skill => <SkillChip key={skill} label={skill} type="weak" />)}
                        </Box>
                    </Paper>

                    {/* Improvement Suggestions */}
                    <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ mt: 6, mb: 3 }}>
                        Resume Improvements
                    </Typography>
                    {results.suggestions.map((s, i) => (
                        <SuggestionCard key={i} title={s.title} description={s.desc} />
                    ))}

                    {/* Learning Roadmap */}
                    <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ mt: 6, mb: 3 }}>
                        Personalized Learning Roadmap
                    </Typography>
                    <Paper sx={{ p: 4, borderRadius: 3 }}>
                        {results.roadmap.map((step, i) => (
                            <RoadmapStep key={i} num={i + 1} title={step.title} desc={step.desc} />
                        ))}
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default ResultsDashboard;
