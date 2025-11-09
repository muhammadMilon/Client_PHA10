import React from "react";
import { Link } from "react-router-dom";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo,
    });
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  getTheme = () => {
    // Read theme from localStorage, default to 'dark'
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") || "dark";
    }
    return "dark";
  };

  render() {
    if (this.state.hasError) {
      const theme = this.getTheme();
      const isDark = theme === "dark";

      return (
        <div
          className={`min-h-screen flex flex-col items-center justify-center px-4 py-8 ${
            isDark ? "bg-slate-950 text-white" : "bg-gray-50 text-gray-900"
          }`}
        >
          <div className="max-w-2xl mx-auto text-center">
            <img
              src="/assets/error-404.png"
              alt="Error"
              className="w-full max-w-md mx-auto mb-8"
            />
            <h1
              className={`text-4xl md:text-6xl font-bold mb-4 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Something Went Wrong
            </h1>
            <h2
              className={`text-2xl md:text-3xl font-semibold mb-4 ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              An Unexpected Error Occurred
            </h2>
            <p
              className={`text-lg mb-8 ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              We're sorry for the inconvenience. Please try refreshing the page
              or return to the homepage.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.location.reload()}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  isDark
                    ? "bg-slate-700 text-white hover:bg-slate-600"
                    : "bg-gray-700 text-white hover:bg-gray-800"
                }`}
              >
                Refresh Page
              </button>
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
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

