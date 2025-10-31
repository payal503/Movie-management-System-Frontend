import React, { useState, useRef } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    MenuItem,
    Box,
    Grid,
    Avatar,
    IconButton,
    Typography,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Media, MediaCreate } from '../types/media';
import { AddPhotoAlternate as AddPhotoIcon, Delete as DeleteIcon } from '@mui/icons-material';

const mediaSchema = yup.object({
    title: yup.string().required('Title is required'),
    type: yup.string().oneOf(['Movie', 'TV Show']).required('Type is required'),
    director: yup.string().required('Director is required'),
    budget: yup.string().required('Budget is required'),
    location: yup.string().required('Location is required'),
    duration: yup.string().required('Duration is required'),
    year_time: yup.string().required('Year/Time is required'),
    description: yup.string().optional(),
});

interface MediaFormProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: MediaCreate) => Promise<boolean>;
    editingMedia?: Media | null;
}

export const MediaForm: React.FC<MediaFormProps> = ({
    open,
    onClose,
    onSubmit,
    editingMedia,
}) => {
    const [posterPreview, setPosterPreview] = useState<string | null>(null);
    const [posterFile, setPosterFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<MediaCreate>({
        resolver: yupResolver(mediaSchema),
        defaultValues: editingMedia || {
            title: '',
            type: 'Movie',
            director: '',
            budget: '',
            location: '',
            duration: '',
            year_time: '',
            description: '',
        },
    });

    React.useEffect(() => {
        if (editingMedia) {
            reset(editingMedia);
            if (editingMedia.imageUrl) {
                setPosterPreview(editingMedia.imageUrl);
            } else {
                setPosterPreview(null);
            }
        } else {
            reset({
                title: '',
                type: 'Movie',
                director: '',
                budget: '',
                location: '',
                duration: '',
                year_time: '',
                description: '',
            });
            setPosterPreview(null);
            setPosterFile(null);
        }
    }, [editingMedia, reset, open]);

    const handlePosterUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setPosterFile(file);
            const previewUrl = URL.createObjectURL(file);
            setPosterPreview(previewUrl);
        }
    };

    const handleRemovePoster = () => {
        setPosterPreview(null);
        setPosterFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleFormSubmit = async (data: MediaCreate) => {
        const submitData: MediaCreate = {
            ...data,
            imageFile: posterFile || undefined,
        };

        const success = await onSubmit(submitData);
        if (success) {
            onClose();
            reset();
            setPosterPreview(null);
            setPosterFile(null);
        }
    };

    const handleCancel = () => {
        onClose();
        reset();
        setPosterPreview(null);
        setPosterFile(null);
    };

    const triggerFileInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const hasExistingImage = editingMedia?.imageUrl && !posterFile;
    const showCurrentPoster = posterPreview || editingMedia?.imageUrl;

    console.log("showCurrentPoster -- ", showCurrentPoster);


    return (
        <Dialog open={open} onClose={handleCancel} maxWidth="md" fullWidth>
            <DialogTitle className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                {editingMedia ? 'Edit Media' : 'Add New Media'}
            </DialogTitle>
            <form onSubmit={handleSubmit(handleFormSubmit)}>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        <Grid container spacing={3} sx={{ mb: 3 }}>
                            <Grid item xs={12}>
                                <Typography variant="h6" gutterBottom>
                                    Movie Poster
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                                        {showCurrentPoster ? (
                                            <Box sx={{ position: 'relative' }}>
                                                <Avatar
                                                    src={`http://localhost:5000${showCurrentPoster}`}
                                                    variant="rounded"
                                                    sx={{
                                                        width: 120,
                                                        height: 160,
                                                        border: '2px solid #e0e0e0',
                                                    }}
                                                />
                                                <IconButton
                                                    size="small"
                                                    onClick={handleRemovePoster}
                                                    sx={{
                                                        position: 'absolute',
                                                        top: -8,
                                                        right: -8,
                                                        backgroundColor: 'error.main',
                                                        color: 'white',
                                                        '&:hover': {
                                                            backgroundColor: 'error.dark',
                                                        },
                                                    }}
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        ) : (
                                            <Avatar
                                                variant="rounded"
                                                sx={{
                                                    width: 120,
                                                    height: 160,
                                                    bgcolor: 'grey.200',
                                                }}
                                            >
                                                <AddPhotoIcon sx={{ fontSize: 40, color: 'grey.400' }} />
                                            </Avatar>
                                        )}
                                        <Typography variant="caption" color="textSecondary">
                                            {showCurrentPoster ? 'Current Poster' : 'No Poster'}
                                        </Typography>
                                    </Box>

                                    <Box>
                                        <input
                                            accept="image/*"
                                            style={{ display: 'none' }}
                                            id="poster-upload"
                                            type="file"
                                            onChange={handlePosterUpload}
                                            ref={fileInputRef}
                                        />
                                        <Button
                                            variant="outlined"
                                            component="span"
                                            startIcon={<AddPhotoIcon />}
                                            onClick={triggerFileInput}
                                        >
                                            {showCurrentPoster ? 'Change Poster' : 'Upload Poster'}
                                        </Button>
                                        <Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.secondary' }}>
                                            {hasExistingImage && !posterPreview
                                                ? 'Current poster will be kept'
                                                : 'Select a poster image'
                                            }
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>

                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Title"
                                    fullWidth
                                    variant="outlined"
                                    {...register('title')}
                                    error={!!errors.title}
                                    helperText={errors.title?.message}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Type"
                                    select
                                    fullWidth
                                    variant="outlined"
                                    {...register('type')}
                                    error={!!errors.type}
                                    helperText={errors.type?.message}
                                >
                                    <MenuItem value="Movie">Movie</MenuItem>
                                    <MenuItem value="TV Show">TV Show</MenuItem>
                                </TextField>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Director"
                                    fullWidth
                                    variant="outlined"
                                    {...register('director')}
                                    error={!!errors.director}
                                    helperText={errors.director?.message}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Budget"
                                    fullWidth
                                    variant="outlined"
                                    {...register('budget')}
                                    error={!!errors.budget}
                                    helperText={errors.budget?.message}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Location"
                                    fullWidth
                                    variant="outlined"
                                    {...register('location')}
                                    error={!!errors.location}
                                    helperText={errors.location?.message}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Duration"
                                    fullWidth
                                    variant="outlined"
                                    {...register('duration')}
                                    error={!!errors.duration}
                                    helperText={errors.duration?.message}
                                    placeholder="e.g., 120 min or 45 min/ep"
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Year/Time"
                                    fullWidth
                                    variant="outlined"
                                    {...register('year_time')}
                                    error={!!errors.year_time}
                                    helperText={errors.year_time?.message}
                                    placeholder="e.g., 2010 or 2008-2013"
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    label="Description"
                                    fullWidth
                                    multiline
                                    rows={3}
                                    variant="outlined"
                                    {...register('description')}
                                    error={!!errors.description}
                                    helperText={errors.description?.message}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ pr: 3, pl: 3, pb: 2 }} >
                    <Button onClick={handleCancel} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={isSubmitting}
                        sx={{
                            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                            '&:hover': {
                                background: 'linear-gradient(45deg, #1976D2 30%, #00ACC1 90%)',
                            },
                        }}
                    >
                        {isSubmitting ? 'Saving...' : (editingMedia ? 'Update' : 'Create')}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};