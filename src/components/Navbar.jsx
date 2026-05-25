import { Link, useNavigate, useLocation } from "react-router-dom";
import { Plus, MessageSquare, Heart, LayoutDashboard, LogOut, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("user")); } catch { return null; }
  });
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const response = await axios.get(
          "https://ustaadji-backend.onrender.com/api/chat/unread-count",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUnreadCount(response.data.unread_count);
      } catch (_) {}
    };
    fetchUnreadCount();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
    window.location.reload();
  };

  const isActive = (path) => location.pathname === path;

  const navLinkClass = (path) =>
    `flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition ${
      isActive(path)
        ? "bg-emerald-50 text-emerald-700"
        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00072d] text-lg font-black text-white shadow">
            U
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-black leading-none text-[#00072d]">Ustaadji</h1>
            <p className="mt-0.5 text-xs font-medium text-slate-400">India's service marketplace</p>
          </div>
        </Link>

        {/* Nav links */}
        <nav className="hidden items-center gap-1 md:flex">
          <a href="/#browse" className="px-3 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition">
            Browse
          </a>
          <a href="/#categories" className="px-3 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition">
            Services
          </a>
          <a href="/#safety" className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition">
            <ShieldCheck size={14} />
            Safety
          </a>

          <div className="mx-2 h-5 w-px bg-slate-200" />

          <Link to="/dashboard" className={navLinkClass("/dashboard")}>
            <LayoutDashboard size={14} />
            Dashboard
          </Link>

          <Link to="/messages" className={`${navLinkClass("/messages")} relative`}>
            <MessageSquare size={14} />
            Messages
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-black text-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Link>

          <Link to="/favorites" className={navLinkClass("/favorites")}>
            <Heart size={14} />
            Favorites
          </Link>

          {user?.role === "admin" && (
            <Link to="/admin" className="px-3 py-2 rounded-xl text-sm font-semibold text-emerald-600 hover:bg-emerald-50 transition">
              Admin
            </Link>
          )}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              {/* Avatar + name */}
              <div className="hidden lg:flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-xs font-black text-white">
                  {user.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <span className="max-w-[100px] truncate text-sm font-semibold text-slate-700">
                  {user.name}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold text-slate-400 transition hover:bg-red-50 hover:text-red-500"
              >
                <LogOut size={14} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
            >
              Login
            </Link>
          )}

          <Link
            to="/post-ad"
            className="flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-black text-white shadow-md shadow-emerald-500/25 transition hover:bg-emerald-600 hover:shadow-emerald-500/40"
          >
            <Plus size={16} />
            <span>Post Ad</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
