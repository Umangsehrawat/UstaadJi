export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 px-4 py-8 text-sm font-semibold text-slate-500 sm:px-6 md:flex-row lg:px-8">
        <p>© 2026 Ustaadji.in — India’s local marketplace.</p>

        <div className="flex gap-5">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Support</a>
        </div>
      </div>
    </footer>
  );
}