'use client';

import { createTheme } from '@mui/material/styles';
import { Nunito } from 'next/font/google';

const nunito = Nunito({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
});

const theme = createTheme({
  typography: {
    fontFamily: nunito.style.fontFamily,
    h1: {
      fontWeight: 700,
      color: '#4A3B32', // Warm, dark brown
    },
    h2: {
      fontWeight: 600,
      color: '#4A3B32',
    },
    h3: {
      fontWeight: 600,
      color: '#4A3B32',
    },
    body1: {
      color: '#5C4E46', // Softer brown for text
    },
  },
  palette: {
    primary: {
      main: '#F4A261', // Soft orange/peach
      light: '#F8C89C',
      dark: '#E76F51',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#E9C46A', // Warm yellow
      light: '#F4DFA8',
      dark: '#D4A346',
      contrastText: '#4A3B32',
    },
    background: {
      default: '#FDFBF7', // Very warm white/cream
      paper: '#FFFFFF',
    },
    success: {
      main: '#2A9D8F', // Muted, warm teal/green
    },
    error: {
      main: '#E76F51', // Soft red/coral
    },
    info: {
      main: '#457B9D', // Soft blue
    },
  },
  shape: {
    borderRadius: 16, // Friendly rounded corners
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // More conversational, less corporate
          fontWeight: 600,
          borderRadius: 24, // Very round pills
          padding: '8px 24px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 4px 8px rgba(0,0,0,0.08)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #F4A261 0%, #E76F51 100%)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.04)',
          border: '1px solid rgba(244, 162, 97, 0.15)', // Subtle peach border
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            backgroundColor: '#FFFFFF',
            '& fieldset': {
              borderColor: 'rgba(74, 59, 50, 0.15)', // Subtle brown
            },
            '&:hover fieldset': {
              borderColor: '#F4A261',
            },
          },
        },
      },
    },
  },
});

export default theme;
