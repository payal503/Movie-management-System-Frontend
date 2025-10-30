import React from 'react';
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
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Media, MediaCreate } from '../types/media';

const mediaSchema = yup.object({
    title: yup.string().required('Title is required'),
    type: yup.string().oneOf(['Movie', 'TV Show']).required('Type is required'),
    director: yup.string().required('Director is required'),
    budget: yup.string().required('Budget is required'),
    location: yup.string().required('Location is required'),
    duration: yup.string().required('Duration is required'),
    yearTime: yup.string().required('Year/Time is required'),
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
            yearTime: '',
            description: '',
        },
    });

    React.useEffect(() => {
        if (editingMedia) {
            reset(editingMedia);
        } else {
            reset({
                title: '',
                type: 'Movie',
                director: '',
                budget: '',
                location: '',
                duration: '',
                yearTime: '',
                description: '',
            });
        }
    }, [editingMedia, reset, open]);

    const handleFormSubmit = async (data: MediaCreate) => {
        const success = await onSubmit(data);
        if (success) {
            onClose();
            reset();
        }
    };

    const handleCancel = () => {
        onClose();
        reset();
    };

    return (
        <Dialog open={open} onClose={handleCancel} maxWidth="md" fullWidth>
            <DialogTitle className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                {editingMedia ? 'Edit Media' : 'Add New Media'}
            </DialogTitle>
            <form onSubmit={handleSubmit(handleFormSubmit)}>
                <DialogContent>
                    {/* Use Material-UI Grid for proper spacing */}
                    <Box sx={{ pt: 1}}>
                        <Grid container spacing={3}>
                            {/* Title */}
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

                            {/* Type */}
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

                            {/* Director */}
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

                            {/* Budget */}
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

                            {/* Location */}
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

                            {/* Duration */}
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

                            {/* Year/Time */}
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Year/Time"
                                    fullWidth
                                    variant="outlined"
                                    {...register('yearTime')}
                                    error={!!errors.yearTime}
                                    helperText={errors.yearTime?.message}
                                    placeholder="e.g., 2010 or 2008-2013"
                                />
                            </Grid>

                            {/* Description - Full width */}
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