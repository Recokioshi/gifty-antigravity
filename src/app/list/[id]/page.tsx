'use client';

import { useEffect, useState, useCallback, use } from 'react';
import { 
  Box, Typography, Button, Dialog, DialogTitle, DialogContent, 
  DialogActions, TextField, CircularProgress, IconButton, Divider 
} from '@mui/material';
import { Gift as GiftIcon, Lock, Unlock, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Gift, GiftList } from '@/lib/db';
import GiftRow from '@/app/components/GiftRow';

export default function ListPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  
  const [list, setList] = useState<Omit<GiftList, 'password_hash'> | null>(null);
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Owner Mode State
  const [isOwner, setIsOwner] = useState(false);
  const [ownerPassword, setOwnerPassword] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Add/Edit Gift State
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [editingGift, setEditingGift] = useState<Gift | null>(null);
  const [newGiftName, setNewGiftName] = useState('');
  const [newGiftDesc, setNewGiftDesc] = useState('');
  const [newGiftUrl, setNewGiftUrl] = useState('');

  const fetchListData = useCallback(async () => {
    try {
      const res = await fetch(`/api/list/${id}`);
      if (res.ok) {
        const data = await res.json();
        setList(data.list);
        setGifts(data.gifts);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchListData();
  }, [fetchListData]);

  const handleOwnerLogin = async () => {
    setLoginError('');
    try {
      const res = await fetch(`/api/list/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: ownerPassword }),
      });
      if (res.ok) {
        setIsOwner(true);
        setShowLogin(false);
      } else {
        setLoginError('Incorrect password');
      }
    } catch (err) {
      setLoginError('An error occurred');
    }
  };

  const handleStatusChange = async (giftId: string, status: string) => {
    try {
      await fetch(`/api/list/${id}/gifts/${giftId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, password: isOwner ? ownerPassword : '' }),
      });
      fetchListData(); // re-fetch to get latest
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const handleDeleteGift = async (giftId: string) => {
    if (!confirm('Are you sure you want to delete this gift?')) return;
    try {
      await fetch(`/api/list/${id}/gifts/${giftId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: ownerPassword }),
      });
      fetchListData();
    } catch (err) {
      console.error('Failed to delete gift', err);
    }
  };

  const handleSaveGift = async () => {
    if (!newGiftName.trim()) return;

    try {
      if (editingGift) {
        await fetch(`/api/list/${id}/gifts/${editingGift.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            name: newGiftName, 
            description: newGiftDesc, 
            url: newGiftUrl,
            password: ownerPassword 
          }),
        });
      } else {
        await fetch(`/api/list/${id}/gifts`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            name: newGiftName, 
            description: newGiftDesc, 
            url: newGiftUrl,
            password: ownerPassword 
          }),
        });
      }
      setShowGiftModal(false);
      resetGiftForm();
      fetchListData();
    } catch (err) {
      console.error('Failed to save gift', err);
    }
  };

  const resetGiftForm = () => {
    setEditingGift(null);
    setNewGiftName('');
    setNewGiftDesc('');
    setNewGiftUrl('');
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;
  }

  if (!list) {
    return <Typography variant="h5" align="center" mt={10}>List not found. 😢</Typography>;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h3" component="h2" gutterBottom>
            {list.name}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Share this link with friends and family!
          </Typography>
        </Box>
        
        {isOwner ? (
          <Button 
            startIcon={<Plus />} 
            variant="contained" 
            color="primary"
            onClick={() => setShowGiftModal(true)}
          >
            Add Gift
          </Button>
        ) : (
          <IconButton 
            onClick={() => setShowLogin(true)} 
            color="primary"
            title="Owner Login"
          >
            <Lock size={20} />
          </IconButton>
        )}
      </Box>

      {gifts.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8, bgcolor: 'background.paper', borderRadius: 4 }}>
          <GiftIcon size={48} color="#F8C89C" style={{ marginBottom: 16 }} />
          <Typography variant="h6" color="text.secondary">
            No gifts added yet.
          </Typography>
        </Box>
      ) : (
        <Box>
          <AnimatePresence mode="popLayout">
            {gifts.filter(g => g.status !== 'bought').map(gift => (
              <motion.div
                key={gift.id}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
              >
                <GiftRow 
                  gift={gift} 
                  isOwner={isOwner}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDeleteGift}
                  onEdit={(g) => { setEditingGift(g); setNewGiftName(g.name); setNewGiftDesc(g.description||''); setNewGiftUrl(g.url||''); setShowGiftModal(true); }}
                />
              </motion.div>
            ))}
          </AnimatePresence>

          {gifts.some(g => g.status === 'bought') && (
            <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
              <Divider sx={{ my: 4, '&::before, &::after': { borderColor: 'rgba(74, 59, 50, 0.1)' } }}>
                <Typography variant="body2" color="text.secondary" sx={{ px: 2, fontWeight: 600 }}>
                  Already Bought
                </Typography>
              </Divider>

              <AnimatePresence mode="popLayout">
                {gifts.filter(g => g.status === 'bought').map(gift => (
                  <motion.div
                    key={gift.id}
                    layout 
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                  >
                    <GiftRow 
                      gift={gift} 
                      isOwner={isOwner}
                      onStatusChange={handleStatusChange}
                      onDelete={handleDeleteGift}
                      onEdit={(g) => { setEditingGift(g); setNewGiftName(g.name); setNewGiftDesc(g.description||''); setNewGiftUrl(g.url||''); setShowGiftModal(true); }}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </Box>
      )}

      {/* Login Modal */}
      <Dialog open={showLogin} onClose={() => setShowLogin(false)}>
        <DialogTitle>Owner Access</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Enter the password you created when making this list to add, edit, or delete items.
          </Typography>
          <TextField
            autoFocus
            label="Password"
            type="password"
            fullWidth
            variant="outlined"
            value={ownerPassword}
            onChange={(e) => setOwnerPassword(e.target.value)}
            error={!!loginError}
            helperText={loginError}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setShowLogin(false)} color="inherit">Cancel</Button>
          <Button onClick={handleOwnerLogin} variant="contained" color="primary">Unlock</Button>
        </DialogActions>
      </Dialog>

      {/* Add Gift Modal */}
      <Dialog open={showGiftModal} onClose={() => { setShowGiftModal(false); resetGiftForm(); }} maxWidth="sm" fullWidth>
        <DialogTitle>{editingGift ? 'Edit Gift' : 'Add a New Gift'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField
            autoFocus
            label="Gift Name"
            placeholder="e.g. Nintendo Switch"
            fullWidth
            required
            value={newGiftName}
            onChange={(e) => setNewGiftName(e.target.value)}
          />
          <TextField
            label="Description (Optional)"
            placeholder="e.g. The OLED version in white if possible!"
            fullWidth
            multiline
            rows={2}
            value={newGiftDesc}
            onChange={(e) => setNewGiftDesc(e.target.value)}
          />
          <TextField
            label="Link / URL (Optional)"
            placeholder="https://..."
            fullWidth
            type="url"
            value={newGiftUrl}
            onChange={(e) => setNewGiftUrl(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => { setShowGiftModal(false); resetGiftForm(); }} color="inherit">Cancel</Button>
          <Button onClick={handleSaveGift} variant="contained" color="primary" disabled={!newGiftName.trim()}>
            {editingGift ? 'Save Changes' : 'Add Gift'}
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
}
