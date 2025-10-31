import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  CircularProgress,
  Alert,
  Box,
  Typography,
  TextField,
  MenuItem,
  Grid,
  InputAdornment,
  Avatar,
  Dialog,
  DialogContent,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  Visibility as ViewIcon,
  Schedule as DurationIcon,
  LocationOn as LocationIcon,
  Person as DirectorIcon,
  AttachMoney as BudgetIcon,
  CalendarToday as YearIcon,
  Theaters as TypeIcon,
} from '@mui/icons-material';
import { Media } from '../types/media';

interface MediaTableProps {
  media: Media[];
  loading: boolean;
  error: string | null;
  onEdit: (media: Media) => void;
  onDelete: (id: number) => void;
  hasMore: boolean;
  onLoadMore: () => void;
}

export const MediaTable: React.FC<MediaTableProps> = ({
  media,
  loading,
  error,
  onEdit,
  onDelete,
  hasMore,
  onLoadMore,
}) => {
  const [isFetching, setIsFetching] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'All' | 'Movie' | 'TV Show'>('All');
  const [directorFilter, setDirectorFilter] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);

  const getImageUrl = (imageUrl: string | undefined): string | undefined => {
    if (!imageUrl) return undefined;
    if (imageUrl.startsWith('http')) return imageUrl;
    return `http://localhost:5000${imageUrl}`;
  };

  const handleImagePreview = (mediaItem: Media) => {
    if (mediaItem.imageUrl) {
      const fullImageUrl = getImageUrl(mediaItem.imageUrl);
      if (fullImageUrl) {
        setImagePreview(fullImageUrl);
        setSelectedMedia(mediaItem);
        setPreviewOpen(true);
      }
    }
  };

  const closeImagePreview = () => {
    setPreviewOpen(false);
    setImagePreview(null);
    setSelectedMedia(null);
  };

  const uniqueDirectors = useMemo(() => {
    const directors = media.map(item => item.director).filter(Boolean);
    return [...new Set(directors)].sort();
  }, [media]);

  const filteredMedia = useMemo(() => {
    return media.filter(item => {
      const matchesSearch = searchTerm === '' || 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.director.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = typeFilter === 'All' || item.type === typeFilter;
      
      const matchesDirector = directorFilter === '' || 
        item.director.toLowerCase().includes(directorFilter.toLowerCase());

      return matchesSearch && matchesType && matchesDirector;
    });
  }, [media, searchTerm, typeFilter, directorFilter]);

  const handleScroll = useCallback(() => {
    if (isFetching || !hasMore) return;

    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = window.innerHeight;

    if (scrollTop + clientHeight >= scrollHeight - 100) {
      setIsFetching(true);
      onLoadMore();
    }
  }, [isFetching, hasMore, onLoadMore]);

  useEffect(() => {
    if (!loading) {
      setIsFetching(false);
    }
  }, [loading]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const clearFilters = () => {
    setSearchTerm('');
    setTypeFilter('All');
    setDirectorFilter('');
  };

  if (error) {
    return (
      <Alert severity="error" className="mb-4">
        {error}
      </Alert>
    );
  }

  const displayMedia = filteredMedia;

  return (
    <div className="space-y-4">
      {/* Image Preview Dialog with Movie Details */}
      <Dialog
        open={previewOpen}
        onClose={closeImagePreview}
        maxWidth="lg"
        fullWidth
        className="rounded-lg"
      >
        <DialogContent className="p-0">
          {selectedMedia && (
            <Card className="w-full">
              <CardContent className="p-0">
                <Grid container>
                  {/* Image Section */}
                  <Grid item xs={12} md={6}>
                    <Box className="p-4 flex justify-center items-center h-full bg-gray-50">
                      {imagePreview && (
                        <img
                          src={imagePreview}
                          alt={selectedMedia.title}
                          className="w-full max-w-md h-auto max-h-[70vh] object-contain rounded-lg shadow-2xl"
                        />
                      )}
                    </Box>
                  </Grid>
                  
                  {/* Details Section */}
                  <Grid item xs={12} md={6}>
                    <Box className="p-6">
                      {/* Title and Type */}
                      <Box className="mb-4">
                        <Typography variant="h4" component="h2" className="font-bold text-gray-900 mb-2">
                          {selectedMedia.title}
                        </Typography>
                        <Chip
                          icon={<TypeIcon />}
                          label={selectedMedia.type}
                          color={selectedMedia.type === 'Movie' ? 'primary' : 'secondary'}
                          className="mb-3"
                        />
                      </Box>

                      <Divider className="my-4" />

                      {/* Description */}
                      {selectedMedia.description && (
                        <Box className="mb-4">
                          <Typography variant="body1" className="text-gray-700 leading-relaxed">
                            {selectedMedia.description}
                          </Typography>
                        </Box>
                      )}

                      {/* Details Grid */}
                      <Grid container spacing={3} className="mb-4">
                        <Grid item xs={6}>
                          <Box className="flex items-center space-x-2">
                            <DirectorIcon className="text-blue-600" />
                            <Box>
                              <Typography variant="caption" className="text-gray-500 block">
                                Director
                              </Typography>
                              <Typography variant="body2" className="font-medium">
                                {selectedMedia.director}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>

                        <Grid item xs={6}>
                          <Box className="flex items-center space-x-2">
                            <BudgetIcon className="text-green-600" />
                            <Box>
                              <Typography variant="caption" className="text-gray-500 block">
                                Budget
                              </Typography>
                              <Typography variant="body2" className="font-medium">
                                {selectedMedia.budget}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>

                        <Grid item xs={6}>
                          <Box className="flex items-center space-x-2">
                            <LocationIcon className="text-red-600" />
                            <Box>
                              <Typography variant="caption" className="text-gray-500 block">
                                Location
                              </Typography>
                              <Typography variant="body2" className="font-medium">
                                {selectedMedia.location}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>

                        <Grid item xs={6}>
                          <Box className="flex items-center space-x-2">
                            <DurationIcon className="text-purple-600" />
                            <Box>
                              <Typography variant="caption" className="text-gray-500 block">
                                Duration
                              </Typography>
                              <Typography variant="body2" className="font-medium">
                                {selectedMedia.duration}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>

                        <Grid item xs={6}>
                          <Box className="flex items-center space-x-2">
                            <YearIcon className="text-orange-600" />
                            <Box>
                              <Typography variant="caption" className="text-gray-500 block">
                                Year/Time
                              </Typography>
                              <Typography variant="body2" className="font-medium">
                                {selectedMedia.year_time}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                      </Grid>

                      {/* Action Buttons */}
                      <Box className="flex space-x-2 pt-4 border-t">
                        <IconButton
                          onClick={() => {
                            closeImagePreview();
                            onEdit(selectedMedia);
                          }}
                          className="text-blue-600 hover:bg-blue-50 transition-all duration-300"
                          title="Edit"
                        >
                          <EditIcon />
                          <Typography variant="body2" className="ml-1">
                            Edit
                          </Typography>
                        </IconButton>
                        <IconButton
                          onClick={() => {
                            closeImagePreview();
                            onDelete(selectedMedia.id);
                          }}
                          className="text-red-600 hover:bg-red-50 transition-all duration-300"
                          title="Delete"
                        >
                          <DeleteIcon />
                          <Typography variant="body2" className="ml-1">
                            Delete
                          </Typography>
                        </IconButton>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          )}
        </DialogContent>
      </Dialog>

      {/* Search and Filter Controls */}
      <Paper className="p-4 shadow-lg transition-all duration-300 hover:shadow-xl">
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search title, description, director..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => setSearchTerm('')}
                      edge="end"
                    >
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              variant="outlined"
              size="small"
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              select
              label="Type"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as 'All' | 'Movie' | 'TV Show')}
              variant="outlined"
              size="small"
            >
              <MenuItem value="All">All Types</MenuItem>
              <MenuItem value="Movie">Movie</MenuItem>
              <MenuItem value="TV Show">TV Show</MenuItem>
            </TextField>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              select
              label="Director"
              value={directorFilter}
              onChange={(e) => setDirectorFilter(e.target.value)}
              variant="outlined"
              size="small"
            >
              <MenuItem value="">All Directors</MenuItem>
              {uniqueDirectors.map((director) => (
                <MenuItem key={director} value={director}>
                  {director}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="body2" color="textSecondary">
              Showing {displayMedia.length} of {media.length}
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6} md={2}>
            <IconButton
              onClick={clearFilters}
              disabled={!searchTerm && typeFilter === 'All' && !directorFilter}
              size="small"
              className="text-gray-600 transition-colors hover:text-gray-800"
            >
              <ClearIcon />
              <Typography variant="body2" className="ml-1">
                Clear Filters
              </Typography>
            </IconButton>
          </Grid>
        </Grid>
      </Paper>

      {/* Results Message */}
      {searchTerm || typeFilter !== 'All' || directorFilter ? (
        <Alert severity="info" className="mb-2 transition-all duration-300">
          Showing {displayMedia.length} result{displayMedia.length !== 1 ? 's' : ''} 
          {searchTerm && ` for "${searchTerm}"`}
          {typeFilter !== 'All' && ` • Type: ${typeFilter}`}
          {directorFilter && ` • Director: ${directorFilter}`}
        </Alert>
      ) : null}

      {displayMedia.length === 0 && !loading ? (
        <Paper className="p-8 text-center transition-all duration-300 hover:shadow-lg">
          <Typography variant="h6" color="textSecondary">
            {media.length === 0 
              ? "No media found. Add your first favorite movie or TV show!"
              : "No media matches your search criteria. Try adjusting your filters."}
          </Typography>
        </Paper>
      ) : (
        <TableContainer 
          component={Paper} 
          className="shadow-lg transition-all duration-300 hover:shadow-2xl"
        >
          <Table>
            <TableHead className="bg-gradient-to-r from-gray-800 to-gray-600">
              <TableRow>
                <TableCell className="text-white font-bold">Poster</TableCell>
                <TableCell className="text-white font-bold">Title</TableCell>
                <TableCell className="text-white font-bold">Type</TableCell>
                <TableCell className="text-white font-bold">Director</TableCell>
                <TableCell className="text-white font-bold">Budget</TableCell>
                <TableCell className="text-white font-bold">Location</TableCell>
                <TableCell className="text-white font-bold">Duration</TableCell>
                <TableCell className="text-white font-bold">Year/Time</TableCell>
                <TableCell className="text-white font-bold">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayMedia.map((item) => {
                const imageUrl = getImageUrl(item.imageUrl);
                const hasImage = !!imageUrl;
                
                return (
                  <TableRow
                    key={item.id}
                    className="transition-all duration-300 hover:shadow-lg hover:bg-gray-50 hover:scale-[1.02] hover:z-10 relative"
                    sx={{
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                      },
                    }}
                  >
                    <TableCell>
                      <Box className="flex items-center space-x-2">
                        <Avatar
                          src={imageUrl}
                          variant="rounded"
                          sx={{ 
                            width: "100%", 
                            height: "80px", 
                            border: '2px solid #e0e0e0',
                            objectFit: 'cover',
                            cursor: hasImage ? 'pointer' : 'default',
                            transition: 'all 0.3s ease',
                            '&:hover': hasImage ? {
                              transform: 'scale(1.1)',
                              boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
                            } : {},
                          }}
                          onClick={() => hasImage && handleImagePreview(item)}
                          imgProps={{
                            onError: (e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }
                          }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <div>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {item.title}
                        </Typography>
                        {item.description && (
                          <Typography variant="caption" color="textSecondary">
                            {item.description.length > 50
                              ? `${item.description.substring(0, 50)}...`
                              : item.description}
                          </Typography>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={item.type}
                        color={item.type === 'Movie' ? 'primary' : 'secondary'}
                        size="small"
                        className="transition-all duration-300 hover:shadow-md"
                      />
                    </TableCell>
                    <TableCell>{item.director}</TableCell>
                    <TableCell>{item.budget}</TableCell>
                    <TableCell>{item.location}</TableCell>
                    <TableCell>{item.duration}</TableCell>
                    <TableCell>{item.year_time}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <IconButton
                          size="small"
                          onClick={() => onEdit(item)}
                          className="text-blue-600 hover:bg-blue-50 transition-all duration-300 hover:scale-110"
                          title="Edit"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => onDelete(item.id)}
                          className="text-red-600 hover:bg-red-50 transition-all duration-300 hover:scale-110"
                          title="Delete"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {(loading || isFetching) && (
        <Box className="flex justify-center py-4 transition-all duration-300">
          <CircularProgress />
          <Typography className="ml-2" variant="body2" color="textSecondary">
            Loading more...
          </Typography>
        </Box>
      )}

      {!hasMore && media.length > 0 && (
        <Box className="text-center py-4 transition-all duration-300">
          <Typography variant="body2" color="textSecondary">
            No more media to load.
          </Typography>
        </Box>
      )}
    </div>
  );
};