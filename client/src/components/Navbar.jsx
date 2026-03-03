import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Container, useScrollTrigger, Slide, IconButton, Drawer, List, ListItem, ListItemButton, ListItemText, useTheme, useMediaQuery } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

const HideOnScroll = (props) => {
    const { children, window } = props;
    const trigger = useScrollTrigger({
        target: window ? window() : undefined,
    });

    return (
        <Slide appear={false} direction="down" in={!trigger}>
            {children}
        </Slide>
    );
};

const Navbar = (props) => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navItems = [
        { label: 'Home', path: '/' },
        // { label: 'Features', path: '/#features' }, // Could add anchor links
        // { label: 'How it Works', path: '/#how-it-works' },
    ];

    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center', p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                <AutoAwesomeIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Smart Resume
                </Typography>
            </Box>
            <List>
                {navItems.map((item) => (
                    <ListItem key={item.label} disablePadding>
                        <ListItemButton onClick={() => navigate(item.path)} sx={{ textAlign: 'center', borderRadius: 2 }}>
                            <ListItemText primary={item.label} />
                        </ListItemButton>
                    </ListItem>
                ))}
                <ListItem disablePadding>
                    <ListItemButton onClick={() => navigate('/upload')} sx={{ justifyContent: 'center' }}>
                        <Button variant="contained" fullWidth sx={{ borderRadius: 50 }}>Get Started</Button>
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    );

    return (
        <Box sx={{ flexGrow: 1 }}>
            <HideOnScroll {...props}>
                <AppBar
                    position="fixed"
                    elevation={isScrolled ? 4 : 0}
                    sx={{
                        bgcolor: isScrolled ? 'rgba(15, 23, 42, 0.8)' : 'transparent',
                        backdropFilter: isScrolled ? 'blur(12px)' : 'none',
                        borderBottom: isScrolled ? '1px solid rgba(255,255,255,0.05)' : 'none',
                        transition: 'all 0.3s ease-in-out',
                        py: 1
                    }}
                >
                    <Container maxWidth="lg">
                        <Toolbar disableGutters>
                            {/* Logo */}
                            <Box
                                sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', flexGrow: 1 }}
                                onClick={() => navigate('/')}
                                component={motion.div}
                                whileHover={{ scale: 1.05 }}
                            >
                                <AutoAwesomeIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, fontSize: 32, color: 'primary.main' }} />
                                <Typography
                                    variant="h5"
                                    noWrap
                                    component="div"
                                    sx={{
                                        mr: 2,
                                        display: { xs: 'flex', md: 'flex' },
                                        fontWeight: 800,
                                        letterSpacing: '.05rem',
                                        color: 'inherit',
                                        textDecoration: 'none',
                                        background: isScrolled ? 'none' : `linear-gradient(45deg, #fff, ${theme.palette.primary.light})`,
                                        WebkitBackgroundClip: isScrolled ? 'none' : 'text',
                                        WebkitTextFillColor: isScrolled ? 'inherit' : 'transparent',
                                    }}
                                >
                                    Smart Resume
                                </Typography>
                            </Box>

                            {/* Desktop Menu */}
                            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 4 }}>
                                {navItems.map((item) => (
                                    <Button
                                        key={item.label}
                                        onClick={() => navigate(item.path)}
                                        sx={{
                                            color: 'text.secondary',
                                            fontWeight: 600,
                                            '&:hover': { color: 'primary.main', bgcolor: 'transparent' }
                                        }}
                                    >
                                        {item.label}
                                    </Button>
                                ))}
                                <Button
                                    variant={isScrolled ? "contained" : "outlined"}
                                    onClick={() => navigate('/upload')}
                                    sx={{
                                        borderRadius: 50,
                                        px: 3,
                                        color: isScrolled ? 'white' : 'white',
                                        borderColor: 'rgba(255,255,255,0.3)',
                                        '&:hover': {
                                            borderColor: 'primary.main',
                                            bgcolor: isScrolled ? 'primary.dark' : 'rgba(255,255,255,0.1)'
                                        }
                                    }}
                                >
                                    Get Started
                                </Button>
                            </Box>

                            {/* Mobile Menu Icon */}
                            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                                <IconButton
                                    size="large"
                                    aria-label="open drawer"
                                    edge="start"
                                    onClick={handleDrawerToggle}
                                    color="inherit"
                                >
                                    <MenuIcon />
                                </IconButton>
                            </Box>
                        </Toolbar>
                    </Container>
                </AppBar>
            </HideOnScroll>

            {/* Mobile Drawer */}
            <nav>
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: 'block', md: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240, bgcolor: 'background.paper' },
                    }}
                >
                    {drawer}
                </Drawer>
            </nav>
        </Box>
    );
};

export default Navbar;
