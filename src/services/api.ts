import axios from 'axios';
import { Media, MediaCreate, MediaUpdate, PaginatedResponse } from '../types/media';

const API_BASE_URL = 'http://localhost:5000/api';

export const mediaApi = {
    getAll: async (page: number = 1, limit: number = 10): Promise<PaginatedResponse<Media>> => {
        const response = await axios.get(`${API_BASE_URL}/media?page=${page}&limit=${limit}`);
        return response.data;
    },

    getById: async (id: number): Promise<Media> => {
        const response = await axios.get(`${API_BASE_URL}/media/${id}`);
        return response.data.data;
    },

    create: async (media: MediaCreate): Promise<Media> => {
        console.log("media ", media);

        const formData = new FormData();
        formData.append('title', media.title);
        formData.append('type', media.type);
        formData.append('director', media.director);
        formData.append('budget', media.budget);
        formData.append('location', media.location);
        formData.append('duration', media.duration);
        formData.append('year_time', media.year_time);
        if (media.description) formData.append('description', media.description);

        if (media.imageFile) {
            formData.append('poster', media.imageFile);
        }

        const response = await axios.post(`${API_BASE_URL}/media`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data.data;
    },

    update: async (id: number, media: MediaUpdate): Promise<Media> => {
        const formData = new FormData();
        if (media.title) formData.append('title', media.title);
        if (media.type) formData.append('type', media.type);
        if (media.director) formData.append('director', media.director);
        if (media.budget) formData.append('budget', media.budget);
        if (media.location) formData.append('location', media.location);
        if (media.duration) formData.append('duration', media.duration);
        if (media.year_time) formData.append('year_time', media.year_time);
        if (media.description) formData.append('description', media.description);

        if (media.imageFile) {
            formData.append('poster', media.imageFile);
        }

        const response = await axios.put(`${API_BASE_URL}/media/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data.data;
    },

    delete: async (id: number): Promise<void> => {
        await axios.delete(`${API_BASE_URL}/media/${id}`);
    },
};