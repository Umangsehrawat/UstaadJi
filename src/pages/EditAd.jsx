import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, CheckCircle } from "lucide-react";
import api from "../api/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const MAX_DESC = 1000;

export default function EditAd() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    category_id: "",
    title: "",
    description: "",
    price: "",
    city: "",
    location: "",
    contact_phone: "",
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const [adRes, catRes] = await Promise.all([
          api.get(`/ads/${id}`),
          api.get("/ads/categories"),
        ]);

        const ad = adRes.data;
        setFormData({
          category_id: ad.category_id || "",
          title: ad.title || "",
          description: ad.description || "",
          price: ad.price || "",
          city: ad.city || "",
          location: ad.location || "",
          contact_phone: ad.contact_phone || "",
        });
        setCategories(catRes.data);
      } catch {
        setError("Failed to load ad details.");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "description" && value.length > MAX_DESC) return;
    setFormData({ ...formData, [name]: value });
    setError("");
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    try {
      setSaving(true);
      const token = localStorage.getItem("token");
      await api.put(`/ads/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess(true);
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update ad.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-950">
        <Navbar />
        <section className="mx-auto max-w-3xl px-4 py-14">
          <div className="space-y-4">
            <div className="h-6 w-32 animate-pulse rounded-xl bg-slate-200" />
            <div className="h-10 w-2/3 animate-pulse rounded-2xl bg-slate-200" />
            <div className="mt-8 h-96 w-full animate-pulse rounded-[2rem] bg-slate-200" />
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  if (success) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-950">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32">
          <CheckCircle size={64} className="text-emerald-500" />
          <h2 className="mt-6 text-3xl font-black">Ad updated!</h2>
          <p className="mt-2 font-semibold text-slate-500">Redirecting to dashboard...</p>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <Navbar />

      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
        <Link
          to="/dashboard"
          className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>

        <div className="mb-8">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-600">
            Edit listing
          </p>
          <h1 className="mt-2 text-4xl font-black tracking-tight">Update your ad</h1>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl">
          {error && (
            <div className="mb-6 rounded-2xl bg-red-50 border border-red-200 px-5 py-4 text-sm font-semibold text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleUpdate} className="grid gap-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-black text-slate-700">
                  Ad title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-4 font-semibold outline-none focus:border-emerald-400 transition"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-black text-slate-700">
                  Service category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 font-semibold outline-none focus:border-emerald-400 transition"
                  required
                >
                  <option value="">Select a service</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-black text-slate-700">
                  Description <span className="text-red-500">*</span>
                </label>
                <span className={`text-xs font-semibold ${formData.description.length > MAX_DESC * 0.9 ? "text-red-500" : "text-slate-400"}`}>
                  {formData.description.length}/{MAX_DESC}
                </span>
              </div>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="5"
                className="w-full rounded-2xl border border-slate-200 px-4 py-4 font-semibold outline-none focus:border-emerald-400 transition resize-none"
                required
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-black text-slate-700">Price (₹)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="e.g. 500"
                  min="0"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-4 font-semibold outline-none focus:border-emerald-400 transition"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-black text-slate-700">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="e.g. Delhi"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-4 font-semibold outline-none focus:border-emerald-400 transition"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-black text-slate-700">Area / Locality</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  placeholder="e.g. Rohini, Sector 7"
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-4 font-semibold outline-none focus:border-emerald-400 transition"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-black text-slate-700">Contact phone</label>
                <div className="flex overflow-hidden rounded-2xl border border-slate-200 focus-within:border-emerald-400 transition">
                  <span className="flex items-center bg-slate-50 px-4 text-sm font-bold text-slate-500 border-r border-slate-200">+91</span>
                  <input
                    type="tel"
                    name="contact_phone"
                    value={formData.contact_phone}
                    onChange={handleChange}
                    placeholder="Phone number"
                    maxLength={10}
                    className="w-full px-4 py-4 font-semibold outline-none"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="rounded-2xl bg-emerald-500 px-6 py-4 text-lg font-black text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-600 disabled:opacity-70"
            >
              {saving ? "Saving changes..." : "Save Changes"}
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </main>
  );
}
