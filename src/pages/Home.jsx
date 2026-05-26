import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Search, MapPin, SlidersHorizontal, ShieldCheck, CreditCard, UserCheck, MessageCircleWarning, Eye, BadgeCheck } from "lucide-react";
import { motion } from "framer-motion";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ListingCard from "../components/ListingCard";

const services = [
  {
    name: "Appliance Repair",
    image: "https://samedayrepair.ca/wp-content/uploads/2022/03/whirlpool-repair-winnipeg.jpg",
  },
  {
    name: "Brick & Masonry",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Carpentry & Woodwork",
    image: "https://4-hontario.ca/wp-content/uploads/2020/09/Woodworking-L2_Main-Image-1920x1080.jpeg",
  },
  {
    name: "Electrician",
    image: "https://images.unsplash.com/photo-1555963966-b7ae5404b6ed?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Excavation & Demolition",
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Air Conditioning",
    image: "https://www.daikinmea.com/en_us/knowledge-center/how-often-should-you-service-your-ac-unit/_jcr_content/image21.coreimg.jpeg/1759163315470/service-your-ac-unit.jpeg",
  },
  {
    name: "Painters & Painting",
    image: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Plumbing",
    image: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Renovations",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Welding",
    image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Windows & Doors",
    image: "https://airtasker-seo-assets-prod.s3.amazonaws.com/en_AU/1636069155327_windows_and_doors_parent.jpg",
  },
  {
    name: "Deep Cleaning",
    image: "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Marble & Tilework",
    image: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Wifi / CCTV / Smart Door",
    image: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Other Services",
    image: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&w=400&q=80",
  },
];

const filters = ["All", ...services.map((s) => s.name)];


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
          placeholder="Search for painters, plumbers, electricians..."
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
          {/* Brand logo lockup */}
          <div className="mx-auto mb-8 flex items-center justify-center gap-4">
            <img
              src="/logo-icon.png"
              alt="Ustaadji"
              className="h-16 w-16 object-contain sm:h-20 sm:w-20"
              onError={(e) => e.currentTarget.style.display = "none"}
            />
            <div className="text-left">
              <div className="text-5xl font-black leading-none sm:text-6xl lg:text-7xl">
                <span style={{ color: "#152e4c" }}>Ustaad</span>
                <span style={{ color: "#fd5609" }}>ji</span>
              </div>
              <p
                className="mt-1 text-[11px] font-black uppercase tracking-[0.25em]"
                style={{ color: "#fd5609" }}
              >
                — Skilled Experts. Reliable Service. —
              </p>
            </div>
          </div>

          <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
            Find trusted experts.<br />
            <span className="text-emerald-500">Right near you.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg font-medium leading-8 text-slate-600">
            Ustaadji connects you with skilled local service professionals —
            plumbers, electricians, painters, cleaners, and more across India.
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

function ServicesSection({ onServiceClick }) {
  return (
    <section
      id="categories"
      className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
    >
      <div className="mb-10">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-600">
          Explore
        </p>
        <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
          Browse by service
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {services.map((service) => (
          <motion.button
            whileHover={{ y: -4, scale: 1.02 }}
            key={service.name}
            onClick={() => onServiceClick(service.name)}
            className="group cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-sm transition hover:border-emerald-300 hover:shadow-lg"
          >
            <div className="h-32 overflow-hidden bg-slate-100">
              <img
                src={service.image}
                alt={service.name}
                className="h-full w-full object-cover transition duration-300 group-hover:scale-110"
              />
            </div>
            <div className="p-3">
              <h3 className="text-sm font-black leading-tight text-slate-900">
                {service.name}
              </h3>
            </div>
          </motion.button>
        ))}
      </div>
    </section>
  );
}

const safetyTips = [
  {
    icon: UserCheck,
    title: "Verify before you hire",
    desc: "Ask the professional for their ID, previous work photos, or references before hiring.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: CreditCard,
    title: "Never pay 100% upfront",
    desc: "Pay only a small advance. Release the full payment only after the work is completed to your satisfaction.",
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: Eye,
    title: "Be present during the work",
    desc: "Stay at home or have a trusted person present while the service professional is working.",
    color: "bg-purple-50 text-purple-600",
  },
  {
    icon: BadgeCheck,
    title: "Check reviews & ratings",
    desc: "Read reviews from other customers before hiring. Prefer professionals with verified work history.",
    color: "bg-orange-50 text-orange-600",
  },
  {
    icon: ShieldCheck,
    title: "Use traceable payments",
    desc: "Pay via UPI, bank transfer or other digital methods. Avoid large cash transactions.",
    color: "bg-teal-50 text-teal-600",
  },
  {
    icon: MessageCircleWarning,
    title: "Report suspicious listings",
    desc: "If a listing seems too cheap, fake, or suspicious — report it immediately using the Report button.",
    color: "bg-red-50 text-red-600",
  },
];

function SafetySection() {
  return (
    <section id="safety" className="py-20" style={{ backgroundColor: "#152e4c" }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold text-emerald-400">
            <ShieldCheck size={16} />
            Your safety matters
          </div>
          <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
            Stay safe on Ustaadji
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base font-medium text-slate-400">
            Follow these simple guidelines to have a safe and hassle-free experience hiring service professionals.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {safetyTips.map((tip) => {
            const Icon = tip.icon;
            return (
              <motion.div
                key={tip.title}
                whileHover={{ y: -4 }}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur transition hover:border-emerald-500/40 hover:bg-white/10"
              >
                <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl ${tip.color}`}>
                  <Icon size={22} />
                </div>
                <h3 className="text-base font-black text-white">{tip.title}</h3>
                <p className="mt-2 text-sm font-medium leading-relaxed text-slate-400">{tip.desc}</p>
              </motion.div>
            );
          })}
        </div>

        <p className="mt-10 text-center text-sm font-semibold text-slate-500">
          Something wrong?{" "}
          <a href="mailto:ustaadji.info@gmail.com" className="text-emerald-400 hover:underline">
            Contact our support team
          </a>
        </p>
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
              ? ad.images[0]
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
              Try another search, city, or service type.
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

  const handleServiceClick = (serviceName) => {
    setActiveCategory(serviceName);
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

      <ServicesSection onServiceClick={handleServiceClick} />

      <ListingsSection
        search={search}
        city={city}
        searchTrigger={searchTrigger}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />

      <SafetySection />

      <Footer />
    </main>
  );
}
