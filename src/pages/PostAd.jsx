import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UploadCloud, X, CheckCircle } from "lucide-react";
import api from "../api/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const MAX_IMAGES = 5;
const MAX_SIZE_MB = 2;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
const MAX_DESC = 1000;

export default function PostAd() {
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
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [imageError, setImageError] = useState("");
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    api
      .get("/ads/categories")
      .then((res) => setCategories(res.data))
      .catch(() => {});
  }, [navigate]);

  useEffect(() => {
    return () => previews.forEach((url) => URL.revokeObjectURL(url));
  }, [previews]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "description" && value.length > MAX_DESC) return;
    setFormData({ ...formData, [name]: value });
    setFormError("");
  };

  const handleImageChange = (e) => {
    setImageError("");
    const incoming = Array.from(e.target.files);

    if (images.length + incoming.length > MAX_IMAGES) {
      setImageError(`You can upload a maximum of ${MAX_IMAGES} images.`);
      e.target.value = "";
      return;
    }

    const oversized = incoming.filter((f) => f.size > MAX_SIZE_BYTES);
    if (oversized.length > 0) {
      setImageError(
        `These files exceed ${MAX_SIZE_MB}MB: ${oversized.map((f) => f.name).join(", ")}`
      );
      e.target.value = "";
      return;
    }

    const newPreviews = incoming.map((f) => URL.createObjectURL(f));
    setImages((prev) => [...prev, ...incoming]);
    setPreviews((prev) => [...prev, ...newPreviews]);
    e.target.value = "";
  };

  const removeImage = (index) => {
    URL.revokeObjectURL(previews[index]);
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const data = new FormData();

      Object.keys(formData).forEach((key) => {
        if (formData[key]) data.append(key, formData[key]);
      });
      images.forEach((img) => data.append("images", img));

      await api.post("/ads", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess(true);
      setFormData({ category_id: "", title: "", description: "", price: "", city: "", location: "", contact_phone: "" });
      previews.forEach((url) => URL.revokeObjectURL(url));
      setImages([]);
      setPreviews([]);

      setTimeout(() => navigate("/dashboard"), 1800);
    } catch (error) {
      setFormError(error.response?.data?.message || "Failed to post ad. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-950">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32">
          <CheckCircle size={64} className="text-emerald-500" />
          <h2 className="mt-6 text-3xl font-black">Ad published!</h2>
          <p className="mt-2 font-semibold text-slate-500">Redirecting you to dashboard...</p>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <Navbar />

      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-10">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-600">
            Create listing
          </p>
          <h1 className="mt-2 text-4xl font-black tracking-tight">
            Post your service on Ustaadji
          </h1>
          <p className="mt-3 text-lg font-medium text-slate-500">
            Reach customers across your city looking for your service.
          </p>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl">
          {formError && (
            <div className="mb-6 rounded-2xl bg-red-50 border border-red-200 px-5 py-4 text-sm font-semibold text-red-600">
              {formError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid gap-6">
            {/* Title + Category */}
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
                  placeholder="e.g. Professional Plumbing Services"
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
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
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
                placeholder="Describe your service — experience, what's included, timings, etc."
                className="w-full rounded-2xl border border-slate-200 px-4 py-4 font-semibold outline-none focus:border-emerald-400 transition resize-none"
                required
              />
            </div>

            {/* Price, City, Area, Phone */}
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
                <label className="mb-2 block text-sm font-black text-slate-700">
                  Area / Locality
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Rohini, Sector 7"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-4 font-semibold outline-none focus:border-emerald-400 transition"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-black text-slate-700">
                  Contact phone
                </label>
                <div className="flex overflow-hidden rounded-2xl border border-slate-200 focus-within:border-emerald-400 transition">
                  <span className="flex items-center bg-slate-50 px-4 text-sm font-bold text-slate-500 border-r border-slate-200">
                    +91
                  </span>
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

            {/* Image Upload */}
            <div>
              <label className="mb-2 block text-sm font-black text-slate-700">
                Photos{" "}
                <span className="font-semibold text-slate-400">
                  (max {MAX_IMAGES} images, {MAX_SIZE_MB}MB each)
                </span>
              </label>

              {previews.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-3">
                  {previews.map((src, i) => (
                    <div key={i} className="relative h-24 w-24 overflow-hidden rounded-2xl border border-slate-200">
                      <img src={src} alt={`preview ${i + 1}`} className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white shadow"
                      >
                        <X size={11} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {images.length < MAX_IMAGES && (
                <label className="flex cursor-pointer flex-col items-center gap-3 rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-10 transition hover:border-emerald-400 hover:bg-emerald-50">
                  <UploadCloud size={36} className="text-slate-400" />
                  <div className="text-center">
                    <p className="font-black text-slate-700">Click to upload photos</p>
                    <p className="mt-1 text-sm font-semibold text-slate-400">
                      JPG, PNG, WEBP — max {MAX_SIZE_MB}MB each · {images.length}/{MAX_IMAGES} uploaded
                    </p>
                  </div>
                  <input
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}

              {imageError && (
                <p className="mt-2 text-sm font-semibold text-red-500">{imageError}</p>
              )}
            </div>

            {/* Guidelines */}
            <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-5">
              <h3 className="font-black text-emerald-700">Posting guidelines</h3>
              <ul className="mt-3 space-y-1.5 text-sm font-semibold text-emerald-900">
                <li>Only post real services you can provide.</li>
                <li>Add clear photos of your work for more inquiries.</li>
                <li>Provide honest pricing and descriptions.</li>
              </ul>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="rounded-2xl bg-emerald-500 px-6 py-4 text-lg font-black text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Publishing..." : "Publish Ad"}
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </main>
  );
}
