import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#00072d] text-sm font-black text-white">
              U
            </div>
            <p className="text-sm font-bold text-slate-600">
              © 2026 Ustaadji.in — India's service marketplace
            </p>
          </div>

          <div className="flex gap-6 text-sm font-semibold text-slate-500">
            <Link to="/privacy" className="hover:text-slate-900 transition">Privacy</Link>
            <Link to="/terms" className="hover:text-slate-900 transition">Terms</Link>
            <Link to="/support" className="hover:text-slate-900 transition">Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
