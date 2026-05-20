import { Heart, MapPin, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

export default function ListingCard({ item }) {
 const [favorited, setFavorited] = useState(item.is_favorited || false);

  const handleFavorite = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first");
        return;
      }

      const response = await axios.post(
        "https://ustaadji-backend.onrender.com/api/favorites/toggle",
        {
          ad_id: item.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFavorited(response.data.favorited);
    } catch (error) {
      console.error(error);
      alert("Failed to update favorite");
    }
  };

  return (
    <motion.article
      whileHover={{ y: -6 }}
      className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:shadow-2xl"
    >
      <div className="relative h-56 overflow-hidden">
        <img
          src={item.image}
          alt={item.title}
          className="h-full w-full object-cover transition duration-500 hover:scale-105"
        />

        <button
          onClick={handleFavorite}
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-lg"
        >
          <Heart
            size={19}
            className={
              favorited
                ? "fill-red-500 text-red-500"
                : "text-slate-700"
            }
          />
        </button>

        <span className="absolute left-4 top-4 rounded-full bg-slate-950/85 px-3 py-1.5 text-xs font-black text-white">
          {item.tag}
        </span>
      </div>

      <div className="p-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
            {item.category}
          </span>

          <span className="text-xs font-bold text-slate-400">
            {item.time}
          </span>
        </div>

        <h4 className="line-clamp-2 text-lg font-black leading-6 text-slate-950">
          {item.title}
        </h4>

        <p className="mt-3 text-2xl font-black text-slate-950">
          {item.price}
        </p>

        <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-slate-500">
          <MapPin size={16} />
          {item.location}
        </div>

        <Link
          to={`/ads/${item.id}`}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-100 px-4 py-3 text-sm font-black text-slate-800 transition hover:bg-slate-950 hover:text-white"
        >
          View details
          <ChevronRight size={17} />
        </Link>
      </div>
    </motion.article>
  );
}