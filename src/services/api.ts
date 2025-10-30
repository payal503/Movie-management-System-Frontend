import axios from 'axios';
import { Media, MediaCreate, MediaUpdate, PaginatedResponse } from '../types/media';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const mediaApi = {
    // Get all media with pagination
    getAll: async (page: number = 1, limit: number = 10): Promise<PaginatedResponse<Media>> => {
        const response = await api.get(`/media?page=${page}&limit=${limit}`);
        return response.data;
    },

    // Get media by ID
    getById: async (id: number): Promise<Media> => {
        const response = await api.get(`/media/${id}`);
        return response.data.data;
    },

    // Create new media
    create: async (media: MediaCreate): Promise<Media> => {
        const response = await api.post('/media', media);
        return response.data.data;
    },

    // Update media
    update: async (id: number, media: MediaUpdate): Promise<Media> => {
        const response = await api.put(`/media/${id}`, media);
        return response.data.data;
    },

    // Delete media
    delete: async (id: number): Promise<void> => {
        await api.delete(`/media/${id}`);
    },
};