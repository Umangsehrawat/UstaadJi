import { Link } from "react-router-dom";
import { Home, Search } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <Navbar />

      <section className="mx-auto max-w-2xl px-4 py-32 text-center">
        <p className="text-[120px] font-black leading-none text-slate-200 select-none">404</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight">Page not found</h1>
        <p className="mt-4 text-lg font-semibold text-slate-500">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/"
            className="flex items-center gap-2 rounded-2xl bg-emerald-500 px-6 py-3 font-black text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition"
          >
            <Home size={16} />
            Back to Home
          </Link>
          <Link
            to="/#browse"
            className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-3 font-black text-slate-700 hover:bg-slate-50 transition"
          >
            <Search size={16} />
            Browse Services
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
