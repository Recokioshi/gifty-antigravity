'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Box, 
  Typography, 
  Button, 
  TextField, 
  Paper, 
  CircularProgress 
} from '@mui/material';

export default function Home() {
  const router = useRouter();
  const [listName, setListName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreateList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!listName.trim() || !password.trim()) {
      setError('Please provide a name and password for your list.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: listName, password }),
      });

      if (!response.ok) {
        throw new Error('Failed to create list');
      }

      const data = await response.json();
      router.push(`/list/${data.id}`);
    } catch (err: any) {
      console.error(err);
      setError('Could not create your list. Please try again.');
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', mt: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" component="h2" gutterBottom>
          Create a Wish List
        </Typography>
        <Typography variant="body1" color="text.secondary">
          A simple, shared space for birthdays, holidays, and celebrations.
        </Typography>
      </Box>

      <Paper 
        elevation={0}
        component="form" 
        onSubmit={handleCreateList}
        sx={{ 
          p: 4, 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 3,
          backgroundColor: '#FFFFFF',
        }}
      >
        {error && (
          <Typography color="error.main" variant="body2" textAlign="center">
            {error}
          </Typography>
        )}
        
        <TextField
          label="For who or what is this list?"
          placeholder="e.g. Mom's 50th Birthday"
          variant="outlined"
          value={listName}
          onChange={(e) => setListName(e.target.value)}
          fullWidth
          required
        />

        <TextField
          label="Secret Password"
          helperText="You'll need this to edit the list later."
          variant="outlined"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          required
        />

        <Button 
          type="submit" 
          variant="contained" 
          color="primary" 
          size="large"
          disabled={loading}
          sx={{ mt: 2 }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Create List'}
        </Button>
      </Paper>
    </Box>
  );
}
