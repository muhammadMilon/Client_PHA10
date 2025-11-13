import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../utils/api";
import { ArrowLeft, Film } from "lucide-react";
import { toast } from "react-toastify";
import LoadingSpinner from "../components/LoadingSpinner";

const AddMovie = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
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
      toast.error("Please login to add a movie");
      navigate("/login");
      return;
    }

    // Validate required fields
    if (!formData.title || !formData.genre || !formData.releaseYear || 
        !formData.director || !formData.cast || !formData.rating || 
        !formData.duration || !formData.plotSummary || !formData.language || 
        !formData.country) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Validate rating range
    const rating = parseFloat(formData.rating);
    if (isNaN(rating) || rating < 0 || rating > 10) {
      toast.error("Rating must be between 0 and 10");
      return;
    }

    // Validate release year
    const year = parseInt(formData.releaseYear);
    const currentYear = new Date().getFullYear();
    if (isNaN(year) || year < 1900 || year > currentYear + 10) {
      toast.error(`Release year must be between 1900 and ${currentYear + 10}`);
      return;
    }

    try {
      setLoading(true);
      await api.addMovie(formData, user.email);
      toast.success("Movie added successfully!");
      navigate("/my-collection");
    } catch (error) {
      console.error("Error adding movie:", error);
      toast.error(error.message || "Failed to add movie");
    } finally {
      setLoading(false);
    }
  };

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
            <Film className={`w-8 h-8 ${isDark ? "text-blue-400" : "text-blue-600"}`} />
            <h1 className={`text-4xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
              Add New Movie
            </h1>
          </div>
          <p className={isDark ? "text-gray-400" : "text-gray-600"}>
            Fill in the details to add a new movie to your collection
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
              <LoadingSpinner message="Saving movie..." size="sm" />
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
                  <span>Adding...</span>
                </span>
              ) : (
                "Add Movie"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMovie;

