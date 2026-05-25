import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Eye, Trash2, Pencil, Plus } from "lucide-react";
import api from "../api/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Dashboard() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  useEffect(() => {
    fetchMyAds();
  }, []);

  const fetchMyAds = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/ads/my-ads", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAds(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAd = async (id) => {
    try {
      setDeletingId(id);
      const token = localStorage.getItem("token");
      await api.delete(`/ads/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAds(ads.filter((ad) => ad.id !== id));
      setConfirmDeleteId(null);
    } catch (error) {
      console.error(error);
    } finally {
      setDeletingId(null);
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
            <h1 className="mt-2 text-4xl font-black tracking-tight">My Ads</h1>
          </div>

          <Link
            to="/post-ad"
            className="flex items-center gap-2 rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-black text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition"
          >
            <Plus size={16} />
            Post New Ad
          </Link>
        </div>

        {loading ? (
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
                <div className="h-56 w-full animate-pulse bg-slate-200" />
                <div className="p-5 space-y-3">
                  <div className="h-4 w-24 animate-pulse rounded-full bg-slate-200" />
                  <div className="h-6 w-3/4 animate-pulse rounded-xl bg-slate-200" />
                  <div className="h-7 w-1/3 animate-pulse rounded-xl bg-slate-200" />
                  <div className="h-4 w-1/4 animate-pulse rounded-xl bg-slate-200" />
                  <div className="mt-4 h-11 w-full animate-pulse rounded-2xl bg-slate-200" />
                </div>
              </div>
            ))}
          </div>
        ) : ads.length === 0 ? (
          <div className="mt-10 rounded-[2rem] border border-dashed border-slate-300 bg-white p-16 text-center">
            <h2 className="text-2xl font-black">You haven't posted any ads yet</h2>
            <p className="mt-3 font-semibold text-slate-500">
              Start selling by posting your first listing.
            </p>
            <Link
              to="/post-ad"
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-6 py-3 text-sm font-black text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition"
            >
              <Plus size={16} />
              Post Ad
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {ads.map((ad) => {
              const imageUrl =
                ad.images && ad.images.length > 0
                  ? ad.images[0]
                  : "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80";

              const priceText = ad.price && Number(ad.price) > 0
                ? `₹${Number(ad.price).toLocaleString("en-IN")}`
                : "Price on request";

              return (
                <div
                  key={ad.id}
                  className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <img
                    src={imageUrl}
                    alt={ad.title}
                    className="h-52 w-full object-cover"
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

                    <h2 className="mt-3 line-clamp-2 text-xl font-black">{ad.title}</h2>

                    <p className="mt-2 text-2xl font-black">{priceText}</p>

                    <div className="mt-3 flex items-center gap-2 text-sm font-bold text-slate-500">
                      <MapPin size={14} />
                      {ad.city}
                    </div>

                    <div className="mt-5 flex flex-col gap-2">
                      <Link
                        to={`/ads/${ad.id}`}
                        state={{ from: "/dashboard", label: "Back to dashboard" }}
                        className="flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white hover:bg-slate-800 transition"
                      >
                        <Eye size={16} />
                        View Details
                      </Link>

                      <Link
                        to={`/edit-ad/${ad.id}`}
                        className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 hover:bg-slate-50 transition"
                      >
                        <Pencil size={16} />
                        Edit Ad
                      </Link>

                      {confirmDeleteId === ad.id ? (
                        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
                          <p className="mb-3 text-center text-sm font-bold text-red-700">
                            Delete this ad permanently?
                          </p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setConfirmDeleteId(null)}
                              className="flex-1 rounded-xl border border-slate-200 bg-white py-2 text-sm font-black text-slate-600 hover:bg-slate-50 transition"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleDeleteAd(ad.id)}
                              disabled={deletingId === ad.id}
                              className="flex-1 rounded-xl bg-red-500 py-2 text-sm font-black text-white hover:bg-red-600 transition disabled:opacity-70"
                            >
                              {deletingId === ad.id ? "Deleting..." : "Yes, delete"}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDeleteId(ad.id)}
                          className="flex items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-black text-red-600 hover:bg-red-100 transition"
                        >
                          <Trash2 size={16} />
                          Delete Ad
                        </button>
                      )}
                    </div>
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
