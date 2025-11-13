import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, Calendar, Film, BookmarkPlus, Check } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../utils/api';
import { toast } from 'react-toastify';

const MovieCard = ({ movie, showDetailsButton = true, showWatchlistButton = true }) => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  
  // Ensure we have a valid ID - convert to string for URL
  const movieId = movie._id || movie.id;
  if (!movieId) {
    console.warn("MovieCard: Movie without ID", movie);
    return null;
  }
  
  // Convert to string for URL (handle both number and string)
  const movieIdString = String(movieId);

  useEffect(() => {
    let timeoutId;
    if (justAdded) {
      timeoutId = setTimeout(() => setJustAdded(false), 2500);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [justAdded]);

  const numericRating = typeof movie.rating === 'number'
    ? movie.rating
    : typeof movie.rating === 'string'
      ? parseFloat(movie.rating)
      : Number.NaN;

  const displayRating = Number.isFinite(numericRating)
    ? numericRating.toFixed(1)
    : 'N/A';

  const releaseYear =
    typeof movie.releaseYear === 'number'
      ? movie.releaseYear
      : typeof movie.releaseYear === 'string'
        ? movie.releaseYear
        : 'N/A';

  return (
    <div
      className={`group relative overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
        isDark ? 'bg-slate-800' : 'bg-white'
      }`}
    >
      {/* Poster */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={movie.posterUrl || 'https://via.placeholder.com/300x450?text=No+Poster'}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x450?text=No+Poster';
          }}
        />
        {/* Rating Badge */}
        <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/70 text-white px-2 py-1 rounded-full text-sm font-semibold">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          {displayRating}
        </div>
        {showWatchlistButton && (
          <button
            onClick={async (event) => {
              event.stopPropagation();
              if (isSaving) return;
              if (!user?.email) {
                toast.error('Please login to save movies to your watchlist');
                navigate('/login');
                return;
              }
              try {
                setIsSaving(true);
                const response = await api.addToWatchlist(movieIdString, user.email);
                if (response?.alreadyExists) {
                  toast.info('Movie is already in your watchlist');
                } else {
                  toast.success('Added to watchlist');
                }
                setJustAdded(true);
              } catch (error) {
                console.error('Error adding to watchlist:', error);
                toast.error(error.message || 'Failed to add to watchlist');
              } finally {
                setIsSaving(false);
              }
            }}
            disabled={isSaving}
            className={`absolute top-2 left-2 flex items-center justify-center rounded-full p-2 transition-all shadow-lg backdrop-blur-sm border ${
              isDark
                ? 'bg-slate-900/80 hover:bg-slate-800 text-white border-slate-700'
                : 'bg-white/90 hover:bg-white text-blue-600 border-gray-200'
            } disabled:opacity-60 disabled:cursor-not-allowed`}
            title="Add to watchlist"
            aria-label="Add to watchlist"
          >
            {isSaving ? (
              <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : justAdded ? (
              <Check className="w-4 h-4" />
            ) : (
              <BookmarkPlus className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      {/* Content */}
      <div className={`p-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        <h3 className="font-bold text-lg mb-3 line-clamp-2 min-h-[3.5rem]">
          {movie.title}
        </h3>
        
        {/* Rating - Prominent Display */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className={`font-semibold ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>
              {displayRating}
            </span>
          </div>
        </div>
        
        {/* Genre and Year */}
        <div className="flex flex-wrap gap-2 mb-4 text-sm">
          <span
            className={`px-2 py-1 rounded-full flex items-center gap-1 ${
              isDark ? 'bg-slate-700 text-gray-300' : 'bg-gray-200 text-gray-700'
            }`}
          >
            <Film className="w-3 h-3" />
            {movie.genre || 'N/A'}
          </span>
          <span
            className={`px-2 py-1 rounded-full flex items-center gap-1 ${
              isDark ? 'bg-slate-700 text-gray-300' : 'bg-gray-200 text-gray-700'
            }`}
          >
            <Calendar className="w-3 h-3" />
            {releaseYear || 'N/A'}
          </span>
        </div>

        {showDetailsButton && (
          <Link
            to={`/movies/${movieIdString}`}
            className={`block w-full text-center py-2.5 rounded-lg font-medium transition-all hover:scale-105 ${
              isDark
                ? 'bg-slate-700 hover:bg-slate-600 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            View Details
          </Link>
        )}
      </div>
    </div>
  );
};

export default MovieCard;

