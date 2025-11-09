import { useTheme } from "../contexts/ThemeContext";

const AllMovies = () => {
  const { isDark } = useTheme();

  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <h1 className={`text-4xl font-bold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
        All Movies
      </h1>
      <p className={`text-lg ${isDark ? "text-gray-300" : "text-gray-700"}`}>
        Coming soon...
      </p>
    </div>
  );
};

export default AllMovies;

