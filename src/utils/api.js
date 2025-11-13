// API utility for backend communication
const API_BASE_URL = 'http://localhost:5000';

// Get auth header with user email
const getAuthHeaders = (userEmail) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  if (userEmail) {
    headers['x-user-email'] = userEmail;
  }
  return headers;
};

// API functions
export const api = {
  // Home page APIs
  getStats: async () => {
    const response = await fetch(`${API_BASE_URL}/home/stats`);
    if (!response.ok) throw new Error('Failed to fetch stats');
    return response.json();
  },

  getTopRated: async () => {
    const response = await fetch(`${API_BASE_URL}/home/top-rated`);
    if (!response.ok) throw new Error('Failed to fetch top rated movies');
    return response.json();
  },

  getRecent: async () => {
    const response = await fetch(`${API_BASE_URL}/home/recent`);
    if (!response.ok) throw new Error('Failed to fetch recent movies');
    return response.json();
  },

  getFeatured: async () => {
    const response = await fetch(`${API_BASE_URL}/home/featured`);
    if (!response.ok) throw new Error('Failed to fetch featured movies');
    return response.json();
  },

  // Movies APIs
  getMovies: async (filters = {}) => {
    const { genre, search, sortBy } = filters;
    const params = new URLSearchParams();
    if (genre) params.append('genre', genre);
    if (search) params.append('search', search);
    if (sortBy) params.append('sortBy', sortBy);
    
    const url = `${API_BASE_URL}/movies${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch movies');
    return response.json();
  },

  getMovie: async (id) => {
    if (!id) {
      throw new Error('Movie ID is required');
    }
    const response = await fetch(`${API_BASE_URL}/movies/${id}`);
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to fetch movie' }));
      throw new Error(error.message || `Failed to fetch movie (${response.status})`);
    }
    return response.json();
  },

  addMovie: async (movieData, userEmail) => {
    const response = await fetch(`${API_BASE_URL}/movies/add`, {
      method: 'POST',
      headers: getAuthHeaders(userEmail),
      body: JSON.stringify(movieData),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to add movie');
    }
    return response.json();
  },

  updateMovie: async (id, movieData, userEmail) => {
    const response = await fetch(`${API_BASE_URL}/movies/update/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(userEmail),
      body: JSON.stringify(movieData),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update movie');
    }
    return response.json();
  },

  deleteMovie: async (id, userEmail) => {
    const response = await fetch(`${API_BASE_URL}/movies/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(userEmail),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete movie');
    }
    return response.json();
  },

  getMyCollection: async (userEmail) => {
    if (!userEmail) {
      throw new Error('User email is required');
    }
    const response = await fetch(`${API_BASE_URL}/movies/my-collection`, {
      headers: getAuthHeaders(userEmail),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to fetch my collection' }));
      throw new Error(error.message || `Failed to fetch my collection (${response.status})`);
    }
    return response.json();
  },

  getWatchlist: async (userEmail) => {
    if (!userEmail) {
      throw new Error('User email is required');
    }
    const response = await fetch(`${API_BASE_URL}/watchlist`, {
      headers: getAuthHeaders(userEmail),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to fetch watchlist' }));
      throw new Error(error.message || `Failed to fetch watchlist (${response.status})`);
    }
    return response.json();
  },

  addToWatchlist: async (movieId, userEmail) => {
    if (!movieId) {
      throw new Error('Movie ID is required');
    }
    const response = await fetch(`${API_BASE_URL}/watchlist/${movieId}`, {
      method: 'POST',
      headers: getAuthHeaders(userEmail),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to add to watchlist' }));
      throw new Error(error.message || `Failed to add to watchlist (${response.status})`);
    }
    return response.json();
  },

  removeFromWatchlist: async (movieId, userEmail) => {
    if (!movieId) {
      throw new Error('Movie ID is required');
    }
    const response = await fetch(`${API_BASE_URL}/watchlist/${movieId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(userEmail),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to remove from watchlist' }));
      throw new Error(error.message || `Failed to remove from watchlist (${response.status})`);
    }
    return response.json();
  },

  isMovieInWatchlist: async (movieId, userEmail) => {
    if (!movieId) {
      throw new Error('Movie ID is required');
    }
    if (!userEmail) {
      throw new Error('User email is required');
    }
    const response = await fetch(`${API_BASE_URL}/watchlist/status/${movieId}`, {
      headers: getAuthHeaders(userEmail),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to check watchlist status' }));
      throw new Error(error.message || `Failed to check watchlist status (${response.status})`);
    }
    return response.json();
  },

  // User management APIs
  createOrUpdateUser: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/users/create-or-update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to save user' }));
      throw new Error(error.message || 'Failed to save user');
    }
    return response.json();
  },

  checkUserExists: async (email) => {
    const response = await fetch(`${API_BASE_URL}/users/check/${encodeURIComponent(email)}`);
    if (!response.ok) {
      return false;
    }
    const data = await response.json();
    return data.exists || false;
  },
};

