import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6366F1', // Glowing Purple-Blue Target
      light: '#818CF8', 
      dark: '#4F46E5',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#8B5CF6', 
      light: '#A78BFA',
      dark: '#7C3AED',
      contrastText: '#ffffff',
    },
    success: {
      main: '#10B981', // Emerald
      light: '#34D399',
    },
    warning: {
      main: '#F59E0B', // Amber
    },
    error: {
      main: '#EF4444', // Red
    },
    info: {
      main: '#0EA5E9', // Sky Blue
    },
    background: {
      default: '#020617', // Slate 950 - Extremely deep dark background
      paper: 'rgba(15, 23, 42, 0.65)', // Slate 900 Glass
    },
    text: {
      primary: '#F8FAFC', // Crisp white text
      secondary: '#94A3B8', // Slate 400
    },
  },
  typography: {
    fontFamily: '"Inter", "system-ui", "sans-serif"',
    h1: {
      fontWeight: 800,
      fontSize: '3.5rem',
      lineHeight: 1.1,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 800,
      fontSize: '2.5rem',
      lineHeight: 1.2,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontWeight: 700,
      fontSize: '1.875rem',
      lineHeight: 1.3,
    },
    h4: {
      fontWeight: 700,
      fontSize: '1.5rem',
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.4,
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.125rem',
      lineHeight: 1.4,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      letterSpacing: '0.02em',
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 50,
          padding: '12px 28px',
          boxShadow: 'none',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:active': {
            transform: 'scale(0.98)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
          boxShadow: '0 8px 24px -8px rgba(99, 102, 241, 0.5)',
          '&:hover': {
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
            boxShadow: '0 12px 28px -8px rgba(99, 102, 241, 0.7)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)', // Safari support
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(16px)',
          boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
        },
        filled: {
          backgroundColor: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
        }
      }
    }
  },
});

export default theme;
