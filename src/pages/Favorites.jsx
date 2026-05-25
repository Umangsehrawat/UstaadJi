import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ListingCard from "../components/ListingCard";

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get("https://ustaadji-backend.onrender.com/api/favorites", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const formattedFavorites = response.data.map((ad) => ({
        id: ad.id,
        title: ad.title,
        category: ad.category_name,
        price: ad.price
          ? `₹${Number(ad.price).toLocaleString("en-IN")}`
          : "Price not listed",
        location: ad.location ? `${ad.city} • ${ad.location}` : ad.city,
        time: "Saved ad",
        image:
          ad.images && ad.images.length > 0
            ? ad.images[0]
            : "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=900&q=80",
        tag: "Saved",
        is_favorited: true,
      }));

      setFavorites(formattedFavorites);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <Navbar />

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-10">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-600">
            Saved ads
          </p>

          <h1 className="mt-2 text-4xl font-black tracking-tight">
            My Favorites
          </h1>

          <p className="mt-3 font-semibold text-slate-500">
            Listings you saved will appear here.
          </p>
        </div>

        {loading ? (
          <p className="text-lg font-black">Loading favorites...</p>
        ) : favorites.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-14 text-center">
            <h2 className="text-2xl font-black">No favorites yet</h2>
            <p className="mt-2 font-semibold text-slate-500">
              Click the heart icon on listings to save them.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {favorites.map((item) => (
              <ListingCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}