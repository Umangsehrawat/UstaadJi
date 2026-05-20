import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

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

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/ads/${id}`);
        const ad = response.data;

        setFormData({
          category_id: ad.category_id || "",
          title: ad.title || "",
          description: ad.description || "",
          price: ad.price || "",
          city: ad.city || "",
          location: ad.location || "",
          contact_phone: ad.contact_phone || "",
        });
      } catch (error) {
        console.error(error);
        alert("Failed to load ad");
      } finally {
        setLoading(false);
      }
    };

    fetchAd();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const token = localStorage.getItem("token");

      await axios.put(`http://localhost:5000/api/ads/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Ad updated successfully");
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to update ad");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-950">
        <Navbar />
        <section className="mx-auto max-w-5xl px-4 py-20">
          <p className="text-xl font-black">Loading ad...</p>
        </section>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <Navbar />

      <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-10">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-600">
            Edit listing
          </p>

          <h1 className="mt-2 text-4xl font-black tracking-tight">
            Update your ad
          </h1>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl">
          <form onSubmit={handleUpdate} className="grid gap-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-black text-slate-700">
                  Ad title
                </label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-4 font-semibold outline-none focus:border-emerald-400"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-black text-slate-700">
                  Category
                </label>

                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-4 font-semibold outline-none focus:border-emerald-400"
                  required
                >
                  <option value="">Select category</option>
                  <option value="1">Jobs</option>
                  <option value="2">Services</option>
                  <option value="3">Rent / PG / Rooms</option>
                  <option value="4">Cars & Bikes</option>
                  <option value="5">Electronics</option>
                  <option value="6">Furniture</option>
                  <option value="7">Home Appliances</option>
                  <option value="8">Real Estate</option>
                  <option value="9">Tutors & Classes</option>
                  <option value="10">Home Repair</option>
                  <option value="11">Mobile Phones</option>
                </select>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-black text-slate-700">
                Description
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="6"
                className="w-full rounded-2xl border border-slate-200 px-4 py-4 font-semibold outline-none focus:border-emerald-400"
                required
              />
            </div>

            <div className="grid gap-6 md:grid-cols-4">
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Price"
                className="rounded-2xl border border-slate-200 px-4 py-4 font-semibold outline-none focus:border-emerald-400"
              />

              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City"
                className="rounded-2xl border border-slate-200 px-4 py-4 font-semibold outline-none focus:border-emerald-400"
                required
              />

              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Area / Location"
                className="rounded-2xl border border-slate-200 px-4 py-4 font-semibold outline-none focus:border-emerald-400"
              />

              <input
                type="text"
                name="contact_phone"
                value={formData.contact_phone}
                onChange={handleChange}
                placeholder="Phone"
                className="rounded-2xl border border-slate-200 px-4 py-4 font-semibold outline-none focus:border-emerald-400"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="rounded-2xl bg-emerald-500 px-6 py-4 text-lg font-black text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-600 disabled:opacity-70"
            >
              {saving ? "Updating..." : "Update Ad"}
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </main>
  );
}