import { useState, useEffect } from 'react';
import { Media, MediaCreate, MediaUpdate } from '../types/media';
import { mediaApi } from '../services/api';

export const useMedia = () => {
    const [media, setMedia] = useState<Media[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        hasNext: false,
        hasPrev: false,
    });

    const loadMedia = async (page: number = 1, limit: number = 10) => {
        try {
            setLoading(true);
            setError(null);
            console.log(`📡 Loading media page ${page} with limit ${limit}`);
            const response = await mediaApi.getAll(page, limit);
            console.log('📦 Media data received:', response.data);
            if (page === 1) {
                setMedia(response.data);
            } else {
                setMedia(prev => [...prev, ...response.data]);
            }

            setPagination(response.pagination);
        } catch (err: any) {
            const errorMessage = err.response?.data?.error || err.message || 'Failed to load media';
            setError(errorMessage);
            console.error('❌ Error loading media:', err);
        } finally {
            setLoading(false);
        }
    };

    const createMedia = async (mediaData: MediaCreate): Promise<boolean> => {
        try {
            setError(null);
            const newMedia = await mediaApi.create(mediaData);
            setMedia(prev => [newMedia, ...prev]);
            return true;
        } catch (err) {
            setError('Failed to create media');
            console.error('Error creating media:', err);
            return false;
        }
    };

    const updateMedia = async (id: number, mediaData: MediaUpdate): Promise<boolean> => {
        try {
            setError(null);
            const updatedMedia = await mediaApi.update(id, mediaData);
            setMedia(prev => prev.map(item => item.id === id ? updatedMedia : item));
            return true;
        } catch (err) {
            setError('Failed to update media');
            console.error('Error updating media:', err);
            return false;
        }
    };

    const deleteMedia = async (id: number): Promise<boolean> => {
        try {
            setError(null);
            await mediaApi.delete(id);
            setMedia(prev => prev.filter(item => item.id !== id));
            return true;
        } catch (err) {
            setError('Failed to delete media');
            console.error('Error deleting media:', err);
            return false;
        }
    };

    useEffect(() => {
        loadMedia();
    }, []);

    return {
        media,
        loading,
        error,
        pagination,
        loadMedia,
        createMedia,
        updateMedia,
        deleteMedia,
    };
};