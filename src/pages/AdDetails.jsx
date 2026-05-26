import { useEffect, useState } from "react";
import { useParams, Link, useLocation, useNavigate } from "react-router-dom";
import { MapPin, ArrowLeft, Phone, ShieldCheck, Flag, X, Share2, Check } from "lucide-react";
import api from "../api/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function AdDetails() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState("");

  // Report modal
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportMessage, setReportMessage] = useState("");
  const [reportLoading, setReportLoading] = useState(false);
  const [reportError, setReportError] = useState("");
  const [reportSuccess, setReportSuccess] = useState(false);

  // Message error banner
  const [messageError, setMessageError] = useState("");

  // Share
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title: ad?.title || "Ustaadji listing",
      text: `Check out this listing on Ustaadji: ${ad?.title} in ${ad?.city}`,
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch (_) {}
  };

  const backTo = location.state?.from || "/";
  const backLabel = location.state?.label || "Back to listings";

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const response = await api.get(`/ads/${id}`);
        const fetchedAd = response.data;
        setAd(fetchedAd);
        if (fetchedAd.images && fetchedAd.images.length > 0) {
          setSelectedImage(fetchedAd.images[0]);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAd();
  }, [id]);

  // Dynamic meta tags — updates title + OG tags for WhatsApp/social sharing
  useEffect(() => {
    if (!ad) return;

    const originalTitle = document.title;

    const setMeta = (attr, key, content) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    const pageTitle = `${ad.title} in ${ad.city} – Ustaadji`;
    const desc =
      ad.description?.length > 150
        ? ad.description.slice(0, 150) + "..."
        : ad.description || "Find trusted service professionals on Ustaadji.";
    const image =
      ad.images?.[0] ||
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80";
    const url = window.location.href;

    document.title = pageTitle;

    setMeta("name", "description", desc);
    setMeta("property", "og:title", pageTitle);
    setMeta("property", "og:description", desc);
    setMeta("property", "og:image", image);
    setMeta("property", "og:url", url);
    setMeta("property", "og:type", "website");
    setMeta("property", "og:site_name", "Ustaadji");
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", pageTitle);
    setMeta("name", "twitter:description", desc);
    setMeta("name", "twitter:image", image);

    return () => {
      document.title = originalTitle;
    };
  }, [ad]);

  const fallbackImage =
    "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80";

  const imageUrl = selectedImage || fallbackImage;
  const imageList = ad?.images && ad.images.length > 0 ? ad.images : [fallbackImage];

  const priceText = ad?.price && Number(ad.price) > 0
    ? `₹${Number(ad.price).toLocaleString("en-IN")}`
    : "Price on request";

  const handleReportSubmit = async () => {
    setReportError("");
    if (!reportReason) {
      setReportError("Please select a reason for the report.");
      return;
    }
    try {
      setReportLoading(true);
      const token = localStorage.getItem("token");
      await api.post(
        "/reports",
        { ad_id: ad.id, reason: reportReason, message: reportMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReportSuccess(true);
      setReportReason("");
      setReportMessage("");
    } catch (error) {
      console.error(error);
      setReportError("Failed to submit report. Please try again.");
    } finally {
      setReportLoading(false);
    }
  };

  const handleCloseReport = () => {
    setShowReportModal(false);
    setReportError("");
    setReportSuccess(false);
    setReportReason("");
    setReportMessage("");
  };

  const handleMessageSeller = async () => {
    setMessageError("");
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.id === ad.user_id) {
      setMessageError("You can't message yourself on your own ad.");
      return;
    }
    try {
      const response = await api.post(
        "/chat/start",
        { ad_id: ad.id, seller_id: ad.user_id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate(`/chat/${response.data.id}`);
    } catch (error) {
      console.error(error);
      setMessageError("Failed to start chat. Please try again.");
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-950">
        <Navbar />
        <section className="mx-auto max-w-7xl px-4 py-20">
          <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
            <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
              <div className="h-[420px] w-full animate-pulse bg-slate-200" />
              <div className="p-8 space-y-4">
                <div className="h-5 w-24 animate-pulse rounded-full bg-slate-200" />
                <div className="h-10 w-3/4 animate-pulse rounded-xl bg-slate-200" />
                <div className="h-8 w-1/4 animate-pulse rounded-xl bg-slate-200" />
                <div className="h-4 w-1/3 animate-pulse rounded-xl bg-slate-200" />
              </div>
            </div>
            <div className="h-80 animate-pulse rounded-[2rem] bg-slate-200" />
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  if (!ad) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-950">
        <Navbar />
        <section className="mx-auto max-w-7xl px-4 py-20 text-center">
          <h1 className="text-3xl font-black">Ad not found</h1>
          <p className="mt-3 font-semibold text-slate-500">This listing may have been removed.</p>
          <Link to="/" className="mt-6 inline-block rounded-2xl bg-emerald-500 px-6 py-3 font-black text-white hover:bg-emerald-600 transition">
            Go back home
          </Link>
        </section>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <Navbar />

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Link
          to={backTo}
          className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-950 transition"
        >
          <ArrowLeft size={18} />
          {backLabel}
        </Link>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* Main content */}
          <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
            <img
              src={imageUrl}
              alt={ad.title}
              className="h-[420px] w-full object-cover"
            />

            {imageList.length > 1 && (
              <div className="flex gap-3 overflow-x-auto border-b border-slate-100 bg-white p-4">
                {imageList.map((img, index) => (
                  <button
                    key={img}
                    onClick={() => setSelectedImage(img)}
                    className={`h-20 w-24 shrink-0 overflow-hidden rounded-2xl border-2 transition ${
                      selectedImage === img ? "border-emerald-500" : "border-slate-200"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${ad.title} ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            <div className="p-6 sm:p-8">
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
                {ad.category_name}
              </span>

              <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
                {ad.title}
              </h1>

              <p className="mt-4 text-4xl font-black">{priceText}</p>

              <div className="mt-5 flex items-center gap-2 text-sm font-bold text-slate-500">
                <MapPin size={16} />
                {ad.city}{ad.location ? ` • ${ad.location}` : ""}
              </div>

              <div className="mt-8">
                <h2 className="text-xl font-black">Description</h2>
                <p className="mt-3 leading-7 text-slate-600 whitespace-pre-line">
                  {ad.description}
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="h-fit rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black">Seller information</h2>

            <div className="mt-4 rounded-3xl bg-slate-50 p-5">
              <p className="text-sm font-bold text-slate-500">Seller</p>
              <p className="mt-1 text-lg font-black">
                {ad.seller_name || "Ustaadji User"}
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-400">
                Registered seller
              </p>
            </div>

            {messageError && (
              <div className="mt-4 rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-sm font-semibold text-red-600">
                {messageError}
              </div>
            )}

            {ad.contact_phone && (
              <>
                <a
                  href={`tel:+91${ad.contact_phone}`}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-5 py-4 text-sm font-black text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition"
                >
                  <Phone size={18} />
                  Call Seller
                </a>

                <a
                  href={`https://wa.me/91${ad.contact_phone}?text=${encodeURIComponent(
                    `Hi, I saw your listing for "${ad.title}" on Ustaadji. Is it still available?`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-4 text-sm font-black text-white transition hover:opacity-90 shadow-lg"
                  style={{ backgroundColor: "#25D366", boxShadow: "0 4px 14px rgba(37,211,102,0.3)" }}
                >
                  {/* WhatsApp icon */}
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.117 1.528 5.845L0 24l6.335-1.508A11.946 11.946 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.369l-.36-.213-3.76.895.952-3.657-.234-.375A9.818 9.818 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/>
                  </svg>
                  WhatsApp Seller
                </a>
              </>
            )}

            <button
              onClick={handleMessageSeller}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-4 text-sm font-black text-white hover:bg-slate-800 transition"
            >
              Message Seller
            </button>

            <div className="mt-6 rounded-3xl border border-emerald-100 bg-emerald-50 p-5">
              <div className="flex items-center gap-2 font-black text-emerald-700">
                <ShieldCheck size={18} />
                Safety tips
              </div>
              <ul className="mt-3 space-y-2 text-sm font-semibold text-emerald-900">
                <li>Meet in a public place.</li>
                <li>Check work quality before paying.</li>
                <li>Never send advance money blindly.</li>
              </ul>
            </div>

            <div className="mt-5 flex gap-3">
              <button
                onClick={handleShare}
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 py-4 text-sm font-black text-slate-600 hover:bg-slate-50 hover:text-emerald-600 transition"
              >
                {copied ? <Check size={16} className="text-emerald-500" /> : <Share2 size={16} />}
                {copied ? "Copied!" : "Share"}
              </button>

              <button
                onClick={() => setShowReportModal(true)}
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 py-4 text-sm font-black text-slate-600 hover:bg-slate-50 hover:text-red-500 transition"
              >
                <Flag size={16} />
                Report
              </button>
            </div>
          </aside>
        </div>
      </section>

      {/* Report modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-2xl font-black text-slate-900">Report Listing</h2>
              <button
                onClick={handleCloseReport}
                className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-slate-100 transition"
              >
                <X size={16} />
              </button>
            </div>

            {reportSuccess ? (
              <div className="py-6 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
                  <ShieldCheck size={26} className="text-emerald-600" />
                </div>
                <h3 className="text-xl font-black text-slate-900">Report submitted</h3>
                <p className="mt-2 font-semibold text-slate-500">
                  Thank you. Our team will review this listing.
                </p>
                <button
                  onClick={handleCloseReport}
                  className="mt-6 w-full rounded-2xl bg-slate-950 py-3 font-black text-white hover:bg-slate-800 transition"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                {reportError && (
                  <div className="mb-4 rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-sm font-semibold text-red-600">
                    {reportError}
                  </div>
                )}

                <div className="mb-4">
                  <label className="mb-2 block text-sm font-black text-slate-700">
                    Reason <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 p-3 font-semibold outline-none focus:border-emerald-400 transition"
                  >
                    <option value="">Select a reason</option>
                    <option value="Scam">Scam</option>
                    <option value="Fake Product">Fake / Misleading</option>
                    <option value="Spam">Spam</option>
                    <option value="Inappropriate">Inappropriate content</option>
                  </select>
                </div>

                <div className="mb-5">
                  <label className="mb-2 block text-sm font-black text-slate-700">
                    Additional details
                  </label>
                  <textarea
                    rows="3"
                    placeholder="Tell us more about the issue..."
                    value={reportMessage}
                    onChange={(e) => setReportMessage(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 p-3 font-semibold outline-none focus:border-emerald-400 transition resize-none"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleCloseReport}
                    className="flex-1 rounded-2xl border border-slate-200 py-3 font-black text-slate-600 hover:bg-slate-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReportSubmit}
                    disabled={reportLoading}
                    className="flex-1 rounded-2xl bg-red-500 py-3 font-black text-white hover:bg-red-600 transition disabled:opacity-70"
                  >
                    {reportLoading ? "Submitting..." : "Submit Report"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}
