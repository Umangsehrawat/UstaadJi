import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { MapPin, Eye, Trash2, Pencil } from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Dashboard() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyAds();
  }, []);

  const fetchMyAds = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "https://ustaadji-backend.onrender.com/api/ads/my-ads",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAds(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAd = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this ad?"
  );

  if (!confirmDelete) return;

  try {
    const token = localStorage.getItem("token");

    await axios.delete(`https://ustaadji-backend.onrender.com/api/ads/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setAds(ads.filter((ad) => ad.id !== id));
    alert("Ad deleted successfully");
  } catch (error) {
    console.error(error);
    alert(error.response?.data?.message || "Failed to delete ad");
  }
};

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <Navbar />

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.3em] text-emerald-500">
              Dashboard
            </p>

            <h1 className="mt-2 text-4xl font-black tracking-tight">
              My Ads
            </h1>
          </div>

          <Link
            to="/post-ad"
            className="rounded-2xl bg-slate-950 px-6 py-3 text-sm font-black text-white hover:bg-slate-800"
          >
            + Post New Ad
          </Link>
        </div>

        {loading ? (
          <div className="py-20 text-center">
            <p className="text-xl font-black">Loading your ads...</p>
          </div>
        ) : ads.length === 0 ? (
          <div className="mt-10 rounded-[2rem] border border-dashed border-slate-300 bg-white p-16 text-center">
            <h2 className="text-2xl font-black">
              You haven’t posted any ads yet
            </h2>

            <p className="mt-3 text-slate-500">
              Start selling by posting your first listing.
            </p>

            <Link
              to="/post-ad"
              className="mt-6 inline-block rounded-2xl bg-emerald-500 px-6 py-3 text-sm font-black text-white hover:bg-emerald-600"
            >
              Post Ad
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {ads.map((ad) => {
              const imageUrl =
                ad.images && ad.images.length > 0
                  ? `https://ustaadji-backend.onrender.com${ad.images[0]}`
                  : "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80";

              return (
                <div
                  key={ad.id}
                  className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <img
                    src={imageUrl}
                    alt={ad.title}
                    className="h-64 w-full object-cover"
                  />

                  <div className="p-5">
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
                        {ad.category_name}
                      </span>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-black ${
                          ad.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {ad.status}
                      </span>
                    </div>

                    <h2 className="mt-4 line-clamp-2 text-2xl font-black">
                      {ad.title}
                    </h2>

                    <p className="mt-3 text-3xl font-black">
                      ₹{Number(ad.price || 0).toLocaleString("en-IN")}
                    </p>

                    <div className="mt-4 flex items-center gap-2 text-sm font-bold text-slate-500">
                      <MapPin size={16} />
                      {ad.city}
                    </div>

                    <Link
  to={`/ads/${ad.id}`}
  state={{ from: "/dashboard", label: "Back to dashboard" }}
  className="mt-6 flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-4 text-sm font-black text-white hover:bg-slate-800"
>
  <Eye size={18} />
  View Details
</Link>
<Link
  to={`/edit-ad/${ad.id}`}
  className="mt-3 flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-black text-slate-700 hover:bg-slate-50"
>
  <Pencil size={18} />
  Edit Ad
</Link>
<button
  onClick={() => handleDeleteAd(ad.id)}
  className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-black text-red-600 hover:bg-red-100"
>
  <Trash2 size={18} />
  Delete Ad
</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}