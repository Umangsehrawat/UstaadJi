import { useEffect, useState } from "react";
import { useParams, Link, useLocation, useNavigate } from "react-router-dom";
import {
  MapPin,
  ArrowLeft,
  Phone,
  ShieldCheck,
  Flag,
} from "lucide-react";

import axios from "axios";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function AdDetails() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedImage, setSelectedImage] = useState("");

  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportMessage, setReportMessage] = useState("");
  const [reportLoading, setReportLoading] = useState(false);

  const backTo = location.state?.from || "/";
  const backLabel = location.state?.label || "Back to listings";

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/ads/${id}`
        );

        const fetchedAd = response.data;
        setAd(fetchedAd);

        if (fetchedAd.images && fetchedAd.images.length > 0) {
          setSelectedImage(`http://localhost:5000${fetchedAd.images[0]}`);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAd();
  }, [id]);

  const fallbackImage =
    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=900&q=80";

  const imageUrl = selectedImage || fallbackImage;

  const imageList =
    ad?.images && ad.images.length > 0
      ? ad.images.map((img) => `http://localhost:5000${img}`)
      : [fallbackImage];

  const priceText = ad?.price
    ? `₹${Number(ad.price).toLocaleString("en-IN")}`
    : "Price not listed";

  const handleReportSubmit = async () => {
    try {
      if (!reportReason) return alert("Please select a reason");

      setReportLoading(true);

      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/api/reports",
        {
          ad_id: ad.id,
          reason: reportReason,
          message: reportMessage,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Report submitted successfully");
      setShowReportModal(false);
      setReportReason("");
      setReportMessage("");
    } catch (error) {
      console.error(error);
      alert("Failed to submit report");
    } finally {
      setReportLoading(false);
    }
  };

  const handleMessageSeller = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first to message seller.");
        navigate("/login");
        return;
      }

      const user = JSON.parse(localStorage.getItem("user"));

      if (user?.id === ad.user_id) {
        alert("You cannot message yourself on your own ad.");
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/api/chat/start",
        {
          ad_id: ad.id,
          seller_id: ad.user_id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate(`/chat/${response.data.id}`);
    } catch (error) {
      console.error(error);
      alert("Failed to start chat");
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-950">
        <Navbar />
        <section className="mx-auto max-w-7xl px-4 py-20">
          <p className="text-xl font-black">Loading ad...</p>
        </section>
        <Footer />
      </main>
    );
  }

  if (!ad) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-950">
        <Navbar />
        <section className="mx-auto max-w-7xl px-4 py-20">
          <h1 className="text-3xl font-black">Ad not found</h1>
          <Link to="/" className="mt-6 inline-block font-bold text-emerald-600">
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
          className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-950"
        >
          <ArrowLeft size={18} />
          {backLabel}
        </Link>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
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
                    className={`h-20 w-24 shrink-0 overflow-hidden rounded-2xl border-2 ${
                      selectedImage === img
                        ? "border-emerald-500"
                        : "border-slate-200"
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
                <MapPin size={18} />
                {ad.city}
                {ad.location ? ` • ${ad.location}` : ""}
              </div>

              <div className="mt-8">
                <h2 className="text-xl font-black">Description</h2>
                <p className="mt-3 leading-7 text-slate-600">
                  {ad.description}
                </p>
              </div>
            </div>
          </div>

          <aside className="h-fit rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black">Seller information</h2>

            <div className="mt-5 rounded-3xl bg-slate-50 p-5">
              <p className="text-sm font-bold text-slate-500">Seller</p>
              <p className="mt-1 text-lg font-black">
                {ad.seller_name || "Ustaadji User"}
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-500">
                Verified seller
              </p>
            </div>

            {ad.contact_phone && (
              <a
                href={`tel:${ad.contact_phone}`}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-5 py-4 text-sm font-black text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-600"
              >
                <Phone size={18} />
                Call Seller
              </a>
            )}

            <button
              onClick={handleMessageSeller}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-4 text-sm font-black text-white hover:bg-slate-800"
            >
              Message Seller
            </button>

            <div className="mt-6 rounded-3xl border border-emerald-100 bg-emerald-50 p-5">
              <div className="flex items-center gap-2 font-black text-emerald-700">
                <ShieldCheck size={19} />
                Safety tips
              </div>

              <ul className="mt-3 space-y-2 text-sm font-semibold text-emerald-900">
                <li>Meet in a public place.</li>
                <li>Check item before paying.</li>
                <li>Never send advance money blindly.</li>
              </ul>
            </div>

            <button
              onClick={() => setShowReportModal(true)}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 px-5 py-4 text-sm font-black text-slate-600 hover:bg-slate-50 hover:text-red-500"
            >
              <Flag size={18} />
              Report this ad
            </button>
          </aside>
        </div>
      </section>

      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <h2 className="mb-4 text-2xl font-black text-slate-900">
              Report Listing
            </h2>

            <select
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              className="mb-4 w-full rounded-xl border border-slate-200 p-3 outline-none focus:border-emerald-500"
            >
              <option value="">Select reason</option>
              <option value="Scam">Scam</option>
              <option value="Fake Product">Fake Product</option>
              <option value="Spam">Spam</option>
              <option value="Inappropriate">Inappropriate</option>
            </select>

            <textarea
              rows="4"
              placeholder="Additional details..."
              value={reportMessage}
              onChange={(e) => setReportMessage(e.target.value)}
              className="mb-4 w-full rounded-xl border border-slate-200 p-3 outline-none focus:border-emerald-500"
            />

            <div className="flex gap-3">
              <button
                onClick={() => setShowReportModal(false)}
                className="flex-1 rounded-xl border border-slate-200 py-3 font-semibold"
              >
                Cancel
              </button>

              <button
                onClick={handleReportSubmit}
                disabled={reportLoading}
                className="flex-1 rounded-xl bg-red-500 py-3 font-semibold text-white hover:bg-red-600"
              >
                {reportLoading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}