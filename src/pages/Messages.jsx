import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MessageCircle, ArrowRight } from "lucide-react";
import axios from "axios";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Messages() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await axios.get("http://https://ustaadji-backend.onrender.com/api/chat", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setConversations(response.data);
      } catch (error) {
        console.error(error);
        alert("Failed to load messages");
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [token]);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <Navbar />

      <section className="mx-auto max-w-5xl px-4 py-12">
        <div className="mb-8">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-600">
            Inbox
          </p>

          <h1 className="mt-2 text-4xl font-black">Messages</h1>
        </div>

        {loading ? (
          <p className="text-lg font-black">Loading conversations...</p>
        ) : conversations.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-12 text-center">
            <MessageCircle className="mx-auto text-slate-400" size={44} />
            <h2 className="mt-4 text-2xl font-black">No messages yet</h2>
            <p className="mt-2 font-semibold text-slate-500">
              Start by messaging a seller from an ad page.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {conversations.map((conversation) => {
              const otherUser =
                user?.id === conversation.buyer_id
                  ? conversation.seller_name
                  : conversation.buyer_name;

              return (
                <Link
                  key={conversation.id}
                  to={`/chat/${conversation.id}`}
                  className="flex items-center justify-between rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div>
                    <p className="text-sm font-black uppercase tracking-[0.15em] text-emerald-600">
                      {conversation.ad_title}
                    </p>

                    <h2 className="mt-2 text-xl font-black">
                      {otherUser || "Ustaadji User"}
                    </h2>

                    <p className="mt-1 line-clamp-1 font-semibold text-slate-500">
                      {conversation.last_message || "No messages yet"}
                    </p>
                  </div>

                  <ArrowRight className="text-slate-400" size={24} />
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