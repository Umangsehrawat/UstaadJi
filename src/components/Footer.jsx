import { Link } from "react-router-dom";
import { useState } from "react";

export default function Footer() {
  const [logoError, setLogoError] = useState(false);

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-3">
            {logoError ? (
              <div
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-black text-white"
                style={{ backgroundColor: "#152e4c" }}
              >
                U
              </div>
            ) : (
              <img
                src="/logo-icon.png"
                alt="Ustaadji"
                className="h-7 w-7 object-contain"
                onError={() => setLogoError(true)}
              />
            )}
            <p className="text-sm font-bold text-slate-600">
              © 2026{" "}
              <span style={{ color: "#152e4c" }}>Ustaad</span>
              <span style={{ color: "#fd5609" }}>ji</span>
              <span className="text-slate-500">.in — India's service marketplace</span>
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
