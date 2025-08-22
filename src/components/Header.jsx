import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in (from localStorage or cookie)
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const isActive = (path) => location.pathname === path;

  const handleSignOut = () => {
    localStorage.removeItem("user"); // Remove user
    setUser(null);
    navigate("/sign-in"); // Redirect to login
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-blue-600 font-bold text-lg">S</span>
            </div>
            <span className="text-white text-xl font-bold">
              SalesApp-Ravindu Eshan's
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                isActive("/")
                  ? "bg-white text-blue-600 shadow-md"
                  : "text-white hover:bg-white/20 hover:text-white"
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/customers"
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                isActive("/customers")
                  ? "bg-white text-blue-600 shadow-md"
                  : "text-white hover:bg-white/20 hover:text-white"
              }`}
            >
              Customers
            </Link>
            <Link
              to="/items"
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                isActive("/items")
                  ? "bg-white text-blue-600 shadow-md"
                  : "text-white hover:bg-white/20 hover:text-white"
              }`}
            >
              Items
            </Link>
            <Link
              to="/orders"
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                isActive("/orders")
                  ? "bg-white text-blue-600 shadow-md"
                  : "text-white hover:bg-white/20 hover:text-white"
              }`}
            >
              Orders
            </Link>
            <Link
              to="/orders"
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                isActive("/dashboard")
                  ? "bg-white text-blue-600 shadow-md"
                  : "text-white hover:bg-white/20 hover:text-white"
              }`}
            >
              Dashboard
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-3">
            {user ? (
              <button
                onClick={handleSignOut}
                className="px-4 py-2 text-white border border-white/30 rounded-lg hover:bg-white/10 transition-all duration-200"
              >
                Sign Out
              </button>
            ) : (
              <>
                <Link
                  to="/sign-in"
                  className="px-4 py-2 text-white border border-white/30 rounded-lg hover:bg-white/10 transition-all duration-200"
                >
                  Sign In
                </Link>

                <Link
                  to="/sign-up"
                  className="px-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-100 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button (optional) */}
          <button className="md:hidden text-white p-2">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
