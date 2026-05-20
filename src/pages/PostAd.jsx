import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";

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

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first to post an ad.");
      navigate("/login");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 5) {
      alert("Maximum 5 images allowed.");
      return;
    }

    setImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      const data = new FormData();

      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      images.forEach((image) => {
        data.append("images", image);
      });

      const response = await axios.post("http://localhost:5000/api/ads", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert(response.data.message);

      setFormData({
        category_id: "",
        title: "",
        description: "",
        price: "",
        city: "",
        location: "",
        contact_phone: "",
      });

      setImages([]);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to create ad");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <Navbar />

      <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-10">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-600">
            Create listing
          </p>

          <h1 className="mt-2 text-4xl font-black tracking-tight">
            Post your ad on Ustaadji
          </h1>

          <p className="mt-3 max-w-2xl text-lg font-medium text-slate-500">
            Sell products, offer services, rent property, post jobs, and connect
            with people across India.
          </p>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="grid gap-6">
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
                  placeholder="e.g. iPhone 15 Pro Max for sale"
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
                placeholder="Describe your product or service..."
                className="w-full rounded-2xl border border-slate-200 px-4 py-4 font-semibold outline-none focus:border-emerald-400"
                required
              />
            </div>

            <div className="grid gap-6 md:grid-cols-4">
              <div>
                <label className="mb-2 block text-sm font-black text-slate-700">
                  Price
                </label>

                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="₹"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-4 font-semibold outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-black text-slate-700">
                  City
                </label>

                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Delhi"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-4 font-semibold outline-none focus:border-emerald-400"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-black text-slate-700">
                  Area / Location
                </label>

                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Rohini, Sector 7"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-4 font-semibold outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-black text-slate-700">
                  Phone number
                </label>

                <input
                  type="text"
                  name="contact_phone"
                  value={formData.contact_phone}
                  onChange={handleChange}
                  placeholder="+91"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-4 font-semibold outline-none focus:border-emerald-400"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-black text-slate-700">
                Upload images
              </label>

              <div className="rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
                <p className="text-lg font-black text-slate-700">
                  Upload up to 5 images
                </p>

                <p className="mt-2 text-sm font-semibold text-slate-500">
                  PNG, JPG, WEBP up to 5MB each
                </p>

                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                  className="mx-auto mt-5 block max-w-sm rounded-2xl bg-white p-3 text-sm font-semibold"
                />

                {images.length > 0 && (
                  <p className="mt-4 text-sm font-bold text-emerald-600">
                    {images.length} image(s) selected
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-5">
              <h3 className="font-black text-emerald-700">
                Posting guidelines
              </h3>

              <ul className="mt-3 space-y-2 text-sm font-semibold text-emerald-900">
                <li>No fake products or scam listings.</li>
                <li>No weapons, drugs, or prohibited items.</li>
                <li>Provide clear and honest descriptions.</li>
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