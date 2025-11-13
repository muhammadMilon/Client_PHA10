import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { api } from "../utils/api";
import MovieCard from "../components/MovieCard";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  Film,
  Users,
  Star,
  TrendingUp,
  ArrowRight,
  Play,
  Award,
  Clock,
  Info,
  Sparkles,
  Compass,
  BookmarkCheck,
} from "lucide-react";
import { toast } from "react-toastify";

const Home = () => {
  const { isDark } = useTheme();
  const location = useLocation();
  const [stats, setStats] = useState({ totalMovies: 0, totalUsers: 0 });
  const [topRated, setTopRated] = useState([]);
  const [recent, setRecent] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

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
    let isMounted = true;

    const fetchData = async () => {
      try {
        if (isMounted) {
          setLoading(true);
        }
        const [statsData, topRatedData, recentData, featuredData] = await Promise.all([
          api.getStats(),
          api.getTopRated(),
          api.getRecent(),
          api.getFeatured(),
        ]);

        if (isMounted) {
          setStats(statsData);
          setTopRated(topRatedData);
          setRecent(recentData);
          setFeatured(featuredData);
        }
      } catch (error) {
        console.error("Error fetching home data:", error);
        if (isMounted) {
          toast.error("Failed to load home data");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [location.key]);

  // Auto-rotate carousel
  useEffect(() => {
    if (featured.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % featured.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [featured.length]);

  const formatRating = (value) => {
    if (typeof value === "number" && Number.isFinite(value)) {
      return value.toFixed(1);
    }
    if (typeof value === "string") {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) {
        return parsed.toFixed(1);
      }
    }
    return "N/A";
  };

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading personalized dashboard..." size="lg" />;
  }

  return (
    <div
      className={`relative min-h-screen transition-colors ${
        isDark ? "bg-slate-950 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          backgroundImage:
            "radial-gradient(circle at 10% 20%, rgba(96,165,250,0.25) 0, transparent 60%), radial-gradient(circle at 90% 10%, rgba(236,72,153,0.22) 0, transparent 55%)",
        }}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div
          className={`absolute inset-0 ${
            isDark
              ? "bg-gradient-to-br from-slate-950 via-slate-900/90 to-slate-900"
              : "bg-gradient-to-br from-blue-50 via-white to-indigo-50"
          }`}
        />
        <div className="waterfall-overlay opacity-60" aria-hidden="true" />
        <div className="relative container mx-auto px-4 py-20 lg:py-28">
          <div className="grid items-center gap-10 lg:grid-cols-[1.15fr,0.85fr]">
            <div className="space-y-6 animate-fade-in">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur">
                <Sparkles className="h-4 w-4 text-yellow-300" />
                Curated for Cinephiles
              </div>
              <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                Discover, curate, and fall in love with movies all over again.
              </h1>
              <p
                className={`max-w-2xl text-lg leading-relaxed ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                MovieMaster Pro combines a powerful database with a personal touch. Track
                your collection, share recommendations, and find your next favorite film with
                seamless browsing experiences.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  to="/all-movies"
                  className={`inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-lg font-semibold shadow-lg shadow-blue-600/30 transition-all hover:shadow-xl hover:shadow-blue-600/40 ${
                    isDark
                      ? "bg-white/10 text-white border border-white/20 hover:bg-white/20"
                      : "bg-blue-600 text-white hover:bg-blue-500"
                  }`}
                >
                  <Compass className="h-5 w-5" />
                  Explore Movies
                </Link>
                <Link
                  to="/watchlist"
                  className={`inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-lg font-semibold transition-all ${
                    isDark
                      ? "bg-white/10 text-white hover:bg-white/20"
                      : "bg-white text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  <BookmarkCheck className="h-5 w-5" />
                  View Watchlist
                </Link>
              </div>
              <div
                className={`grid gap-4 rounded-2xl border px-6 py-5 backdrop-blur-md sm:grid-cols-3 ${
                  isDark ? "border-white/10 bg-white/5" : "border-blue-100 bg-white/80"
                }`}
              >
                <StatBadge
                  icon={<Film className="h-5 w-5" />}
                  label="Movies Curated"
                  value={stats.totalMovies}
                  isDark={isDark}
                />
                <StatBadge
                  icon={<Users className="h-5 w-5" />}
                  label="Movie Lovers Joined"
                  value={stats.totalUsers}
                  isDark={isDark}
                />
                <StatBadge
                  icon={<Star className="h-5 w-5" />}
                  label="Top Rated Picks"
                  value={topRated.length}
                  isDark={isDark}
                  suffix="/ 5"
                />
              </div>
            </div>

            <div className="relative hidden overflow-hidden rounded-3xl lg:block">
              <div
                className={`absolute inset-0 -translate-y-4 translate-x-6 rounded-3xl blur-3xl ${
                  isDark ? "bg-blue-500/20" : "bg-blue-300/40"
                }`}
              />
              <div
                className={`relative overflow-hidden rounded-3xl border shadow-2xl ${
                  isDark ? "border-white/10 bg-slate-900/60" : "border-blue-100 bg-white"
                }`}
              >
                <FeaturedCarousel
                  featured={featured}
                  currentSlide={currentSlide}
                  onSelectSlide={setCurrentSlide}
                  isDark={isDark}
                  formatRating={formatRating}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="relative py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 md:grid-cols-3">
            <HighlightCard
              title="Your personal cinema companion"
              description="Organize your collection, track what you've watched, and keep tabs on the films you plan to watch next."
              icon={Film}
              gradient="from-blue-500/20 to-indigo-500/20"
              isDark={isDark}
            />
            <HighlightCard
              title="Data-backed insights"
              description="Our statistics update in real-time so you always know what the community is watching and loving."
              icon={TrendingUp}
              gradient="from-emerald-500/20 to-green-500/20"
              isDark={isDark}
            />
            <HighlightCard
              title="Built for binge nights"
              description="Create the perfect marathon list with curated recommendations and the powerful MovieMaster watchlist."
              icon={BookmarkCheck}
              gradient="from-rose-500/20 to-purple-500/20"
              isDark={isDark}
            />
          </div>
        </div>
      </section>

      {/* Top Rated */}
      <SectionShell
        title="Top Rated Movies"
        description="The community’s highest rated picks this week."
        icon={Award}
        isDark={isDark}
        linkTarget="/all-movies"
      >
        {topRated.length ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
            {topRated.map((movie, idx) => {
              const movieIdentifier = movie?._id ?? movie?.id ?? idx;
              return (
                <div
                  key={movieIdentifier}
                  className="animate-scale-in rounded-2xl border border-transparent transition hover:border-blue-500/40 hover:shadow-xl hover:shadow-blue-500/20"
                >
                  <MovieCard movie={movie} />
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon={Star}
            title="No top rated movies yet"
            description="As soon as users begin rating, the finest films will appear here."
            isDark={isDark}
          />
        )}
      </SectionShell>

      {/* Recently Added */}
      <SectionShell
        title="Recently Added"
        description="Fresh arrivals straight from our community curators."
        icon={Clock}
        isDark={isDark}
        linkTarget="/all-movies"
      >
        {recent.length ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
            {recent.map((movie, idx) => {
              const movieIdentifier = movie?._id ?? movie?.id ?? idx;
              return (
                <div
                  key={movieIdentifier}
                  className="animate-scale-in rounded-2xl border border-transparent transition hover:border-sky-400/40 hover:shadow-lg hover:shadow-sky-400/20"
                >
                  <MovieCard movie={movie} />
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon={TrendingUp}
            title="No recent movies yet"
            description="New additions will appear here the moment they land."
            isDark={isDark}
          />
        )}
      </SectionShell>

      {/* Genre Section */}
      <section className="relative py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-500">
              Browse by genre
            </div>
            <h2 className="text-3xl font-bold md:text-4xl">Pick your cinematic mood</h2>
            <p className={`mt-3 max-w-2xl mx-auto ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              From adrenaline-pumping adventures to heartwarming dramas—jump into any genre that
              matches your vibe today.
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {genres.map((genre) => (
              <Link
                key={genre}
                to={`/all-movies?genre=${genre}`}
                className={`group rounded-xl border px-5 py-6 text-center font-semibold transition-all hover:-translate-y-1 hover:shadow-lg ${
                  isDark
                    ? "border-white/10 bg-white/5 text-gray-100 hover:border-blue-400/60"
                    : "border-blue-100 bg-white text-gray-800 hover:border-blue-300"
                }`}
              >
                <span className="text-lg">{genre}</span>
                <div
                  className={`mt-2 text-sm ${
                    isDark ? "text-gray-400 group-hover:text-blue-300" : "text-gray-500 group-hover:text-blue-500"
                  }`}
                >
                  Tap to explore →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="relative overflow-hidden py-16">
        <div className="container relative mx-auto px-4">
          <div
            className={`relative overflow-hidden rounded-3xl border px-6 py-12 sm:px-12 ${
              isDark ? "border-white/10 bg-gradient-to-br from-slate-900 via-slate-900/80 to-slate-900" : "border-blue-100 bg-gradient-to-br from-white via-white to-blue-50"
            }`}
          >
            <div className="grid gap-10 lg:grid-cols-[1fr,1.1fr]">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-blue-300">
                  <Info className="h-4 w-4" />
                  Why MovieMaster Pro?
                </div>
                <h2 className="text-3xl font-bold md:text-4xl">
                  Streaming knowledge, curated experiences, and personal collections.
                </h2>
                <p className={isDark ? "text-gray-300" : "text-gray-600"}>
                  Built for movie lovers by movie lovers. We balance rich metadata and community
                  insights with elegant design, making it effortless to discover and manage the films
                  you love. MovieMaster Pro is the ultimate companion for your cinematic journey.
                </p>
                <div className="grid gap-4 sm:grid-cols-3">
                  <AboutBadge
                    title="Smart discovery"
                    description="Dynamic recommendations surface hidden gems tailored for you."
                    icon={Compass}
                    isDark={isDark}
                  />
                  <AboutBadge
                    title="Seamless watchlists"
                    description="Add, manage, and revisit films with our powerful watchlist tools."
                    icon={BookmarkCheck}
                    isDark={isDark}
                  />
                  <AboutBadge
                    title="Community pulse"
                    description="See what others are watching and stay ahead of trends."
                    icon={TrendingUp}
                    isDark={isDark}
                  />
                </div>
              </div>

              <div
                className={`relative overflow-hidden rounded-2xl border ${
                  isDark ? "border-white/10 bg-white/5" : "border-blue-100 bg-white"
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10" />
                <div className="relative grid gap-6 p-6 sm:p-8">
                  <RoadmapStep
                    step="01"
                    title="Build your collection"
                    description="Save movies you love, track what you’ve seen, and plan binges."
                    isDark={isDark}
                  />
                  <RoadmapStep
                    step="02"
                    title="Explore curated lists"
                    description="Dive into community picks, editor’s choices, and top charts."
                    isDark={isDark}
                  />
                  <RoadmapStep
                    step="03"
                    title="Share the love"
                    description="Recommend movies, compare ratings, and connect with friends."
                    isDark={isDark}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const StatBadge = ({ icon, label, value, suffix = "", isDark }) => {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-xl ${
          isDark ? "bg-white/10 text-blue-300" : "bg-blue-100 text-blue-600"
        }`}
      >
        {icon}
      </div>
      <div>
        <div className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
          {value} <span className="text-lg font-semibold opacity-75">{suffix}</span>
        </div>
        <div className={`text-sm uppercase tracking-wide ${isDark ? "text-gray-400" : "text-gray-500"}`}>
          {label}
        </div>
      </div>
    </div>
  );
};

const SectionShell = ({ children, title, description, icon: Icon, isDark, linkTarget }) => {
  return (
    <section className="relative py-16">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div
              className={`rounded-xl p-3 ${
                isDark ? "bg-white/10 text-white" : "bg-blue-100 text-blue-600"
              }`}
            >
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-3xl font-bold md:text-4xl">{title}</h2>
              <p className={`${isDark ? "text-gray-400" : "text-gray-600"} mt-1`}>{description}</p>
            </div>
          </div>
          <Link
            to={linkTarget}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition hover:-translate-y-0.5 ${
              isDark
                ? "border-white/10 bg-white/5 text-white hover:border-blue-300/50"
                : "border-blue-200 bg-white text-blue-600 hover:border-blue-400"
            }`}
          >
            View all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        {children}
      </div>
    </section>
  );
};

const EmptyState = ({ icon: Icon, title, description, isDark }) => (
  <div
    className={`flex flex-col items-center gap-3 rounded-3xl border px-8 py-12 text-center ${
      isDark ? "border-white/10 bg-white/5 text-gray-300" : "border-blue-100 bg-white text-gray-600"
    }`}
  >
    <Icon className="h-12 w-12 opacity-70" />
    <h3 className="text-xl font-semibold">{title}</h3>
    <p className="max-w-md">{description}</p>
  </div>
);

const FeaturedCarousel = ({ featured, currentSlide, onSelectSlide, isDark, formatRating }) => {
  if (!featured.length) {
    return (
      <div className="flex h-full min-h-[420px] flex-col items-center justify-center gap-3 p-10 text-center">
        <Film className="h-12 w-12 text-gray-400" />
        <p className={isDark ? "text-gray-300" : "text-gray-600"}>Add movies to feature them here.</p>
      </div>
    );
  }

  return (
    <div className="relative flex h-full min-h-[420px] flex-col">
      <div className="relative flex-1 overflow-hidden">
        {featured.map((movie, index) => {
          const movieIdentifier = movie?._id ?? movie?.id ?? index;
          const movieIdString = movieIdentifier !== undefined ? String(movieIdentifier) : "";
          const isActive = index === currentSlide;
          return (
            <div
              key={movieIdString || index}
              className={`absolute inset-0 transform transition-all duration-700 ${
                isActive ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
              }`}
            >
              <img
                src={movie.posterUrl || "https://via.placeholder.com/600x800?text=No+Poster"}
                alt={movie.title}
                className="h-full w-full rounded-3xl object-cover"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/600x800?text=No+Poster";
                }}
              />
              <div className="absolute inset-x-0 bottom-0 space-y-3 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-6 text-white">
                <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-wide text-blue-300">
                  Featured pick
                </div>
                <h3 className="text-2xl font-bold">{movie.title}</h3>
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    {formatRating(movie.rating)}
                  </span>
                  <span>{movie.releaseYear || "N/A"}</span>
                  <span>{movie.genre || "Unknown genre"}</span>
                </div>
                <p className="line-clamp-3 text-sm opacity-80">{movie.plotSummary}</p>
                <Link
                  to={movieIdString ? `/movies/${movieIdString}` : "#"}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                    isDark
                      ? "border border-white/20 bg-white/10 text-white hover:bg-white/20 focus-visible:outline-blue-300"
                      : "border border-blue-100 bg-white text-blue-600 hover:bg-blue-50 focus-visible:outline-blue-500"
                  }`}
                >
                  <Play className="h-4 w-4" />
                  View details
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {featured.length > 1 && (
        <div
          className={`relative z-10 flex items-center justify-center gap-2 border-t py-3 backdrop-blur ${
            isDark ? "border-white/10 bg-black/40" : "border-black/10 bg-white/60"
          }`}
        >
          {featured.map((_, index) => (
            <button
              key={index}
              onClick={() => onSelectSlide(index)}
              className={`h-2 rounded-full transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                currentSlide === index
                  ? isDark
                    ? "w-10 bg-white focus-visible:outline-blue-200"
                    : "w-10 bg-blue-600 focus-visible:outline-blue-500"
                  : isDark
                  ? "w-3 bg-white/40 hover:bg-white/70 focus-visible:outline-blue-200"
                  : "w-3 bg-blue-300/70 hover:bg-blue-400 focus-visible:outline-blue-400"
              }`}
              aria-label={`Go to featured movie ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const HighlightCard = ({ title, description, icon: Icon, gradient, isDark }) => (
  <div
    className={`relative overflow-hidden rounded-3xl border p-8 transition hover:-translate-y-1 hover:shadow-2xl ${
      isDark ? "border-white/10 bg-white/5" : "border-blue-100 bg-white"
    }`}
  >
    <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} aria-hidden="true" />
    <div className="relative space-y-4">
      <div
        className={`inline-flex items-center justify-center rounded-xl p-3 ${
          isDark ? "bg-white/10 text-white" : "bg-blue-100 text-blue-600"
        }`}
      >
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className={isDark ? "text-gray-300" : "text-gray-600"}>{description}</p>
    </div>
  </div>
);

const AboutBadge = ({ title, description, icon: Icon, isDark }) => {
  const titleColor = isDark ? "text-white" : "text-gray-900";
  const descriptionColor = isDark ? "text-gray-300" : "text-gray-600";
  return (
    <div
      className={`h-full rounded-2xl border p-6 ${
        isDark ? "border-white/10 bg-white/5" : "border-blue-100 bg-white"
      }`}
    >
      <div
        className={`mb-4 inline-flex rounded-xl p-2 ${
          isDark ? "bg-white/10 text-blue-300" : "bg-blue-100 text-blue-600"
        }`}
      >
        <Icon className="h-5 w-5" />
      </div>
      <h3 className={`mb-2 text-lg font-semibold ${titleColor}`}>{title}</h3>
      <p className={`text-sm ${descriptionColor}`}>{description}</p>
    </div>
  );
};

const RoadmapStep = ({ step, title, description, isDark }) => {
  const titleColor = isDark ? "text-white" : "text-gray-900";
  const descriptionColor = isDark ? "text-gray-300" : "text-gray-600";
  return (
    <div
      className={`rounded-2xl border p-6 transition ${
        isDark ? "border-white/10 bg-white/5" : "border-blue-100 bg-white"
      }`}
    >
      <div
        className={`mb-4 inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${
          isDark ? "bg-white/10 text-blue-200" : "bg-blue-100 text-blue-600"
        }`}
      >
        Step {step}
      </div>
      <h4 className={`mb-2 text-lg font-semibold ${titleColor}`}>{title}</h4>
      <p className={`text-sm ${descriptionColor}`}>{description}</p>
    </div>
  );
};

export default Home;
