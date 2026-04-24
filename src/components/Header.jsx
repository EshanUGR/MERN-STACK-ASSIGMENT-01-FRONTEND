import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { to: "/", label: "Home" },
    { to: "/customers", label: "Customers" },
    { to: "/district-customers", label: "Lead Customers" },
    { to: "/items", label: "Safety Items" },
    { to: "/orders", label: "Orders" },
    { to: "/order-status", label: "Purchases" },
    { to: "/dashboard", label: "Insights" },
    { to: "/campaign", label: "Campaigns" },
  ];

  useEffect(() => {
    // Check if user is logged in (from localStorage or cookie)
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    // Close mobile menu after route changes.
    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleSignOut = () => {
    localStorage.removeItem("user"); // Remove user
    localStorage.removeItem("token");
    setUser(null);
    navigate("/sign-in"); // Redirect to login
  };

  return (
    <header className="sticky top-0 z-50 border-b border-cyan-100/20 bg-slate-950/95 backdrop-blur-xl shadow-[0_10px_35px_-18px_rgba(6,182,212,0.65)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <Link to="/" className="group flex items-center gap-3">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-emerald-400 text-slate-900 shadow-lg shadow-cyan-500/30">
              <span className="text-lg font-black tracking-tight">A</span>
            </div>
            <div>
              <p className="text-white text-lg font-extrabold leading-5 tracking-wide">
                Akila Suppliers
              </p>
              <p className="text-cyan-200/90 text-xs font-semibold uppercase tracking-[0.18em]">
                Safety Item Supplier
              </p>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  isActive(item.to)
                    ? "bg-cyan-400 text-slate-900 shadow"
                    : "text-slate-100 hover:bg-white/10"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <button
                onClick={handleSignOut}
                className="px-4 py-2 text-white border border-cyan-300/40 rounded-xl hover:bg-cyan-400/10 transition-all duration-200"
              >
                Sign Out
              </button>
            ) : (
              <>
                <Link
                  to="/sign-in"
                  className="px-4 py-2 text-white border border-cyan-300/40 rounded-xl hover:bg-cyan-400/10 transition-all duration-200"
                >
                  Sign In
                </Link>

                <Link
                  to="/sign-up"
                  className="px-4 py-2 bg-cyan-400 text-slate-900 rounded-xl font-semibold hover:bg-cyan-300 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="lg:hidden text-white p-2 rounded-lg hover:bg-white/10 transition"
            aria-label="Toggle navigation"
          >
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

        {isMenuOpen && (
          <div className="lg:hidden pb-4">
            <nav className="grid gap-2 rounded-2xl border border-white/10 bg-slate-900/90 p-3">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                    isActive(item.to)
                      ? "bg-cyan-400 text-slate-900"
                      : "text-slate-100 hover:bg-white/10"
                  }`}
                >
                  {item.label}
                </Link>
              ))}

              <div className="mt-2 grid gap-2 border-t border-white/10 pt-3 md:hidden">
                {user ? (
                  <button
                    onClick={handleSignOut}
                    className="w-full rounded-lg border border-cyan-300/40 px-3 py-2 text-left text-white hover:bg-cyan-400/10"
                  >
                    Sign Out
                  </button>
                ) : (
                  <>
                    <Link
                      to="/sign-in"
                      className="rounded-lg border border-cyan-300/40 px-3 py-2 text-white hover:bg-cyan-400/10"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/sign-up"
                      className="rounded-lg bg-cyan-400 px-3 py-2 text-slate-900 font-semibold hover:bg-cyan-300"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
