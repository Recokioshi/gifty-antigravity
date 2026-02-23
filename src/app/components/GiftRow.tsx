import { Box, Typography, Button, Paper, Link as MuiLink, IconButton } from '@mui/material';
import { ExternalLink, Edit2, Trash2, Gift as GiftIcon } from 'lucide-react';
import type { Gift } from '@/lib/db';

interface GiftRowProps {
  gift: Gift;
  isOwner: boolean;
  onStatusChange: (id: string, status: string) => void;
  onDelete?: (id: string) => void;
  onEdit?: (gift: Gift) => void;
}

export default function GiftRow({ gift, isOwner, onStatusChange, onDelete, onEdit }: GiftRowProps) {
  
  const getStatusColor = () => {
    switch (gift.status) {
      case 'reserved': return 'info.main';
      case 'bought': return 'success.main';
      default: return 'text.secondary';
    }
  };

  const getStatusLabel = () => {
    switch (gift.status) {
      case 'reserved': return 'Reserved (Willing to buy)';
      case 'bought': return 'Already Bought!';
      default: return 'Available';
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        mb: 2,
        borderRadius: 4, // friendly rounding
        backgroundColor: '#FFFFFF',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0px 8px 24px rgba(244, 162, 97, 0.12)',
        },
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'flex-start', sm: 'center' },
        gap: 2,
        opacity: gift.status === 'bought' ? 0.7 : 1,
      }}
    >
      {/* Icon Placeholder */}
      <Box 
        sx={{ 
          bgcolor: 'secondary.light', 
          p: 1.5, 
          borderRadius: '50%', 
          color: 'secondary.dark',
          display: 'flex'
        }}
      >
        <GiftIcon size={24} />
      </Box>

      {/* Content */}
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="h6" component="h3" sx={{ fontWeight: 700, mb: 0.5 }}>
          {gift.name}
        </Typography>
        
        {gift.description && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {gift.description}
          </Typography>
        )}

        {gift.url && (
          <MuiLink 
            href={gift.url} 
            target="_blank" 
            rel="noopener noreferrer"
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 0.5,
              typography: 'body2',
              fontWeight: 600,
              width: 'fit-content'
            }}
          >
            <ExternalLink size={14} /> View Item
          </MuiLink>
        )}
      </Box>

      {/* Actions */}
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: { xs: 'stretch', sm: 'flex-end' },
          gap: 1,
          width: { xs: '100%', sm: 'auto' }
        }}
      >
        <Typography 
          variant="caption" 
          sx={{ 
            fontWeight: 800, 
            textTransform: 'uppercase', 
            color: getStatusColor(),
            letterSpacing: '0.05em'
          }}
        >
          {getStatusLabel()}
        </Typography>

        <Box sx={{ display: 'flex', gap: 1 }}>
          {gift.status === 'available' && !isOwner && (
             <Button 
               variant="outlined" 
               size="small"
               color="info"
               onClick={() => onStatusChange(gift.id, 'reserved')}
             >
               Reserve
             </Button>
          )}

          {(gift.status === 'available' || gift.status === 'reserved') && !isOwner && (
            <Button 
              variant="contained" 
              size="small"
              color="success"
              onClick={() => onStatusChange(gift.id, 'bought')}
            >
              Mark Bought
            </Button>
          )}

          {isOwner && (
            <>
              {gift.status !== 'available' && (
                <Button 
                  variant="outlined" 
                  size="small"
                  color="warning"
                  onClick={() => onStatusChange(gift.id, 'available')}
                >
                  Reset Status
                </Button>
              )}
              {onEdit && (
                <IconButton onClick={() => onEdit(gift)} size="small" color="primary">
                  <Edit2 size={18} />
                </IconButton>
              )}
              {onDelete && (
                <IconButton onClick={() => onDelete(gift.id)} size="small" color="error">
                  <Trash2 size={18} />
                </IconButton>
              )}
            </>
          )}
        </Box>
      </Box>
    </Paper>
  );
}
