import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../utils/api";
import DeleteModal from "../components/DeleteModal";
import {
  Star,
  Calendar,
  Clock,
  Film,
  User,
  MapPin,
  Globe,
  Edit,
  Trash2,
  ArrowLeft,
  BookmarkPlus,
  BookmarkCheck,
  Loader2,
} from "lucide-react";
import { toast } from "react-toastify";
import LoadingSpinner from "../components/LoadingSpinner";

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { user } = useAuth();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isWatchlisted, setIsWatchlisted] = useState(false);
  const [watchlistLoading, setWatchlistLoading] = useState(false);
  const [watchlistStatusLoading, setWatchlistStatusLoading] = useState(false);

  const parseNumeric = (value) => {
    if (typeof value === "number") {
      return Number.isFinite(value) ? value : NaN;
    }
    if (typeof value === "string" && value.trim() !== "") {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : NaN;
    }
    return NaN;
  };

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true);
        console.log("Fetching movie with ID:", id);
        const data = await api.getMovie(id);
        console.log("Movie data received:", data);
        setMovie(data);
      } catch (error) {
        console.error("Error fetching movie:", error);
        const errorMessage = error.message || "Failed to load movie details";
        toast.error(errorMessage);
        // Only navigate if it's a 404, not other errors
        if (errorMessage.includes("not found") || errorMessage.includes("404")) {
          navigate("/all-movies");
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMovie();
    }
  }, [id, navigate]);

  useEffect(() => {
    let isMounted = true;

    const fetchStatus = async () => {
      if (!user?.email || !id) {
        if (isMounted) {
          setIsWatchlisted(false);
        }
        return;
      }

      try {
        if (isMounted) {
          setWatchlistStatusLoading(true);
        }
        const status = await api.isMovieInWatchlist(id, user.email);
        if (isMounted) {
          setIsWatchlisted(!!status?.isWatchlisted);
        }
      } catch (error) {
        console.error("Error checking watchlist status:", error);
      } finally {
        if (isMounted) {
          setWatchlistStatusLoading(false);
        }
      }
    };

    fetchStatus();

    return () => {
      isMounted = false;
    };
  }, [id, user?.email]);

  const handleDelete = async () => {
    try {
      await api.deleteMovie(id, user?.email);
      toast.success("Movie deleted successfully");
      setShowDeleteModal(false);
      // Navigate to my collection or all movies
      navigate("/my-collection");
    } catch (error) {
      console.error("Error deleting movie:", error);
      toast.error(error.message || "Failed to delete movie");
      setShowDeleteModal(false);
    }
  };

  const handleWatchlistToggle = async () => {
    if (!id) return;
    if (!user?.email) {
      toast.error("Please login to manage your watchlist");
      navigate("/login");
      return;
    }

    try {
      setWatchlistLoading(true);
      if (isWatchlisted) {
        await api.removeFromWatchlist(id, user.email);
        toast.success("Removed from watchlist");
        setIsWatchlisted(false);
      } else {
        const response = await api.addToWatchlist(id, user.email);
        if (response?.alreadyExists) {
          toast.info("Movie is already in your watchlist");
        } else {
          toast.success("Added to watchlist");
        }
        setIsWatchlisted(true);
      }
    } catch (error) {
      console.error("Error toggling watchlist:", error);
      toast.error(error.message || "Failed to update watchlist");
    } finally {
      setWatchlistLoading(false);
    }
  };

  const isOwner =
    user &&
    movie &&
    movie.addedBy &&
    user.email &&
    movie.addedBy.toLowerCase() === user.email.toLowerCase();

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading movie details..." size="lg" />;
  }

  if (!movie) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-semibold mb-4">Movie not found</p>
          <Link
            to="/all-movies"
            className="text-blue-600 hover:underline"
          >
            Back to Movies
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-8 ${isDark ? "bg-slate-950" : "bg-gray-50"}`}>
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className={`flex items-center gap-2 mb-6 px-4 py-2 rounded-lg transition-colors ${
            isDark
              ? "bg-slate-800 hover:bg-slate-700 text-white"
              : "bg-white hover:bg-gray-100 text-gray-900"
          }`}
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Poster */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <img
                src={movie.posterUrl || "https://via.placeholder.com/400x600?text=No+Poster"}
                alt={movie.title}
                className="w-full rounded-lg shadow-2xl"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/400x600?text=No+Poster";
                }}
              />
            </div>
          </div>

          {/* Details */}
          <div className="lg:col-span-2">
            <div
              className={`p-6 rounded-lg shadow-lg ${
                isDark ? "bg-slate-900" : "bg-white"
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1
                    className={`text-4xl font-bold mb-2 ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {movie.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <span
                      className={`flex items-center gap-1 ${
                        isDark ? "text-yellow-400" : "text-yellow-600"
                      }`}
                    >
                      <Star className="w-5 h-5 fill-yellow-400" />
                      {(() => {
                        const value = parseNumeric(movie?.rating);
                        return Number.isFinite(value) ? value.toFixed(1) : "N/A";
                      })()}
                    </span>
                    <span
                      className={`flex items-center gap-1 ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      <Calendar className="w-4 h-4" />
                      {movie.releaseYear || "N/A"}
                    </span>
                    <span
                      className={`flex items-center gap-1 ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      <Clock className="w-4 h-4" />
                      {movie.duration ? `${movie.duration} min` : "N/A"}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 justify-end">
                  <button
                    onClick={handleWatchlistToggle}
                    disabled={watchlistLoading}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all hover:scale-105 ${
                      isWatchlisted
                        ? isDark
                          ? "bg-emerald-500/90 hover:bg-emerald-500 text-white"
                          : "bg-emerald-500 hover:bg-emerald-600 text-white"
                        : isDark
                        ? "bg-slate-800 hover:bg-slate-700 text-white"
                        : "bg-blue-600/90 hover:bg-blue-600 text-white"
                    } disabled:opacity-60 disabled:cursor-not-allowed`}
                    title={isWatchlisted ? "Remove from watchlist" : "Add to watchlist"}
                  >
                    {watchlistLoading || watchlistStatusLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : isWatchlisted ? (
                      <BookmarkCheck className="w-4 h-4" />
                    ) : (
                      <BookmarkPlus className="w-4 h-4" />
                    )}
                    <span>{isWatchlisted ? "In Watchlist" : "Add to Watchlist"}</span>
                  </button>
                  {isOwner && (
                    <>
                      <Link
                        to={`/movies/update/${movie._id}`}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all hover:scale-105 ${
                          isDark
                            ? "bg-blue-600 hover:bg-blue-700 text-white"
                            : "bg-blue-600 hover:bg-blue-700 text-white"
                        }`}
                        title="Edit Movie"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Edit</span>
                      </Link>
                      <button
                        onClick={() => setShowDeleteModal(true)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all hover:scale-105 ${
                          isDark
                            ? "bg-red-600 hover:bg-red-700 text-white"
                            : "bg-red-600 hover:bg-red-700 text-white"
                        }`}
                        title="Delete Movie"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete</span>
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Plot Summary */}
              <div className="mb-6">
                <h2
                  className={`text-xl font-semibold mb-2 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Plot Summary
                </h2>
                <p
                  className={`${isDark ? "text-gray-300" : "text-gray-700"} leading-relaxed`}
                >
                  {movie.plotSummary || "No plot summary available."}
                </p>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div
                  className={`p-4 rounded-lg ${
                    isDark ? "bg-slate-800" : "bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Film
                      className={`w-5 h-5 ${
                        isDark ? "text-blue-400" : "text-blue-600"
                      }`}
                    />
                    <span
                      className={`font-semibold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Genre
                    </span>
                  </div>
                  <p className={isDark ? "text-gray-300" : "text-gray-700"}>
                    {movie.genre || "N/A"}
                  </p>
                </div>

                <div
                  className={`p-4 rounded-lg ${
                    isDark ? "bg-slate-800" : "bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <User
                      className={`w-5 h-5 ${
                        isDark ? "text-green-400" : "text-green-600"
                      }`}
                    />
                    <span
                      className={`font-semibold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Director
                    </span>
                  </div>
                  <p className={isDark ? "text-gray-300" : "text-gray-700"}>
                    {movie.director || "N/A"}
                  </p>
                </div>

                <div
                  className={`p-4 rounded-lg ${
                    isDark ? "bg-slate-800" : "bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <User
                      className={`w-5 h-5 ${
                        isDark ? "text-purple-400" : "text-purple-600"
                      }`}
                    />
                    <span
                      className={`font-semibold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Cast
                    </span>
                  </div>
                  <p className={isDark ? "text-gray-300" : "text-gray-700"}>
                    {movie.cast || "N/A"}
                  </p>
                </div>

                <div
                  className={`p-4 rounded-lg ${
                    isDark ? "bg-slate-800" : "bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Globe
                      className={`w-5 h-5 ${
                        isDark ? "text-orange-400" : "text-orange-600"
                      }`}
                    />
                    <span
                      className={`font-semibold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Language
                    </span>
                  </div>
                  <p className={isDark ? "text-gray-300" : "text-gray-700"}>
                    {movie.language || "N/A"}
                  </p>
                </div>

                <div
                  className={`p-4 rounded-lg ${
                    isDark ? "bg-slate-800" : "bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin
                      className={`w-5 h-5 ${
                        isDark ? "text-red-400" : "text-red-600"
                      }`}
                    />
                    <span
                      className={`font-semibold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Country
                    </span>
                  </div>
                  <p className={isDark ? "text-gray-300" : "text-gray-700"}>
                    {movie.country || "N/A"}
                  </p>
                </div>
              </div>

              {/* Added By */}
              {movie.addedBy && (
                <div
                  className={`p-4 rounded-lg border-t ${
                    isDark
                      ? "bg-slate-800 border-slate-700"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                    Added by: <span className="font-semibold">{movie.addedBy}</span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        movieTitle={movie.title}
      />
    </div>
  );
};

export default MovieDetails;

