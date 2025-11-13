import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bookmark, BookmarkMinus, Film, Plus } from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { api } from "../utils/api";
import MovieCard from "../components/MovieCard";
import LoadingSpinner from "../components/LoadingSpinner";

const Watchlist = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { isDark } = useTheme();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);

  const userEmail = useMemo(() => user?.email || "", [user?.email]);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!userEmail) {
      toast.error("Please login to view your watchlist");
      navigate("/login");
      return;
    }

    const fetchWatchlist = async () => {
      try {
        setLoading(true);
        const data = await api.getWatchlist(userEmail);
        setMovies(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching watchlist:", error);
        toast.error(error.message || "Failed to load your watchlist");
      } finally {
        setLoading(false);
      }
    };

    fetchWatchlist();
  }, [authLoading, navigate, userEmail]);

  const handleRemove = async (movie) => {
    if (!movie) return;
    const rawId = movie.displayId || movie._id || movie.id;
    if (!rawId && rawId !== 0) {
      toast.error("Invalid movie identifier");
      return;
    }
    const movieId = String(rawId);

    try {
      setRemovingId(movieId);
      await api.removeFromWatchlist(movieId, userEmail);
      toast.success("Removed from watchlist");
      setMovies((prev) =>
        prev.filter(
          (item) => String(item.displayId || item._id || item.id) !== movieId
        )
      );
    } catch (error) {
      console.error("Error removing from watchlist:", error);
      toast.error(error.message || "Failed to remove from watchlist");
    } finally {
      setRemovingId(null);
    }
  };

  if (authLoading) {
    return <LoadingSpinner fullScreen message="Checking authentication..." />;
  }

  if (!userEmail) {
    return null;
  }

  return (
    <div className={`min-h-screen py-8 ${isDark ? "bg-slate-950" : "bg-gray-50"}`}>
      <div className="container mx-auto px-4">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`p-3 rounded-full ${
                isDark ? "bg-slate-800 text-blue-400" : "bg-blue-100 text-blue-600"
              }`}
            >
              <Bookmark className="w-6 h-6" />
            </div>
            <div>
              <h1
                className={`text-4xl font-bold leading-tight ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                My Watchlist
              </h1>
              <p className={isDark ? "text-gray-400" : "text-gray-600"}>
                Save movies to watch later and keep track of your favorites
              </p>
            </div>
          </div>
          <Link
            to="/all-movies"
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
              isDark
                ? "bg-slate-800 hover:bg-slate-700 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            <Plus className="w-5 h-5" />
            Discover Movies
          </Link>
        </div>

        {loading ? (
          <div className="py-20">
            <LoadingSpinner message="Loading your watchlist..." />
          </div>
        ) : movies.length > 0 ? (
          <>
            <div
              className={`mb-4 px-4 py-3 rounded-lg ${
                isDark ? "bg-slate-900 text-gray-200" : "bg-white text-gray-700 shadow-sm"
              }`}
            >
              You have {movies.length} movie{movies.length !== 1 ? "s" : ""} in your watchlist.
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {movies.map((movie) => {
                const rawId = movie.displayId || movie._id || movie.id;
                if (!rawId && rawId !== 0) {
                  console.warn("Skipping movie without identifier", movie);
                  return null;
                }
                const movieId = String(rawId);
                return (
                  <div key={movieId} className="relative group">
                    <MovieCard movie={movie} showWatchlistButton={false} />
                    <button
                      onClick={() => handleRemove(movie)}
                      disabled={removingId === movieId}
                      className={`absolute top-3 right-3 flex items-center gap-2 px-3 py-2 rounded-lg shadow-lg backdrop-blur-sm border text-sm font-medium transition-all ${
                        isDark
                          ? "bg-slate-900/90 hover:bg-slate-800 text-white border-slate-700"
                          : "bg-white/90 hover:bg-white text-red-600 border-gray-200"
                      } disabled:opacity-60 disabled:cursor-not-allowed`}
                      title="Remove from watchlist"
                    >
                      <BookmarkMinus className="w-4 h-4" />
                      <span>{removingId === movieId ? "Removing..." : "Remove"}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div
            className={`text-center py-16 rounded-3xl border ${
              isDark
                ? "border-slate-800 bg-slate-900/60 text-gray-300"
                : "border-gray-200 bg-white text-gray-600 shadow-md"
            }`}
          >
            <div className="flex flex-col items-center gap-4">
              <div
                className={`w-20 h-20 rounded-full flex items-center justify-center ${
                  isDark ? "bg-slate-800 text-blue-400" : "bg-blue-50 text-blue-600"
                }`}
              >
                <Film className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-semibold">Your watchlist is empty</h2>
              <p className="max-w-md">
                Browse our collection and add movies to your watchlist. They will appear here so you
                can watch them later.
              </p>
              <Link
                to="/all-movies"
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                  isDark
                    ? "bg-slate-800 hover:bg-slate-700 text-white"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                <Plus className="w-5 h-5" />
                Browse Movies
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Watchlist;

