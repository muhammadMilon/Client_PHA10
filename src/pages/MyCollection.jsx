import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../utils/api";
import MovieCard from "../components/MovieCard";
import DeleteModal from "../components/DeleteModal";
import LoadingSpinner from "../components/LoadingSpinner";
import { Film, Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

const MyCollection = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { user, loading: authLoading } = useAuth();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, movie: null });

  useEffect(() => {
    // Wait for auth to finish loading
    if (authLoading) {
      return;
    }

    // Check if user is logged in after auth loading is complete
    if (!user) {
      toast.error("Please login to view your collection");
      navigate("/login");
      return;
    }

    const fetchMovies = async () => {
      try {
        setLoading(true);
        if (!user?.email) {
          toast.error("User email not found. Please login again.");
          navigate("/login");
          return;
        }
        const data = await api.getMyCollection(user.email);
        console.log("My Collection data:", data);

        const userEmailLower = user.email.toLowerCase();

        const normalizedMovies = (Array.isArray(data) ? data : [])
          .map((movie) => {
            if (!movie) return null;

            const rawId = movie.id ?? movie._id;
            if (rawId === undefined || rawId === null) {
              console.warn("Skipping movie without identifier:", movie);
              return null;
            }

            const asNumber = Number(rawId);
            const hasValidNumber = Number.isFinite(asNumber) && asNumber > 0;
            const trimmedId = typeof rawId === "string" ? rawId.trim() : String(rawId).trim();
            const normalizedId = hasValidNumber ? asNumber : trimmedId;
            if ((!normalizedId && normalizedId !== 0) || trimmedId === "") {
              console.warn("Skipping movie with invalid identifier value:", movie);
              return null;
            }

            const ownerNormalized =
              typeof movie.addedBy === "string"
                ? movie.addedBy.trim().toLowerCase()
                : "";

            return {
              ...movie,
              _id: normalizedId,
              id: normalizedId,
              displayId: hasValidNumber ? String(asNumber) : trimmedId,
              ownerNormalized,
            };
          })
          .filter((movie) => {
            if (!movie) return false;
            if (!movie._id) {
              console.warn("Filtered movie without _id:", movie);
              return false;
            }

            // Only keep movies that belong to the logged-in user.
            return movie.ownerNormalized === userEmailLower;
          });

        console.log("Normalized movies:", normalizedMovies);
        setMovies(normalizedMovies);
      } catch (error) {
        console.error("Error fetching my collection:", error);
        const errorMessage = error.message || "Failed to load your collection";
        console.error("Error details:", errorMessage);
        toast.error(errorMessage);
        // If it's an auth error, redirect to login
        if (errorMessage.includes("Unauthorized") || errorMessage.includes("401")) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [user, authLoading, navigate]);

  const handleDelete = async () => {
    if (!deleteModal.movie) return;

    try {
      const movieId = deleteModal.movie._id || deleteModal.movie.id;
      if (!movieId) {
        toast.error("Invalid movie ID");
        return;
      }
      const movieIdString = String(deleteModal.movie.displayId || movieId);
      await api.deleteMovie(movieIdString, user?.email);
      toast.success("Movie deleted successfully");
      setMovies(movies.filter((m) => {
        const mId = String(m.displayId || m._id || m.id);
        return mId !== movieIdString;
      }));
      setDeleteModal({ isOpen: false, movie: null });
    } catch (error) {
      console.error("Error deleting movie:", error);
      toast.error(error.message || "Failed to delete movie");
      setDeleteModal({ isOpen: false, movie: null });
    }
  };

  // Show loading while checking auth status
  if (authLoading) {
    return <LoadingSpinner fullScreen message="Checking authentication..." />;
  }

  // Don't render if user is not logged in (will redirect)
  if (!user) {
    return null;
  }

  return (
    <div className={`min-h-screen py-8 ${isDark ? "bg-slate-950" : "bg-gray-50"}`}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1
              className={`text-4xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}
            >
              My Collection
            </h1>
            <p className={isDark ? "text-gray-400" : "text-gray-600"}>
              Manage your personal movie collection
            </p>
          </div>
          <Link
            to="/movies/add"
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
              isDark
                ? "bg-slate-800 hover:bg-slate-700 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            <Plus className="w-5 h-5" />
            Add Movie
          </Link>
        </div>

        {/* Movies Grid */}
        {loading ? (
          <div className="py-20">
            <LoadingSpinner message="Loading your collection..." />
          </div>
        ) : movies.length > 0 ? (
          <>
            <div className="mb-4">
              <p className={isDark ? "text-gray-400" : "text-gray-600"}>
                You have {movies.length} movie{movies.length !== 1 ? "s" : ""} in your collection
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {movies.map((movie) => {
                const movieId = movie._id || movie.id;
                if (!movieId) {
                  console.warn("Movie without ID:", movie);
                  return null;
                }
                // Convert to string for URL
        const movieIdString = String(movie.displayId || movieId);
                return (
                  <div key={movieIdString} className="relative group">
                    <MovieCard movie={movie} />
                    {/* Quick Actions - Always visible on mobile, hover on desktop */}
                    <div className="absolute top-2 right-2 flex gap-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity z-10">
                      <Link
                        to={`/movies/update/${movieIdString}`}
                        className={`p-2.5 rounded-lg shadow-xl backdrop-blur-sm border ${
                          isDark
                            ? "bg-white/10 hover:bg-white/20 text-white border-white/20"
                            : "bg-white/90 hover:bg-white text-blue-600 border-gray-200"
                        } transition-all hover:scale-110`}
                        title="Edit Movie"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => setDeleteModal({ isOpen: true, movie })}
                        className={`p-2.5 rounded-lg shadow-xl backdrop-blur-sm border ${
                          isDark
                            ? "bg-red-500/10 hover:bg-red-500/20 text-red-200 border-red-400/40"
                            : "bg-white/90 hover:bg-white text-red-600 border-gray-200"
                        } transition-all hover:scale-110`}
                        title="Delete Movie"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div
            className={`text-center py-12 ${isDark ? "text-gray-400" : "text-gray-500"}`}
          >
            <Film className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-xl font-semibold mb-2">No movies in your collection yet</p>
            <p className="mb-6">Start building your collection by adding your first movie</p>
            <Link
              to="/movies/add"
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                isDark
                  ? "bg-slate-800 hover:bg-slate-700 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              <Plus className="w-5 h-5" />
              Add Your First Movie
            </Link>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, movie: null })}
        onConfirm={handleDelete}
        movieTitle={deleteModal.movie?.title || ""}
      />
    </div>
  );
};

export default MyCollection;
