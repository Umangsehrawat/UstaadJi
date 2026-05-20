import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Admin() {
  const [stats, setStats] = useState(null);
  const [reports, setReports] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("ADMIN PAGE TOKEN:", token);

        const statsResponse = await axios.get(
          "http://https://ustaadji-backend.onrender.com/api/admin/stats",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const reportsResponse = await axios.get(
          "http://https://ustaadji-backend.onrender.com/api/admin/reports",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setStats(statsResponse.data);
        setReports(reportsResponse.data);
      } catch (error) {
        console.error(error);
        setError("Admin access required");
      }
    };

    fetchAdminData();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <Navbar />

      <section className="mx-auto max-w-7xl px-4 py-12">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-600">
          Admin Panel
        </p>

        <h1 className="mt-2 text-4xl font-black">
          Ustaadji Admin Dashboard
        </h1>

        {error ? (
          <div className="mt-8 rounded-3xl border border-red-200 bg-red-50 p-8 font-black text-red-600">
            {error}
          </div>
        ) : !stats ? (
          <p className="mt-8 text-lg font-black">Loading admin stats...</p>
        ) : (
          <>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-bold text-slate-500">
                  Total Users
                </p>
                <h2 className="mt-3 text-4xl font-black">
                  {stats.totalUsers}
                </h2>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-bold text-slate-500">
                  Total Ads
                </p>
                <h2 className="mt-3 text-4xl font-black">
                  {stats.totalAds}
                </h2>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-bold text-slate-500">
                  Total Messages
                </p>
                <h2 className="mt-3 text-4xl font-black">
                  {stats.totalMessages}
                </h2>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-bold text-slate-500">
                  Reports
                </p>
                <h2 className="mt-3 text-4xl font-black">
                  {stats.totalReports}
                </h2>
              </div>
            </div>

            <div className="mt-12">
              <h2 className="text-2xl font-black">Reported Ads</h2>

              <div className="mt-6 space-y-4">
                {reports.length === 0 ? (
                  <div className="rounded-3xl border border-slate-200 bg-white p-6 font-bold text-slate-500">
                    No reports yet.
                  </div>
                ) : (
                  reports.map((report) => (
                    <div
                      key={report.id}
                      className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
                    >
                      <p className="text-sm font-black uppercase tracking-[0.15em] text-red-500">
                        {report.reason}
                      </p>

                      <h3 className="mt-2 text-xl font-black">
                        {report.ad_title || "Deleted ad"}
                      </h3>

                      <p className="mt-2 font-semibold text-slate-500">
                        Seller: {report.seller_name || "Unknown"} • City:{" "}
                        {report.city || "N/A"}
                      </p>

                      <p className="mt-3 font-semibold text-slate-700">
                        {report.message || "No extra message"}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </section>

      <Footer />
    </main>
  );
}