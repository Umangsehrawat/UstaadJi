import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await api.post("/auth/register", formData);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      alert("Registration successful!");

      navigate("/");
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f7fa] flex flex-col">
      <header className="bg-white border-b border-gray-200 px-8 py-5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#00072d] flex items-center justify-center text-white font-bold text-2xl">
            U
          </div>

          <div>
            <h1 className="font-black text-2xl text-[#00072d]">
              Ustaadji
            </h1>

            <p className="text-sm text-gray-500">
              India’s local marketplace
            </p>
          </div>
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="bg-white rounded-[32px] shadow-xl border border-gray-200 p-10 w-full max-w-xl">
          <p className="text-[#00b67a] font-bold tracking-[4px] uppercase text-sm mb-4">
            Get Started
          </p>

          <h2 className="text-5xl font-black text-[#00072d] leading-tight mb-10">
            Create your account
          </h2>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Full name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-2xl px-6 py-5 text-lg outline-none"
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-2xl px-6 py-5 text-lg outline-none"
              required
            />

            <input
              type="text"
              name="phone"
              placeholder="Phone number"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-2xl px-6 py-5 text-lg outline-none"
            />

            <input
              type="text"
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-2xl px-6 py-5 text-lg outline-none"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-2xl px-6 py-5 text-lg outline-none"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#00072d] hover:bg-black text-white py-5 rounded-2xl font-bold text-xl transition"
            >
              {loading ? "Creating account..." : "Register"}
            </button>
          </form>

          <p className="text-center text-gray-500 mt-8">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[#00b67a] font-bold"
            >
              Login
            </Link>
          </p>
        </div>
      </div>

      <footer className="border-t border-gray-200 px-10 py-6 text-gray-500 flex justify-between text-sm">
        <p>© 2026 Ustaadji.in — India’s local marketplace.</p>

        <div className="flex gap-6">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Support</a>
        </div>
      </footer>
    </div>
  );
}

export default Register;