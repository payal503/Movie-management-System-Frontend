import React, { useState } from 'react';
import {
  Container,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Snackbar,
  Alert,
  Fab,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useMedia } from './hooks/useMedia';
import { MediaForm } from './components/MediaForm';
import { MediaTable } from './components/MediaTable';
import { DeleteConfirmation } from './components/DeleteConfirmation';
import { Media, MediaCreate } from './types/media';

function App() {
  const {
    media,
    loading,
    error,
    pagination,
    loadMedia,
    createMedia,
    updateMedia,
    deleteMedia,
  } = useMedia();

  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingMedia, setEditingMedia] = useState<Media | null>(null);
  const [deletingMedia, setDeletingMedia] = useState<Media | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const showSnackbar = (message: string, severity: 'success' | 'error' = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCreateMedia = async (data: MediaCreate): Promise<boolean> => {
    const success = await createMedia(data);
    if (success) {
      showSnackbar('Media created successfully!');
      return true;
    } else {
      showSnackbar('Failed to create media', 'error');
      return false;
    }
  };

  const handleUpdateMedia = async (data: MediaCreate): Promise<boolean> => {
    if (!editingMedia) return false;
    const success = await updateMedia(editingMedia.id, data);
    if (success) {
      showSnackbar('Media updated successfully!');
      setEditingMedia(null);
      return true;
    } else {
      showSnackbar('Failed to update media', 'error');
      return false;
    }
  };

  const handleDeleteMedia = async () => {
    if (!deletingMedia) return;
    const success = await deleteMedia(deletingMedia.id);
    if (success) {
      showSnackbar('Media deleted successfully!');
    } else {
      showSnackbar('Failed to delete media', 'error');
    }
    setDeleteOpen(false);
    setDeletingMedia(null);
  };

  const handleEdit = (media: Media) => {
    setEditingMedia(media);
    setFormOpen(true);
  };

  const handleDelete = (id: number) => {
    const mediaToDelete = media.find(item => item.id === id);
    if (mediaToDelete) {
      setDeletingMedia(mediaToDelete);
      setDeleteOpen(true);
    }
  };

 const handleLoadMore = () => {
  if (pagination.hasNext && !loading) {
    console.log('⬇️ Loading more media...');
    loadMedia(pagination.currentPage + 1);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <AppBar position="static" className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
        <Toolbar>
          <Typography variant="h4" component="h1" className="flex-1 font-bold">
            🎬 Favorite Media
          </Typography>
          <Button
            color="inherit"
            startIcon={<AddIcon />}
            onClick={() => setFormOpen(true)}
            className="hidden md:flex"
          >
            Add Media
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" className="py-8">
        <Box className="mb-8 text-center">
          <Typography variant="h3" component="h2" className="font-bold text-gray-800 mb-2">
            Your Favorite Movies & TV Shows
          </Typography>
          <Typography variant="h6" className="text-gray-600">
            Manage your personal collection of favorite media
          </Typography>
        </Box>

        <MediaTable
          media={media}
          loading={loading}
          error={error}
          onEdit={handleEdit}
          onDelete={handleDelete}
          hasMore={pagination.hasNext}
          onLoadMore={handleLoadMore}
        />

        <Fab
          color="primary"
          className="fixed bottom-8 right-8 md:hidden bg-gradient-to-r from-blue-600 to-purple-600"
          onClick={() => setFormOpen(true)}
        >
          <AddIcon />
        </Fab>

        <MediaForm
          open={formOpen}
          onClose={() => {
            setFormOpen(false);
            setEditingMedia(null);
          }}
          onSubmit={editingMedia ? handleUpdateMedia : handleCreateMedia}
          editingMedia={editingMedia}
        />

        <DeleteConfirmation
          open={deleteOpen}
          onClose={() => {
            setDeleteOpen(false);
            setDeletingMedia(null);
          }}
          onConfirm={handleDeleteMedia}
          title={deletingMedia?.title || ''}
          loading={loading}
        />

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        >
          <Alert
            onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
            severity={snackbar.severity}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </div>
  );
}

export default App;