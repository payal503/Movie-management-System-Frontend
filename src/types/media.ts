export interface Media {
  id: number;
  title: string;
  type: 'Movie' | 'TV Show';
  director: string;
  budget: string;
  location: string;
  duration: string;
  yearTime: string;
  description?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MediaCreate {
  title: string;
  type: 'Movie' | 'TV Show';
  director: string;
  budget: string;
  location: string;
  duration: string;
  yearTime: string;
  description?: string;
  imageFile?: File; 
}

export interface MediaUpdate extends Partial<Omit<MediaCreate, 'imageFile'>> {
  imageFile?: File; 
}
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}