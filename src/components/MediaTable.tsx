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
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
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

  // Get unique directors for the filter dropdown
  const uniqueDirectors = useMemo(() => {
    const directors = media.map(item => item.director).filter(Boolean);
    return [...new Set(directors)].sort();
  }, [media]);

  // Filter media based on search term and filters
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
      {/* Search and Filter Controls */}
      <Paper className="p-4 shadow-lg">
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
              className="text-gray-600"
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
        <Alert severity="info" className="mb-2">
          Showing {displayMedia.length} result{displayMedia.length !== 1 ? 's' : ''} 
          {searchTerm && ` for "${searchTerm}"`}
          {typeFilter !== 'All' && ` • Type: ${typeFilter}`}
          {directorFilter && ` • Director: ${directorFilter}`}
        </Alert>
      ) : null}

      {displayMedia.length === 0 && !loading ? (
        <Paper className="p-8 text-center">
          <Typography variant="h6" color="textSecondary">
            {media.length === 0 
              ? "No media found. Add your first favorite movie or TV show!"
              : "No media matches your search criteria. Try adjusting your filters."}
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper} className="shadow-lg">
          <Table>
            <TableHead className="bg-gradient-to-r from-gray-800 to-gray-600">
              <TableRow>
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
              {displayMedia.map((item) => (
                <TableRow
                  key={item.id}
                  className="hover:bg-gray-50 transition-colors"
                >
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
                    />
                  </TableCell>
                  <TableCell>{item.director}</TableCell>
                  <TableCell>{item.budget}</TableCell>
                  <TableCell>{item.location}</TableCell>
                  <TableCell>{item.duration}</TableCell>
                  <TableCell>{item.yearTime}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <IconButton
                        size="small"
                        onClick={() => onEdit(item)}
                        className="text-blue-600 hover:bg-blue-50"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => onDelete(item.id)}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {(loading || isFetching) && (
        <Box className="flex justify-center py-4">
          <CircularProgress />
          <Typography className="ml-2" variant="body2" color="textSecondary">
            Loading more...
          </Typography>
        </Box>
      )}

      {!hasMore && media.length > 0 && (
        <Box className="text-center py-4">
          <Typography variant="body2" color="textSecondary">
            No more media to load.
          </Typography>
        </Box>
      )}
    </div>
  );
};