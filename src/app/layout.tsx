import type { Metadata } from 'next';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { Box, Container, Typography } from '@mui/material';
import Link from 'next/link';
import ThemeRegistry from './ThemeRegistry';

export const metadata: Metadata = {
  title: 'Gifty',
  description: 'A simple, friendly wish list organizer',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ backgroundColor: '#FDFBF7', margin: 0 }}>
        <AppRouterCacheProvider>
          <ThemeRegistry>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
              }}
            >
              <Box
                component="header"
                sx={{
                  py: 3,
                  px: 4,
                  bgcolor: 'transparent',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <Link href="/" style={{ textDecoration: 'none' }}>
                  <Typography
                    variant="h4"
                    component="h1"
                    sx={{
                      fontWeight: 800,
                      color: '#E76F51', // primary.dark fallback
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      letterSpacing: '-0.02em',
                    }}
                  >
                    <span style={{ fontSize: '1.2em' }}>🎁</span> Gifty
                  </Typography>
                </Link>
              </Box>

              <Container component="main" sx={{ flexGrow: 1, py: 4, maxWidth: 'md' }}>
                {children}
              </Container>

              <Box
                component="footer"
                sx={{
                  py: 4,
                  textAlign: 'center',
                  color: 'text.secondary',
                  opacity: 0.8,
                }}
              >
                <Typography variant="body2">
                  Make wishing wonderful. ✨ 
                </Typography>
              </Box>
            </Box>
          </ThemeRegistry>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
