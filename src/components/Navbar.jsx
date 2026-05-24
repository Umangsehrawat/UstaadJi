import { Link, useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";

function Navbar() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) return;

        const response = await axios.get(
          "https://ustaadji-backend.onrender.com/api/chat/unread-count",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUnreadCount(response.data.unread_count);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUnreadCount();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    alert("Logged out successfully");

    navigate("/");
    window.location.reload();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-5">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#00072d] text-2xl font-bold text-white">
            U
          </div>

          <div>
            <h1 className="text-2xl font-black text-[#00072d]">
              Ustaadji
            </h1>

            <p className="text-sm text-gray-500">
              India’s local marketplace
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 font-semibold text-[#00072d] md:flex">
          <a href="/#browse">Browse</a>

          <a href="/#categories">Categories</a>

          <a href="/#safety">Safety</a>

          <Link to="/dashboard">Dashboard</Link>

          <Link
            to="/messages"
            className="relative font-semibold hover:text-emerald-600"
          >
            Messages

            {unreadCount > 0 && (
              <span className="ml-2 rounded-full bg-red-500 px-2 py-0.5 text-xs font-black text-white">
                {unreadCount}
              </span>
            )}
          </Link>

          <Link
            to="/favorites"
            className="font-semibold hover:text-emerald-600"
          >
            Favorites
          </Link>
          {user?.role === "admin" && (
  <Link to="/admin" className="font-semibold hover:text-emerald-600">
    Admin
  </Link>
)}
        </nav>

        <div className="flex items-center gap-5">
          {user ? (
            <>
              <p className="hidden lg:block font-semibold text-[#00072d]">
  Hello, {user.name}
</p>

              <button
                onClick={handleLogout}
                className="font-semibold text-red-500"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="font-semibold text-[#00072d]"
            >
              Login
            </Link>
          )}

          <Link
            to="/post-ad"
            className="flex items-center gap-2 rounded-2xl bg-[#00072d] px-6 py-3 font-bold text-white shadow-lg transition hover:bg-black"
          >
            <Plus size={18} />
            Post Ad
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Navbar;