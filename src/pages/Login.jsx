import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";

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
    <div className="min-h-screen bg-[#f5f7fa] flex flex-col">
      <header className="bg-white border-b border-gray-200 px-8 py-5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#00072d] flex items-center justify-center text-white font-bold text-2xl">
            U
          </div>
          <div>
            <h1 className="font-black text-2xl text-[#00072d]">Ustaadji</h1>
            <p className="text-sm text-gray-500">India's local marketplace</p>
          </div>
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="bg-white rounded-[32px] shadow-xl border border-gray-200 p-10 w-full max-w-xl">
          <p className="text-[#00b67a] font-bold tracking-[4px] uppercase text-sm mb-4">
            Welcome Back
          </p>

          <h2 className="text-5xl font-black text-[#00072d] leading-tight mb-10">
            Login to Ustaadji
          </h2>

          {error && (
            <div className="mb-6 rounded-2xl bg-red-50 border border-red-200 px-5 py-4 text-sm font-semibold text-red-600">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <div className="flex overflow-hidden rounded-2xl border border-gray-200 focus-within:border-emerald-500">
                <span className="flex items-center bg-slate-50 px-4 text-sm font-bold text-slate-500 border-r border-gray-200">
                  +91
                </span>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  maxLength={10}
                  className="w-full px-5 py-5 text-lg outline-none"
                  required
                />
              </div>
              {phoneError && (
                <p className="mt-2 text-sm font-semibold text-red-500">
                  {phoneError}
                </p>
              )}
            </div>

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-2xl px-6 py-5 text-lg outline-none focus:border-emerald-500"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#00072d] hover:bg-black text-white py-5 rounded-2xl font-bold text-xl transition"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-center text-gray-500 mt-8">
            Don't have an account?{" "}
            <Link to="/register" className="text-[#00b67a] font-bold">
              Register
            </Link>
          </p>
        </div>
      </div>

      <footer className="border-t border-gray-200 px-10 py-6 text-gray-500 flex justify-between text-sm">
        <p>© 2026 Ustaadji.in — India's local marketplace.</p>
        <div className="flex gap-6">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Support</a>
        </div>
      </footer>
    </div>
  );
}

export default Login;
