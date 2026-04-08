import React from 'react';
import { 
    Box, Container, Typography, Paper, Stack, Button, 
    Divider, IconButton, Chip 
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SchoolIcon from '@mui/icons-material/School';
import ExtensionIcon from '@mui/icons-material/Extension';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import Navbar from './Navbar';

const MotionPaper = motion(Paper);

const SkillStep = ({ skillData, index }) => {
    return (
        <MotionPaper
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15 }}
            sx={{
                p: 4,
                mb: 4,
                borderRadius: 6,
                background: 'rgba(15, 23, 42, 0.4)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            <Box sx={{ 
                position: 'absolute', top: 0, right: 0, 
                width: 120, height: 120, 
                background: 'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)',
                zIndex: 0
            }} />

            <Stack spacing={3} sx={{ position: 'relative', zIndex: 1 }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                    <Box sx={{ 
                        width: 48, height: 48, borderRadius: 3, 
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        bgcolor: 'primary.main', color: '#fff'
                    }}>
                        <ExtensionIcon />
                    </Box>
                    <Box>
                        <Typography variant="h5" fontWeight="900">{skillData.skill}</Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                            Priority Skill Acquisition
                        </Typography>
                    </Box>
                </Stack>

                <Divider sx={{ opacity: 0.1 }} />

                <Box>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                        <SchoolIcon sx={{ color: 'primary.light', fontSize: 20 }} />
                        <Typography variant="subtitle2" fontWeight="800">What to Learn</Typography>
                    </Stack>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {skillData.topics.map((topic, i) => (
                            <Chip 
                                key={i} 
                                label={topic} 
                                variant="outlined" 
                                size="small"
                                sx={{ borderRadius: 2, borderColor: 'rgba(255,255,255,0.1)', cursor: 'default' }}
                            />
                        ))}
                    </Box>
                </Box>

                <Box>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                        <LibraryBooksIcon sx={{ color: 'secondary.light', fontSize: 20 }} />
                        <Typography variant="subtitle2" fontWeight="800">Recommended Resources</Typography>
                    </Stack>
                    <Stack spacing={1}>
                        {skillData.where.map((site, i) => (
                            <Box key={i} sx={{ 
                                display: 'flex', alignItems: 'center', 
                                px: 2, py: 1, borderRadius: 2, 
                                bgcolor: 'rgba(255,255,255,0.03)',
                                border: '1px solid rgba(255,255,255,0.05)',
                                cursor: 'pointer',
                                '&:hover': { bgcolor: 'rgba(99, 102, 241, 0.1)', borderColor: 'primary.main' },
                                transition: 'all 0.2s'
                            }}>
                                <Typography variant="body2" fontWeight="600">{site}</Typography>
                            </Box>
                        ))}
                    </Stack>
                </Box>
            </Stack>
        </MotionPaper>
    );
};

const RoadmapPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Fallback if no data is passed
    const results = location.state?.results || location.state || {
        roadmap: []
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: 10 }}>
            <Navbar />
            
            <Container maxWidth="md" sx={{ pt: 16 }}>
                <Stack spacing={4}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Button 
                            startIcon={<ArrowBackIcon />} 
                            onClick={() => navigate(-1)}
                            sx={{ color: 'text.secondary', '&:hover': { color: '#fff' } }}
                        >
                            Return to Report
                        </Button>
                        <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 800 }}>
                            PERSONALIZED CAREER ASCENSION PATH
                        </Typography>
                    </Box>

                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <Typography variant="h2" fontWeight="900" gutterBottom>
                            Skill Acquisition Roadmap
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
                            Based on our neural analysis, these are the critical steps required to achieve 100% alignment with the target role.
                        </Typography>
                    </Box>

                    {results.roadmap?.length > 0 ? (
                        <Box sx={{ position: 'relative' }}>
                            {/* Central timeline line */}
                            <Box sx={{ 
                                position: 'absolute', left: -20, top: 0, bottom: 0, 
                                width: 4, background: 'linear-gradient(to bottom, #6366F1, transparent)',
                                opacity: 0.3, borderRadius: 2
                            }} />

                            {results.roadmap.map((skill, index) => (
                                <SkillStep key={index} skillData={skill} index={index} />
                            ))}
                        </Box>
                    ) : (
                        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 6, bgcolor: 'rgba(255,255,255,0.02)' }}>
                            <Typography variant="h5" color="text.secondary">No skill gaps detected.</Typography>
                            <Typography variant="body2" color="text.disabled" sx={{ mt: 1 }}>
                                You are 100% aligned with the requirements!
                            </Typography>
                        </Paper>
                    )}

                    <Box sx={{ textAlign: 'center', pt: 4 }}>
                        <Button 
                            variant="outlined" 
                            size="large"
                            onClick={() => window.print()}
                            sx={{ borderRadius: 50, px: 4 }}
                        >
                            Print Path
                        </Button>
                    </Box>
                </Stack>
            </Container>
        </Box>
    );
};

export default RoadmapPage;
