import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { api } from "../utils/api";
import MovieCard from "../components/MovieCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { Search, Filter, Grid, List } from "lucide-react";
import { toast } from "react-toastify";

const AllMovies = () => {
  const { isDark } = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [genre, setGenre] = useState(searchParams.get("genre") || "All");
  const [sortBy, setSortBy] = useState("rating");

  const genres = [
    "All",
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
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const filters = {
          genre: genre !== "All" ? genre : undefined,
          search: search || undefined,
          sortBy,
        };
        const data = await api.getMovies(filters);
        setMovies(data);
      } catch (error) {
        console.error("Error fetching movies:", error);
        toast.error("Failed to load movies");
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [genre, search, sortBy]);

  useEffect(() => {
    // Update URL params when filters change
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (genre !== "All") params.set("genre", genre);
    setSearchParams(params);
  }, [search, genre, setSearchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    // Search is already handled by useEffect
  };

  return (
    <div className={`min-h-screen py-8 ${isDark ? "bg-slate-950" : "bg-gray-50"}`}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1
            className={`text-4xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}
          >
            All Movies
          </h1>
          <p className={`${isDark ? "text-gray-400" : "text-gray-600"}`}>
            Discover and explore our extensive movie collection
          </p>
        </div>

        {/* Filters */}
        <div
          className={`mb-6 p-4 rounded-lg ${
            isDark ? "bg-slate-900" : "bg-white"
          } shadow-md`}
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                />
                <input
                  type="text"
                  placeholder="Search movies by title, director, or cast..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                    isDark
                      ? "bg-slate-800 border-slate-700 text-white placeholder-gray-500"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>
            </form>

            {/* Genre Filter */}
            <div className="flex items-center gap-2">
              <Filter
                className={`w-5 h-5 ${isDark ? "text-gray-400" : "text-gray-500"}`}
              />
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className={`px-4 py-2 rounded-lg border ${
                  isDark
                    ? "bg-slate-800 border-slate-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                {genres.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={`px-4 py-2 rounded-lg border ${
                isDark
                  ? "bg-slate-800 border-slate-700 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <option value="rating">Sort by Rating</option>
              <option value="year">Sort by Year</option>
              <option value="title">Sort by Title</option>
            </select>
          </div>
        </div>

        {/* Movies Grid */}
        {loading ? (
          <div className="py-16">
            <LoadingSpinner message="Loading movies..." />
          </div>
        ) : movies.length > 0 ? (
          <>
            <div className="mb-4 flex items-center justify-between">
              <p className={isDark ? "text-gray-400" : "text-gray-600"}>
                Found {movies.length} movie{movies.length !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {movies.map((movie) => (
                <MovieCard key={movie._id} movie={movie} />
              ))}
            </div>
          </>
        ) : (
          <div
            className={`text-center py-12 ${isDark ? "text-gray-400" : "text-gray-500"}`}
          >
            <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-xl font-semibold mb-2">No movies found</p>
            <p>Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllMovies;
