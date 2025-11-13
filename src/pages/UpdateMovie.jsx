import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../utils/api";
import { ArrowLeft, Edit } from "lucide-react";
import { toast } from "react-toastify";
import LoadingSpinner from "../components/LoadingSpinner";

const UpdateMovie = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    genre: "",
    releaseYear: "",
    director: "",
    cast: "",
    rating: "",
    duration: "",
    plotSummary: "",
    posterUrl: "",
    language: "",
    country: "",
  });
  const [addedBy, setAddedBy] = useState("");

  const genres = [
    "Action",
    "Drama",
    "Comedy",
    "Sci-Fi",
    "Horror",
    "Thriller",
    "Romance",
    "Adventure",
    "Fantasy",
    "Animation",
  ];

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setFetching(true);
        const movie = await api.getMovie(id);
        
        // Check if user is the owner
        const movieOwner = movie.addedBy?.toLowerCase();
        const currentUserEmail = user?.email?.toLowerCase();
        if (!currentUserEmail || movieOwner !== currentUserEmail) {
          toast.error("You don't have permission to edit this movie");
          navigate("/all-movies");
          return;
        }

        setFormData({
          title: movie.title || "",
          genre: movie.genre || "",
          releaseYear: movie.releaseYear?.toString() || "",
          director: movie.director || "",
          cast: movie.cast || "",
          rating: movie.rating?.toString() || "",
          duration: movie.duration?.toString() || "",
          plotSummary: movie.plotSummary || "",
          posterUrl: movie.posterUrl || "",
          language: movie.language || "",
          country: movie.country || "",
        });
        setAddedBy(movie.addedBy || "");
      } catch (error) {
        console.error("Error fetching movie:", error);
        toast.error("Failed to load movie");
        navigate("/my-collection");
      } finally {
        setFetching(false);
      }
    };

    if (user && id) {
      fetchMovie();
    } else if (!user) {
      toast.error("Please login to update a movie");
      navigate("/login");
    }
  }, [id, user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please login to update a movie");
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      await api.updateMovie(id, formData, user.email);
      toast.success("Movie updated successfully!");
      navigate(`/movies/${id}`);
    } catch (error) {
      console.error("Error updating movie:", error);
      toast.error(error.message || "Failed to update movie");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <LoadingSpinner fullScreen message="Loading movie details..." size="lg" />;
  }

  return (
    <div className={`min-h-screen py-8 ${isDark ? "bg-slate-950" : "bg-gray-50"}`}>
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className={`flex items-center gap-2 mb-4 px-4 py-2 rounded-lg transition-colors ${
              isDark
                ? "bg-slate-800 hover:bg-slate-700 text-white"
                : "bg-white hover:bg-gray-100 text-gray-900"
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <div className="flex items-center gap-3 mb-2">
            <Edit className={`w-8 h-8 ${isDark ? "text-blue-400" : "text-blue-600"}`} />
            <h1 className={`text-4xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
              Update Movie
            </h1>
          </div>
          <p className={isDark ? "text-gray-400" : "text-gray-600"}>
            Update the movie details below
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className={`relative p-6 rounded-lg shadow-lg ${
            isDark ? "bg-slate-900" : "bg-white"
          }`}
        >
          {loading && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 rounded-lg bg-slate-950/80 backdrop-blur-sm">
              <LoadingSpinner message="Updating movie..." size="sm" />
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="md:col-span-2">
              <label
                className={`block mb-2 font-semibold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className={`w-full px-4 py-2 rounded-lg border ${
                  isDark
                    ? "bg-slate-800 border-slate-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Enter movie title"
              />
            </div>

            {/* Genre */}
            <div>
              <label
                className={`block mb-2 font-semibold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Genre *
              </label>
              <select
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                required
                className={`w-full px-4 py-2 rounded-lg border ${
                  isDark
                    ? "bg-slate-800 border-slate-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="">Select Genre</option>
                {genres.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            </div>

            {/* Release Year */}
            <div>
              <label
                className={`block mb-2 font-semibold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Release Year *
              </label>
              <input
                type="number"
                name="releaseYear"
                value={formData.releaseYear}
                onChange={handleChange}
                required
                min="1900"
                max={new Date().getFullYear() + 10}
                className={`w-full px-4 py-2 rounded-lg border ${
                  isDark
                    ? "bg-slate-800 border-slate-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="e.g., 2020"
              />
            </div>

            {/* Director */}
            <div>
              <label
                className={`block mb-2 font-semibold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Director *
              </label>
              <input
                type="text"
                name="director"
                value={formData.director}
                onChange={handleChange}
                required
                className={`w-full px-4 py-2 rounded-lg border ${
                  isDark
                    ? "bg-slate-800 border-slate-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Enter director name"
              />
            </div>

            {/* Cast */}
            <div>
              <label
                className={`block mb-2 font-semibold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Cast *
              </label>
              <input
                type="text"
                name="cast"
                value={formData.cast}
                onChange={handleChange}
                required
                className={`w-full px-4 py-2 rounded-lg border ${
                  isDark
                    ? "bg-slate-800 border-slate-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Enter cast names (comma separated)"
              />
            </div>

            {/* Rating */}
            <div>
              <label
                className={`block mb-2 font-semibold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Rating *
              </label>
              <input
                type="number"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                required
                min="0"
                max="10"
                step="0.1"
                className={`w-full px-4 py-2 rounded-lg border ${
                  isDark
                    ? "bg-slate-800 border-slate-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="e.g., 8.5"
              />
            </div>

            {/* Duration */}
            <div>
              <label
                className={`block mb-2 font-semibold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Duration (minutes) *
              </label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                required
                min="1"
                className={`w-full px-4 py-2 rounded-lg border ${
                  isDark
                    ? "bg-slate-800 border-slate-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="e.g., 120"
              />
            </div>

            {/* Language */}
            <div>
              <label
                className={`block mb-2 font-semibold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Language *
              </label>
              <input
                type="text"
                name="language"
                value={formData.language}
                onChange={handleChange}
                required
                className={`w-full px-4 py-2 rounded-lg border ${
                  isDark
                    ? "bg-slate-800 border-slate-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="e.g., English"
              />
            </div>

            {/* Country */}
            <div>
              <label
                className={`block mb-2 font-semibold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Country *
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
                className={`w-full px-4 py-2 rounded-lg border ${
                  isDark
                    ? "bg-slate-800 border-slate-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="e.g., USA"
              />
            </div>

            {/* Poster URL */}
            <div className="md:col-span-2">
              <label
                className={`block mb-2 font-semibold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Poster URL
              </label>
              <input
                type="url"
                name="posterUrl"
                value={formData.posterUrl}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-lg border ${
                  isDark
                    ? "bg-slate-800 border-slate-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="https://example.com/poster.jpg"
              />
            </div>

            {/* Plot Summary */}
            <div className="md:col-span-2">
              <label
                className={`block mb-2 font-semibold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Plot Summary *
              </label>
              <textarea
                name="plotSummary"
                value={formData.plotSummary}
                onChange={handleChange}
                required
                rows="4"
                className={`w-full px-4 py-2 rounded-lg border ${
                  isDark
                    ? "bg-slate-800 border-slate-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Enter movie plot summary"
              />
            </div>

            {/* Added By - Read Only */}
            <div className="md:col-span-2">
              <label
                className={`block mb-2 font-semibold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Added By (Read Only)
              </label>
              <input
                type="text"
                value={addedBy}
                disabled
                className={`w-full px-4 py-2 rounded-lg border ${
                  isDark
                    ? "bg-slate-700 border-slate-600 text-gray-400 cursor-not-allowed"
                    : "bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                placeholder="N/A"
              />
              <p className={`mt-1 text-xs ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                This field cannot be edited
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-6 flex gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-colors ${
                isDark
                  ? "bg-slate-800 hover:bg-slate-700 text-white"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-900"
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                isDark
                  ? "bg-white/10 hover:bg-white/20 text-white border border-white/20"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <LoadingSpinner inline size="xs" />
                  <span>Updating...</span>
                </span>
              ) : (
                "Update Movie"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateMovie;

