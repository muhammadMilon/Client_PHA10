import { useState, useEffect } from 'react';
import { Star, Clock, Calendar, TrendingUp, Users, Film as FilmIcon, Play } from 'lucide-react';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [stats, setStats] = useState({ totalMovies: 0, totalUsers: 0 });
  const [heroIndex, setHeroIndex] = useState(0);
  const dummyMovies = [
    {
      id: 1,
      title: "Inception",
      description: "A thief who steals corporate secrets through dream-sharing technology is given a chance at redemption.",
      rating: 9.0,
      release_year: 2010,
      duration: 148,
      genre: "Sci-Fi",
      poster_url: "https://m.media-amazon.com/images/I/51nbVEuw1HL._AC_.jpg",
    },
    {
      id: 2,
      title: "The Dark Knight",
      description: "Batman faces the Joker, a criminal mastermind who wants to watch the world burn.",
      rating: 9.1,
      release_year: 2008,
      duration: 152,
      genre: "Action",
      poster_url: "https://m.media-amazon.com/images/I/51K8ouYrHeL._AC_.jpg",
    },
    {
      id: 3,
      title: "Interstellar",
      description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
      rating: 8.7,
      release_year: 2014,
      duration: 169,
      genre: "Adventure",
      poster_url: "https://m.media-amazon.com/images/I/91kFYg4fX3L._AC_UF894,1000_QL80_.jpg",
    },
  ];

  useEffect(() => {
    setMovies(dummyMovies);
    setStats({
      totalMovies: dummyMovies.length,
      totalUsers: 1200,
    });
  }, []);

  useEffect(() => {
    if (movies.length > 0) {
      const interval = setInterval(() => {
        setHeroIndex((prev) => (prev + 1) % movies.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [movies]);

  const genres = [
    { name: 'Action', color: 'from-red-500 to-orange-500' },
    { name: 'Drama', color: 'from-blue-500 to-cyan-500' },
    { name: 'Sci-Fi', color: 'from-cyan-500 to-blue-500' },
    { name: 'Adventure', color: 'from-green-500 to-teal-500' },
    { name: 'Thriller', color: 'from-slate-600 to-slate-800' },
  ];

  const heroMovies = movies.slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* 🔹 Hero Slider */}
      <div className="relative h-[600px] overflow-hidden">
        {heroMovies.map((movie, index) => (
          <div
            key={movie.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === heroIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${movie.poster_url})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
            </div>
            <div className="relative h-full max-w-7xl mx-auto px-6 flex items-center">
              <div className="max-w-2xl">
                <span className="inline-block px-4 py-1 bg-red-600 rounded-full text-sm mb-4">
                  Featured Movie
                </span>
                <h1 className="text-5xl font-bold mb-4">{movie.title}</h1>
                <p className="text-lg text-gray-300 mb-6">{movie.description}</p>
                <div className="flex items-center gap-6 mb-8 text-gray-300">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    <span>{movie.rating}/10</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    <span>{movie.release_year}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    <span>{movie.duration} min</span>
                  </div>
                </div>
                <button
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold flex items-center gap-2"
                >
                  <Play className="w-5 h-5" />
                  Explore Movies
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 🔹 Stats */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-gradient-to-br from-red-600 to-red-800 rounded-2xl p-8 text-center">
          <FilmIcon className="w-10 h-10 mx-auto mb-3" />
          <h3 className="text-3xl font-bold">{stats.totalMovies}+</h3>
          <p className="text-gray-300">Total Movies</p>
        </div>
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-8 text-center">
          <Users className="w-10 h-10 mx-auto mb-3" />
          <h3 className="text-3xl font-bold">{stats.totalUsers}+</h3>
          <p className="text-gray-300">Active Users</p>
        </div>
        <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-2xl p-8 text-center">
          <TrendingUp className="w-10 h-10 mx-auto mb-3" />
          <h3 className="text-3xl font-bold">4.8/5</h3>
          <p className="text-gray-300">Average Rating</p>
        </div>
      </div>

      {/* 🔹 Genres */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        <h2 className="text-4xl font-bold mb-8">Browse by Genre</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {genres.map((genre) => (
            <div
              key={genre.name}
              className={`bg-gradient-to-br ${genre.color} rounded-xl p-6 text-center cursor-pointer transform hover:scale-105 transition-all`}
            >
              <div className="text-white font-bold text-lg">{genre.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
