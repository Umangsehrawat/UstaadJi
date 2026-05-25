import { useEffect, useState } from "react";
import axios from "axios";
import { Users, FileText, MessageSquare, Flag, Trash2, X, ShieldAlert, MapPin, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const API = "https://ustaadji-backend.onrender.com/api";

export default function Admin() {
  const [stats, setStats] = useState(null);
  const [reports, setReports] = useState([]);
  const [allAds, setAllAds] = useState([]);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [statsRes, reportsRes, adsRes] = await Promise.all([
          axios.get(`${API}/admin/stats`, { headers }),
          axios.get(`${API}/admin/reports`, { headers }),
          axios.get(`${API}/admin/ads`, { headers }),
        ]);
        setStats(statsRes.data);
        setReports(reportsRes.data);
        setAllAds(adsRes.data);
      } catch {
        setError("Admin access required. Make sure your account has admin privileges.");
      }
    };
    fetchAdminData();
  }, []);

  const handleDeleteAd = async (adId, reportId) => {
    if (!window.confirm("Delete this ad and all its reports permanently?")) return;
    try {
      await axios.delete(`${API}/admin/ads/${adId}`, { headers });
      setReports((prev) => prev.filter((r) => r.ad_id !== adId));
      setAllAds((prev) => prev.filter((a) => a.id !== adId));
      if (stats) setStats((s) => ({ ...s, totalAds: String(Number(s.totalAds) - 1) }));
    } catch {
      alert("Failed to delete ad");
    }
  };

  const handleDismissReport = async (reportId) => {
    try {
      await axios.delete(`${API}/admin/reports/${reportId}`, { headers });
      setReports((prev) => prev.filter((r) => r.id !== reportId));
      if (stats) setStats((s) => ({ ...s, totalReports: String(Number(s.totalReports) - 1) }));
    } catch {
      alert("Failed to dismiss report");
    }
  };

  const statCards = stats
    ? [
        { label: "Total Users", value: stats.totalUsers, icon: Users, color: "bg-blue-50 text-blue-600", border: "border-blue-100" },
        { label: "Total Ads", value: stats.totalAds, icon: FileText, color: "bg-emerald-50 text-emerald-600", border: "border-emerald-100" },
        { label: "Messages Sent", value: stats.totalMessages, icon: MessageSquare, color: "bg-purple-50 text-purple-600", border: "border-purple-100" },
        { label: "Pending Reports", value: reports.length, icon: Flag, color: "bg-red-50 text-red-600", border: "border-red-100" },
      ]
    : [];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <Navbar />

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-red-50 border border-red-200 px-3 py-1 text-xs font-black text-red-600 mb-3">
              <ShieldAlert size={13} />
              Admin Panel
            </div>
            <h1 className="text-4xl font-black tracking-tight">Ustaadji Dashboard</h1>
            <p className="mt-1 font-semibold text-slate-500">Manage listings, users, and reports</p>
          </div>
        </div>

        {error ? (
          <div className="mt-8 rounded-3xl border border-red-200 bg-red-50 p-8 font-black text-red-600">
            {error}
          </div>
        ) : !stats ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 animate-pulse rounded-3xl bg-slate-200" />
            ))}
          </div>
        ) : (
          <>
            {/* Stat Cards */}
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {statCards.map((card) => {
                const Icon = card.icon;
                return (
                  <div key={card.label} className={`rounded-2xl border ${card.border} bg-white p-6 shadow-sm`}>
                    <div className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl ${card.color}`}>
                      <Icon size={20} />
                    </div>
                    <p className="text-sm font-bold text-slate-500">{card.label}</p>
                    <h2 className="mt-1 text-4xl font-black">{card.value}</h2>
                  </div>
                );
              })}
            </div>

            {/* Tabs */}
            <div className="mt-10 flex gap-2 border-b border-slate-200">
              {[
                { key: "overview", label: "Overview" },
                { key: "reports", label: `Reports (${reports.length})` },
                { key: "ads", label: `Manage Ads (${allAds.length})` },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-5 py-3 text-sm font-black capitalize transition border-b-2 -mb-px ${
                    activeTab === tab.key
                      ? "border-emerald-500 text-emerald-600"
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="font-black text-slate-800">Platform Health</h3>
                  <ul className="mt-4 space-y-3">
                    <li className="flex justify-between text-sm font-semibold">
                      <span className="text-slate-500">Registered users</span>
                      <span className="font-black">{stats.totalUsers}</span>
                    </li>
                    <li className="flex justify-between text-sm font-semibold">
                      <span className="text-slate-500">Active ads</span>
                      <span className="font-black">{stats.totalAds}</span>
                    </li>
                    <li className="flex justify-between text-sm font-semibold">
                      <span className="text-slate-500">Messages exchanged</span>
                      <span className="font-black">{stats.totalMessages}</span>
                    </li>
                    <li className="flex justify-between text-sm font-semibold">
                      <span className="text-slate-500">Open reports</span>
                      <span className={`font-black ${reports.length > 0 ? "text-red-600" : "text-emerald-600"}`}>
                        {reports.length}
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="font-black text-slate-800">Quick Actions</h3>
                  <ul className="mt-4 space-y-3 text-sm font-semibold text-slate-600">
                    <li
                      className="cursor-pointer rounded-xl bg-slate-50 px-4 py-3 hover:bg-slate-100"
                      onClick={() => setActiveTab("reports")}
                    >
                      📋 Review {reports.length} pending report{reports.length !== 1 ? "s" : ""}
                    </li>
                    <li className="rounded-xl bg-slate-50 px-4 py-3 text-slate-400">
                      👥 User management — coming soon
                    </li>
                    <li className="rounded-xl bg-slate-50 px-4 py-3 text-slate-400">
                      📊 Analytics — coming soon
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* Manage Ads Tab */}
            {activeTab === "ads" && (
              <div className="mt-8">
                {allAds.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-14 text-center">
                    <FileText className="mx-auto text-slate-300" size={40} />
                    <h3 className="mt-4 text-xl font-black">No ads found</h3>
                    <p className="mt-2 font-semibold text-slate-500">No listings have been posted yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {allAds.map((ad) => (
                      <div key={ad.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-start gap-4">
                          {/* Thumbnail */}
                          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                            {ad.images && ad.images.length > 0 ? (
                              <img
                                src={ad.images[0]}
                                alt={ad.title}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center">
                                <FileText size={24} className="text-slate-300" />
                              </div>
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              {ad.category_name && (
                                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-600">
                                  {ad.category_name}
                                </span>
                              )}
                              <span className={`rounded-full px-3 py-1 text-xs font-black ${
                                ad.status === "active"
                                  ? "bg-green-50 text-green-600"
                                  : "bg-slate-100 text-slate-500"
                              }`}>
                                {ad.status}
                              </span>
                            </div>
                            <h3 className="mt-1.5 text-base font-black truncate">{ad.title}</h3>
                            <p className="text-sm font-semibold text-slate-500">
                              {ad.seller_name || "Unknown seller"}
                              {ad.seller_phone ? ` · +91 ${ad.seller_phone}` : ""}
                            </p>
                            <div className="mt-1 flex items-center gap-1 text-xs font-semibold text-slate-400">
                              <MapPin size={11} />
                              {ad.city || "No city"}
                              <span className="mx-1">·</span>
                              {new Date(ad.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex shrink-0 flex-col gap-2">
                            <Link
                              to={`/ads/${ad.id}`}
                              target="_blank"
                              className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-xs font-black text-slate-600 hover:bg-slate-50 transition"
                            >
                              <ExternalLink size={13} />
                              View
                            </Link>
                            <button
                              onClick={() => handleDeleteAd(ad.id, null)}
                              className="flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2 text-xs font-black text-white hover:bg-red-600 transition"
                            >
                              <Trash2 size={13} />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Reports Tab */}
            {activeTab === "reports" && (
              <div className="mt-8">
                {reports.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-14 text-center">
                    <Flag className="mx-auto text-slate-300" size={40} />
                    <h3 className="mt-4 text-xl font-black">No pending reports</h3>
                    <p className="mt-2 font-semibold text-slate-500">All clear — no reports to review.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reports.map((report) => (
                      <div key={report.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 flex-wrap">
                              <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-black text-red-600">
                                {report.reason}
                              </span>
                              <span className="text-xs font-semibold text-slate-400">
                                {new Date(report.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                              </span>
                            </div>
                            <h3 className="mt-2 text-lg font-black truncate">
                              {report.ad_title || "Deleted ad"}
                            </h3>
                            <p className="mt-1 text-sm font-semibold text-slate-500">
                              Seller: {report.seller_name || "Unknown"}{report.city ? ` · ${report.city}` : ""}
                            </p>
                            {report.message && (
                              <p className="mt-2 rounded-xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
                                "{report.message}"
                              </p>
                            )}
                          </div>

                          <div className="flex shrink-0 flex-col gap-2">
                            {report.ad_id && (
                              <button
                                onClick={() => handleDeleteAd(report.ad_id, report.id)}
                                className="flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2 text-xs font-black text-white hover:bg-red-600 transition"
                              >
                                <Trash2 size={13} />
                                Delete Ad
                              </button>
                            )}
                            <button
                              onClick={() => handleDismissReport(report.id)}
                              className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-xs font-black text-slate-600 hover:bg-slate-50 transition"
                            >
                              <X size={13} />
                              Dismiss
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </section>

      <Footer />
    </main>
  );
}
