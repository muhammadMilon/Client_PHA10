import { Link } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";

const NotFound = () => {
  const { isDark } = useTheme();

  return (
    <div
      className={`min-h-[80vh] flex flex-col items-center justify-center px-4 py-8 ${
        isDark ? "bg-slate-950 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="max-w-2xl mx-auto text-center">
        <img
          src="/assets/error-404.png"
          alt="404 Error"
          className="w-full max-w-md mx-auto mb-8"
        />
        <h1
          className={`text-4xl md:text-6xl font-bold mb-4 ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          404
        </h1>
        <h2
          className={`text-2xl md:text-3xl font-semibold mb-4 ${
            isDark ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Page Not Found
        </h2>
        <p
          className={`text-lg mb-8 ${
            isDark ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Oops! The page you're looking for doesn't exist. It might have been
          moved or deleted.
        </p>
        <Link
          to="/"
          className={`inline-block px-6 py-3 rounded-lg font-medium transition-colors ${
            isDark
              ? "bg-slate-700 text-white hover:bg-slate-600"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
