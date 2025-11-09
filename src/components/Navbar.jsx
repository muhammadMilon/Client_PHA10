import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, LogOut, Sun, Moon } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { toast } from "react-toastify";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const { user, signOut } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const profileRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    if (isProfileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileOpen]);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Successfully logged out!");
      setIsProfileOpen(false);
      navigate("/");
    } catch (error) {
      toast.error("Error signing out. Please try again.");
      console.error("Error signing out:", error);
    }
  };

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/all-movies", label: "All Movies" },
    { path: "/my-collection", label: "My Collection", protected: true },
  ];

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className={`${isDark ? 'bg-slate-900 text-white' : 'bg-white text-gray-900'} shadow-lg sticky top-0 z-50 transition-colors`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-3 cursor-pointer">
            <img
              src="/assets/logo.jpg"
              alt="Logo"
              className="w-10 h-10 rounded-full object-cover border-2"
            />
            <span className="text-2xl font-bold">MovieMaster</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              if (item.protected && !user) return null;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive(item.path)
                      ? isDark
                        ? "bg-slate-700 text-white"
                        : "bg-gray-200 text-gray-900"
                      : isDark
                      ? "text-gray-300 hover:bg-slate-800 hover:text-white"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg border transition-colors ${
                isDark
                  ? "border-gray-600 text-gray-300 hover:bg-slate-700 hover:text-white"
                  : "border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              }`}
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            {user ? (
              <div
                ref={profileRef}
                className="relative"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
              >
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className={`flex items-center space-x-2 px-2 py-2 rounded-full transition-colors ${
                    isDark
                      ? "hover:bg-slate-800"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || user.email}
                      className={`w-8 h-8 rounded-full border-2 object-cover ${
                        isDark ? "border-gray-600" : "border-gray-300"
                      }`}
                    />
                  ) : (
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                      isDark
                        ? "bg-slate-700 text-white"
                        : "bg-gray-200 text-gray-900"
                    }`}>
                      {user.displayName?.[0]?.toUpperCase() ||
                        user.email?.[0]?.toUpperCase() ||
                        "U"}
                    </div>
                  )}
                </button>
                {/* Tooltip on hover - only show when dropdown is not open */}
                {showTooltip && !isProfileOpen && (
                  <div className="absolute right-0 bottom-full mb-2 z-50">
                    <div className={`text-sm px-3 py-2 rounded-lg whitespace-nowrap shadow-lg border z-50 ${
                      isDark
                        ? "bg-slate-800 text-white border-slate-700"
                        : "bg-white text-gray-900 border-gray-200"
                    }`}>
                      {user.displayName || user.email}
                    </div>
                    <div className={`absolute right-4 top-full -mt-1 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent ${
                      isDark ? "border-t-slate-800" : "border-t-white"
                    }`}></div>
                  </div>
                )}
                {/* Dropdown menu */}
                {isProfileOpen && (
                  <div className={`absolute right-0 mt-2 w-48 rounded-lg shadow-xl py-2 border z-50 ${
                    isDark
                      ? "bg-slate-800 border-slate-700"
                      : "bg-white border-gray-200"
                  }`}>
                    <div className={`px-4 py-2 border-b ${
                      isDark ? "border-slate-700" : "border-gray-200"
                    }`}>
                      <p className={`text-sm font-medium ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}>
                        {user.displayName || "User"}
                      </p>
                      <p className={`text-xs truncate ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}>
                        {user.email}
                      </p>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className={`w-full px-4 py-2 text-left flex items-center space-x-2 transition-colors ${
                        isDark
                          ? "hover:bg-slate-700 text-gray-300"
                          : "hover:bg-gray-100 text-gray-700"
                      }`}
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className={`px-6 py-2 rounded-lg border transition-colors font-medium ${
                    isDark
                      ? "border-gray-600 text-gray-300 hover:bg-slate-700 hover:text-white"
                      : "border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className={`px-6 py-2 rounded-lg transition-colors font-medium ${
                    isDark
                      ? "bg-slate-700 text-white hover:bg-slate-600"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          <button
            className={`md:hidden ${isDark ? "text-white" : "text-gray-900"}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className={`md:hidden border-t transition-colors ${
          isDark
            ? "bg-slate-800 border-slate-700"
            : "bg-white border-gray-200"
        }`}>
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => {
              if (item.protected && !user) return null;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive(item.path)
                      ? isDark
                        ? "bg-slate-700 text-white"
                        : "bg-gray-200 text-gray-900"
                      : isDark
                      ? "text-gray-300 hover:bg-slate-700 hover:text-white"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            {user ? (
              <>
                <div className={`px-3 py-2 border-t mt-2 pt-3 ${
                  isDark ? "border-slate-700" : "border-gray-200"
                }`}>
                  <div className="flex items-center space-x-2 mb-2">
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.displayName || user.email}
                        className={`w-8 h-8 rounded-full border-2 object-cover ${
                          isDark ? "border-gray-600" : "border-gray-300"
                        }`}
                      />
                    ) : (
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                        isDark
                          ? "bg-slate-700 text-white"
                          : "bg-gray-200 text-gray-900"
                      }`}>
                        {user.displayName?.[0]?.toUpperCase() ||
                          user.email?.[0]?.toUpperCase() ||
                          "U"}
                      </div>
                    )}
                    <div>
                      <p className={`text-sm font-medium ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}>
                        {user.displayName || "User"}
                      </p>
                      <p className={`text-xs truncate ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}>
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className={`w-full text-left px-3 py-2 rounded-md text-base font-medium flex items-center space-x-2 transition-colors ${
                      isDark
                        ? "text-gray-300 hover:bg-slate-700 hover:text-white"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className={`pt-2 border-t mt-2 space-y-2 ${
                isDark ? "border-slate-700" : "border-gray-200"
              }`}>
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className={`block w-full px-3 py-2 rounded-md border font-medium text-center transition-colors ${
                    isDark
                      ? "border-gray-600 text-gray-300 hover:bg-slate-700 hover:text-white"
                      : "border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className={`block w-full px-3 py-2 rounded-md font-medium text-center transition-colors ${
                    isDark
                      ? "bg-slate-700 text-white hover:bg-slate-600"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  Register
                </Link>
              </div>
            )}
            {/* Theme Toggle Button - Mobile */}
            <div className={`px-3 py-2 border-t mt-2 ${
              isDark ? "border-slate-700" : "border-gray-200"
            }`}>
              <button
                onClick={toggleTheme}
                className={`flex items-center justify-center w-full px-3 py-2 rounded-md border font-medium transition-colors ${
                  isDark
                    ? "border-gray-600 text-gray-300 hover:bg-slate-700 hover:text-white"
                    : "border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                }`}
                aria-label="Toggle theme"
              >
                {isDark ? (
                  <>
                    <Sun className="w-5 h-5 mr-2" />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-5 h-5 mr-2" />
                    <span>Dark Mode</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
