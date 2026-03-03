import React from 'react';
import { Box, Button, Container, Typography, Stack, Step, StepLabel, Stepper, Card, CardContent, useTheme } from '@mui/material';
import { Grid } from '@mui/material';
import { motion } from 'framer-motion';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TimelineIcon from '@mui/icons-material/Timeline';
import DescriptionIcon from '@mui/icons-material/Description';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const MotionContainer = motion(Container);
const MotionBox = motion(Box);
const MotionTypography = motion(Typography);

const HeroSection = () => {
    const navigate = useNavigate();
    const theme = useTheme();

    return (
        <Box
            sx={{
                background: `linear-gradient(180deg, ${theme.palette.background.default} 0%, ${theme.palette.primary.dark} 100%)`,
                pt: 15,
                pb: 10,
                overflow: 'hidden',
                position: 'relative',
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={4} alignItems="center">
                    <Grid size={{ xs: 12, md: 8 }} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                        <MotionTypography
                            variant="h1"
                            gutterBottom
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            sx={{
                                fontSize: { xs: '2.5rem', md: '4rem' },
                                fontWeight: 800,
                                background: `-webkit-linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            Upload Resume. Match with Job. <br /> Close Your Skill Gaps.
                        </MotionTypography>
                        <MotionTypography
                            variant="h5"
                            color="text.secondary"
                            paragraph
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            sx={{ mb: 4, maxWidth: 600, mx: { xs: 'auto', md: 0 } }}
                        >
                            Get actionable feedback, tailored learning roadmaps, and an ATS-friendly analysis to help you land your dream job.
                        </MotionTypography>
                        <MotionBox
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                        >
                            <Button
                                variant="contained"
                                size="large"
                                onClick={() => navigate('/upload')}
                                sx={{
                                    px: 4,
                                    py: 1.5,
                                    fontSize: '1.2rem',
                                }}
                            >
                                Analyze Resume
                            </Button>
                        </MotionBox>
                    </Grid>
                    {/* Abstract Visual/Illustration would go here in Grid item md={4} */}
                </Grid>
            </Container>
        </Box>
    );
};

const HowItWorks = () => {
    const theme = useTheme();
    const steps = [
        { label: 'Upload', description: 'Upload your Resume & Job Description', icon: <UploadFileIcon fontSize="large" /> },
        { label: 'Analyze', description: 'AI scans for missing skills & matches', icon: <AnalyticsIcon fontSize="large" /> },
        { label: 'Improve', description: 'Get a roadmap to close the gaps', icon: <AutoFixHighIcon fontSize="large" /> },
    ];

    return (
        <Box sx={{ py: 10, bgcolor: 'background.paper' }}>
            <Container maxWidth="lg">
                <Typography variant="h2" align="center" gutterBottom sx={{ mb: 6 }}>
                    How It Works
                </Typography>
                <Grid container spacing={4} justifyContent="center">
                    {steps.map((step, index) => (
                        <Grid size={{ xs: 12, md: 4 }} key={index}>
                            <MotionBox
                                whileHover={{ y: -10 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                            >
                                <Card sx={{ height: '100%', textAlign: 'center', py: 4, borderRadius: 4 }}>
                                    <CardContent>
                                        <Box sx={{
                                            display: 'inline-flex',
                                            p: 2,
                                            borderRadius: '50%',
                                            bgcolor: 'rgba(99, 102, 241, 0.1)',
                                            color: 'primary.main',
                                            mb: 2
                                        }}>
                                            {step.icon}
                                        </Box>
                                        <Typography variant="h5" gutterBottom fontWeight="bold">
                                            {step.label}
                                        </Typography>
                                        <Typography variant="body1" color="text.secondary">
                                            {step.description}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </MotionBox>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

const Features = () => {
    const features = [
        { title: 'Skill Gap Detection', desc: 'Identify exactly what skills you are missing for the job.', icon: <CheckCircleIcon color="success" /> },
        { title: 'Learning Roadmap', desc: 'Step-by-step guide to learn missing skills.', icon: <TimelineIcon color="primary" /> },
        { title: 'Resume Suggestions', desc: 'Actionable tips to improve your resume wording.', icon: <DescriptionIcon color="secondary" /> },
        { title: 'ATS Analysis', desc: 'Ensure your resume passes Applicant Tracking Systems.', icon: <AnalyticsIcon color="info" /> },
    ];

    return (
        <Box sx={{ py: 10 }}>
            <Container maxWidth="lg">
                <Typography variant="h2" align="center" gutterBottom sx={{ mb: 6 }}>
                    Features
                </Typography>
                <Grid container spacing={4}>
                    {features.map((feature, index) => (
                        <Grid size={{ xs: 12, sm: 6 }} key={index}>
                            <MotionBox
                                whileHover={{ scale: 1.02 }}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card sx={{ display: 'flex', p: 2, borderRadius: 3, alignItems: 'center' }}>
                                    <Box sx={{ mr: 2 }}>{feature.icon}</Box>
                                    <CardContent sx={{ flex: '1 0 auto', p: '0 !important' }}>
                                        <Typography variant="h6" fontWeight="bold">
                                            {feature.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {feature.desc}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </MotionBox>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

const LandingPage = () => {
    return (
        <Box>
            <Navbar />
            <HeroSection />
            <HowItWorks />
            <Features />
            {/* Final CTA */}
            <Box sx={{ py: 10, textAlign: 'center', bgcolor: 'primary.dark' }}>
                <Container maxWidth="sm">
                    <Typography variant="h3" gutterBottom>
                        Ready to Land Your Dream Job?
                    </Typography>
                    <Typography variant="h6" sx={{ mb: 4, opacity: 0.8 }}>
                        Join thousands of job seekers optimizing their potential.
                    </Typography>
                    <Button variant="contained" color="secondary" size="large" href="/upload" sx={{ px: 5, py: 1.5, fontSize: '1.1rem', bgcolor: 'white', color: 'primary.dark', '&:hover': { bgcolor: 'grey.100' } }}>
                        Start Analysis Now
                    </Button>
                </Container>
            </Box>
        </Box>
    );
};

export default LandingPage;
