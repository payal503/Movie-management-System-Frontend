import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Alert,
} from '@mui/material';
import { Warning as WarningIcon } from '@mui/icons-material';

interface DeleteConfirmationProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  loading?: boolean;
}

export const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  loading = false,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle className="flex items-center space-x-2 text-red-600">
        <WarningIcon />
        <span>Confirm Delete</span>
      </DialogTitle>
      <DialogContent>
        {/* <Alert severity="warning" className="mb-4">
          This action cannot be undone.
        </Alert> */}
        <Typography>
          Are you sure you want to delete <strong>"{title}"</strong>?
        </Typography>
      </DialogContent>
      <DialogActions className="p-4">
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="error"
          disabled={loading}
        >
          {loading ? 'Deleting...' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};