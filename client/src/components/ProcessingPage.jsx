import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, LinearProgress, CircularProgress, Fade } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const steps = [
    "Extracting Resume Data...",
    "Parsing Job Description...",
    "Analyzing Skill Gaps...",
    "Generating Learning Roadmap...",
    "Finalizing Report..."
];

const ProcessingPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        // Simulate processing steps
        const interval = setInterval(() => {
            setCurrentStep((prev) => {
                if (prev < steps.length - 1) {
                    return prev + 1;
                } else {
                    clearInterval(interval);
                    setTimeout(() => {
                        navigate('/results', { state: location.state }); // Pass data forward
                    }, 1000);
                    return prev;
                }
            });
        }, 1500); // 1.5s per step

        return () => clearInterval(interval);
    }, [navigate, location.state]);

    return (
        <Container maxWidth="sm" sx={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <Box sx={{ position: 'relative', display: 'inline-flex', mb: 6 }}>
                    <CircularProgress size={120} thickness={2} sx={{ color: 'primary.main' }} />
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
                        }}
                    >
                        <Typography variant="caption" component="div" color="text.secondary" sx={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                            {Math.round(((currentStep + 1) / steps.length) * 100)}%
                        </Typography>
                    </Box>
                </Box>
            </motion.div>

            <Typography variant="h5" gutterBottom fontWeight="bold" align="center">
                Analyzing Your Profile
            </Typography>

            <Box sx={{ width: '100%', mt: 4 }}>
                {steps.map((step, index) => (
                    <Fade in={index <= currentStep} timeout={500} key={index}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, opacity: index === currentStep ? 1 : 0.5 }}>
                            {index < currentStep ? (
                                <CheckCircleIcon color="success" sx={{ mr: 2 }} />
                            ) : index === currentStep ? (
                                <CircularProgress size={20} sx={{ mr: 2 }} />
                            ) : (
                                <Box sx={{ width: 24, height: 24, mr: 2, border: '2px solid rgba(255,255,255,0.1)', borderRadius: '50%' }} />
                            )}
                            <Typography variant="body1" color={index === currentStep ? 'text.primary' : 'text.secondary'} fontWeight={index === currentStep ? 'bold' : 'normal'}>
                                {step}
                            </Typography>
                        </Box>
                    </Fade>
                ))}
            </Box>
        </Container>
    );
};

export default ProcessingPage;
