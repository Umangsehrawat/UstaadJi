import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function validatePhone(phone) {
  return /^[6-9]\d{9}$/.test(phone);
}

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ phone: "", password: "" });
  const [phoneError, setPhoneError] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === "phone") setPhoneError("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validatePhone(formData.phone)) {
      setPhoneError("Enter a valid 10-digit Indian mobile number");
      return;
    }
    try {
      setLoading(true);
      const response = await api.post("/auth/login", formData);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-600 mb-2">
              Welcome Back
            </p>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
              Login to Ustaadji
            </h1>
            <p className="mt-2 font-semibold text-slate-500">
              Enter your phone number and password
            </p>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl">
            {error && (
              <div className="mb-6 rounded-2xl bg-red-50 border border-red-200 px-5 py-4 text-sm font-semibold text-red-600">
                {error}
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="mb-2 block text-sm font-black text-slate-700">
                  Phone number
                </label>
                <div className="flex overflow-hidden rounded-2xl border border-slate-200 focus-within:border-emerald-400 transition">
                  <span className="flex items-center bg-slate-50 px-4 text-sm font-bold text-slate-500 border-r border-slate-200">
                    +91
                  </span>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="10-digit mobile number"
                    value={formData.phone}
                    onChange={handleChange}
                    maxLength={10}
                    className="w-full px-4 py-4 font-semibold outline-none text-slate-900"
                    required
                  />
                </div>
                {phoneError && (
                  <p className="mt-2 text-sm font-semibold text-red-500">{phoneError}</p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-black text-slate-700">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-4 font-semibold outline-none focus:border-emerald-400 transition text-slate-900"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-emerald-500 py-4 font-black text-lg text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-600 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm font-semibold text-slate-500">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-black text-emerald-600 hover:text-emerald-700 transition"
              >
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

export default Login;
