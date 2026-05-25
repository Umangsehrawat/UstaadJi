import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MessageCircle, ArrowRight } from "lucide-react";
import api from "../api/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function timeAgo(dateStr) {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);

  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export default function Messages() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await api.get("/chat", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setConversations(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, [token]);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <Navbar />

      <section className="mx-auto max-w-3xl px-4 py-12">
        <div className="mb-8">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-600">
            Inbox
          </p>
          <h1 className="mt-2 text-4xl font-black">Messages</h1>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 shrink-0 animate-pulse rounded-full bg-slate-200" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-1/3 animate-pulse rounded-xl bg-slate-200" />
                    <div className="h-5 w-1/2 animate-pulse rounded-xl bg-slate-200" />
                    <div className="h-4 w-3/4 animate-pulse rounded-xl bg-slate-200" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : conversations.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-14 text-center">
            <MessageCircle className="mx-auto text-slate-300" size={48} />
            <h2 className="mt-4 text-2xl font-black">No messages yet</h2>
            <p className="mt-2 font-semibold text-slate-500">
              Start by messaging a seller from any listing page.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {conversations.map((conversation) => {
              const otherUser =
                user?.id === conversation.buyer_id
                  ? conversation.seller_name
                  : conversation.buyer_name;

              const timestamp = timeAgo(conversation.updated_at || conversation.last_message_at);

              return (
                <Link
                  key={conversation.id}
                  to={`/chat/${conversation.id}`}
                  className="flex items-center gap-4 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  {/* Avatar */}
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-sm font-black text-white">
                    {(otherUser || "U").charAt(0).toUpperCase()}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black uppercase tracking-[0.12em] text-emerald-600 truncate">
                      {conversation.ad_title}
                    </p>
                    <h2 className="mt-0.5 text-base font-black text-slate-900">
                      {otherUser || "Ustaadji User"}
                    </h2>
                    <p className="mt-0.5 line-clamp-1 text-sm font-semibold text-slate-500">
                      {conversation.last_message || "No messages yet"}
                    </p>
                  </div>

                  {/* Time + arrow */}
                  <div className="shrink-0 flex flex-col items-end gap-2">
                    {timestamp && (
                      <span className="text-xs font-semibold text-slate-400">{timestamp}</span>
                    )}
                    <ArrowRight className="text-slate-300" size={18} />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
