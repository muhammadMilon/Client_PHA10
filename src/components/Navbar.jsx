import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, LogOut } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const { user, signOut } = useAuth();
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
    <nav className="bg-slate-900 text-white shadow-lg sticky top-0 z-50">
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
                      ? "bg-slate-700 text-white"
                      : "text-gray-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div
                ref={profileRef}
                className="relative"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
              >
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 px-2 py-2 rounded-full hover:bg-slate-800 transition-colors"
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || user.email}
                      className="w-8 h-8 rounded-full border-2 border-gray-600 object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white font-semibold">
                      {user.displayName?.[0]?.toUpperCase() ||
                        user.email?.[0]?.toUpperCase() ||
                        "U"}
                    </div>
                  )}
                </button>
                {/* Tooltip on hover - only show when dropdown is not open */}
                {showTooltip && !isProfileOpen && (
                  <div className="absolute right-0 bottom-full mb-2 z-50">
                    <div className="bg-slate-800 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap shadow-lg border border-slate-700">
                      {user.displayName || user.email}
                    </div>
                    <div className="absolute right-4 top-full -mt-1 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-800"></div>
                  </div>
                )}
                {/* Dropdown menu */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-lg shadow-xl py-2 border border-slate-700 z-50">
                    <div className="px-4 py-2 border-b border-slate-700">
                      <p className="text-sm font-medium text-white">
                        {user.displayName || "User"}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {user.email}
                      </p>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="w-full px-4 py-2 text-left hover:bg-slate-700 flex items-center space-x-2 text-gray-300"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="px-6 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-slate-700 hover:text-white transition-colors font-medium"
              >
                Login
              </Link>
            )}
          </div>

          <button
            className="md:hidden text-white"
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
        <div className="md:hidden bg-slate-800 border-t border-slate-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => {
              if (item.protected && !user) return null;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                    isActive(item.path)
                      ? "bg-slate-700 text-white"
                      : "text-gray-300 hover:bg-slate-700 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            {user ? (
              <>
                <div className="px-3 py-2 border-t border-slate-700 mt-2 pt-3">
                  <div className="flex items-center space-x-2 mb-2">
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.displayName || user.email}
                        className="w-8 h-8 rounded-full border-2 border-gray-600 object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white font-semibold">
                        {user.displayName?.[0]?.toUpperCase() ||
                          user.email?.[0]?.toUpperCase() ||
                          "U"}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-white">
                        {user.displayName || "User"}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-slate-700 hover:text-white flex items-center space-x-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="pt-2 border-t border-slate-700 mt-2">
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full px-3 py-2 rounded-md border border-gray-600 text-gray-300 hover:bg-slate-700 hover:text-white font-medium text-center"
                >
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
