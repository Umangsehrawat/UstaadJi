import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Search,
  MapPin,
  Star,
  SlidersHorizontal,
  Car,
  Home as HomeIcon,
  Briefcase,
  Sofa,
  Smartphone,
  Wrench,
  Tv,
  Building2,
  GraduationCap,
  Hammer,
  SmartphoneCharging,
} from "lucide-react";
import { motion } from "framer-motion";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ListingCard from "../components/ListingCard";

const categories = [
  { name: "Jobs", icon: Briefcase, count: "820" },
  { name: "Services", icon: Wrench, count: "1.5k" },
  { name: "Rent / PG / Rooms", icon: HomeIcon, count: "1.2k" },
  { name: "Cars & Bikes", icon: Car, count: "2.4k" },
  { name: "Electronics", icon: Smartphone, count: "3.2k" },
  { name: "Furniture", icon: Sofa, count: "1.7k" },
  { name: "Home Appliances", icon: Tv, count: "640" },
  { name: "Real Estate", icon: Building2, count: "1.1k" },
  { name: "Tutors & Classes", icon: GraduationCap, count: "780" },
  { name: "Home Repair", icon: Hammer, count: "950" },
  { name: "Mobile Phones", icon: SmartphoneCharging, count: "2.8k" },
];

const filters = ["All", ...categories.map((cat) => cat.name)];

function SearchBox({ search, setSearch, city, setCity, handleSearch }) {
  return (
    <form
      onSubmit={handleSearch}
      className="mx-auto mt-8 grid max-w-5xl gap-3 rounded-3xl border border-white/70 bg-white/95 p-3 shadow-2xl backdrop-blur md:grid-cols-[1fr_220px_auto]"
    >
      <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-4">
        <Search className="text-slate-400" size={22} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent text-sm font-semibold text-slate-800 outline-none"
          placeholder="Search for mobiles, jobs, services..."
        />
      </div>

      <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-4">
        <MapPin className="text-slate-400" size={22} />
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full bg-transparent text-sm font-semibold text-slate-800 outline-none"
          placeholder="City or area"
        />
      </div>

      <button
        type="submit"
        className="rounded-2xl bg-emerald-500 px-8 py-4 text-sm font-black text-white shadow-lg transition hover:bg-emerald-600"
      >
        Search
      </button>
    </form>
  );
}

function Hero({ search, setSearch, city, setCity, handleSearch }) {
  return (
    <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,#d1fae5,transparent_34%),linear-gradient(135deg,#f8fafc_0%,#eef2ff_55%,#ecfeff_100%)]">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="mx-auto max-w-4xl text-center"
        >
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/70 px-4 py-2 text-sm font-bold text-emerald-700 shadow-sm">
            <Star size={16} fill="currentColor" />
            Trusted local marketplace for India
          </div>

          <h1 className="text-5xl font-black tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
            Buy. Sell. Discover. <br />
            <span className="text-emerald-500">All near you.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg font-medium leading-8 text-slate-600">
            Ustaadji helps you discover jobs, services, rentals, electronics,
            furniture, vehicles, and local opportunities across India.
          </p>
        </motion.div>

        <SearchBox
          search={search}
          setSearch={setSearch}
          city={city}
          setCity={setCity}
          handleSearch={handleSearch}
        />
      </div>
    </section>
  );
}

function CategoriesSection({ onCategoryClick }) {
  return (
    <section
      id="categories"
      className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
    >
      <div className="mb-8">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-600">
          Explore
        </p>

        <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
          Browse by category
        </h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((cat) => {
          const Icon = cat.icon;

          return (
            <motion.button
              whileHover={{ y: -5 }}
              key={cat.name}
              onClick={() => onCategoryClick(cat.name)}
              className="group cursor-pointer rounded-3xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:border-emerald-200 hover:shadow-xl"
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-800 transition group-hover:bg-emerald-500 group-hover:text-white">
                <Icon size={26} />
              </div>

              <h3 className="text-lg font-black text-slate-950">
                {cat.name}
              </h3>

              <p className="mt-1 text-sm font-semibold text-slate-500">
                {cat.count} active listings
              </p>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}

function ListingsSection({
  search,
  city,
  searchTrigger,
  activeCategory,
  setActiveCategory,
}) {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        setLoading(true);

        const response = await axios.get("https://ustaadji-backend.onrender.com/api/ads", {
          params: { search, city },
        });

        const formattedAds = response.data.map((ad) => ({
          id: ad.id,
          title: ad.title,
          category: ad.category_name,
          price: ad.price
            ? `₹${Number(ad.price).toLocaleString("en-IN")}`
            : "Price not listed",
          location: ad.location ? `${ad.city} • ${ad.location}` : ad.city,
          time: "Just now",
          image:
            ad.images && ad.images.length > 0
              ? `https://ustaadji-backend.onrender.com${ad.images[0]}`
              : "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=900&q=80",
          tag: "New listing",
          is_favorited: ad.is_favorited,
        }));

        setListings(formattedAds);
      } catch (error) {
        console.error("Failed to fetch ads:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAds();
  }, [searchTrigger]);

  const filteredListings = useMemo(() => {
    if (activeCategory === "All") return listings;
    return listings.filter((item) => item.category === activeCategory);
  }, [activeCategory, listings]);

  return (
    <section id="browse" className="bg-slate-50 py-16">
      <div
        id="featured-listings"
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-600">
              Fresh finds
            </p>

            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Featured listings
            </h2>
          </div>

          <button className="flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm">
            <SlidersHorizontal size={17} />
            Filters
          </button>
        </div>

        <div className="mb-8 flex gap-3 overflow-x-auto pb-2">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveCategory(filter)}
              className={`whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-black transition ${
                activeCategory === filter
                  ? "bg-slate-950 text-white"
                  : "bg-white text-slate-600 hover:bg-slate-100"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="py-10 text-center text-lg font-black">
            Loading listings...
          </p>
        ) : filteredListings.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-12 text-center">
            <h3 className="text-2xl font-black">No listings found</h3>
            <p className="mt-2 text-sm font-semibold text-slate-500">
              Try another search, city, or category.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredListings.map((item) => (
              <ListingCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [searchTrigger, setSearchTrigger] = useState(0);
  const [activeCategory, setActiveCategory] = useState("All");

  const scrollToListings = () => {
    setTimeout(() => {
      const featuredSection = document.getElementById("featured-listings");
      featuredSection?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setActiveCategory("All");
    setSearchTrigger((prev) => prev + 1);
    scrollToListings();
  };

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    scrollToListings();
  };

  return (
    <main className="min-h-screen bg-white font-sans text-slate-950">
      <Navbar />

      <Hero
        search={search}
        setSearch={setSearch}
        city={city}
        setCity={setCity}
        handleSearch={handleSearch}
      />

      <CategoriesSection onCategoryClick={handleCategoryClick} />

      <ListingsSection
        search={search}
        city={city}
        searchTrigger={searchTrigger}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />

      <Footer />
    </main>
  );
}