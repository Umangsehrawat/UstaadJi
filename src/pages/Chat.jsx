import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Send, ArrowLeft } from "lucide-react";
import axios from "axios";
import { io } from "socket.io-client";
import api from "../api/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const socket = io("https://ustaadji-backend.onrender.com");

export default function Chat() {
  const { conversationId } = useParams();

  const [messages, setMessages] = useState([]);
  const [conversation, setConversation] = useState(null);
  const [text, setText] = useState("");
  const messagesEndRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchMessages = async () => {
    const response = await api.get(
      `/chat/${conversationId}/messages`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setMessages(response.data);
  };

  const fetchConversation = async () => {
    try {
      const response = await api.get("/chat", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const found = response.data.find(
        (c) => String(c.id) === String(conversationId)
      );
      setConversation(found || null);
    } catch (_) {}
  };

  const markAsRead = async () => {
    try {
      await api.put(
        `/chat/${conversationId}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    socket.emit("joinConversation", conversationId);
    fetchMessages();
    fetchConversation();
    markAsRead();

    socket.on("receiveMessage", (message) => {
      if (String(message.conversation_id) === String(conversationId)) {
        setMessages((prev) => {
          const alreadyExists = prev.some((msg) => msg.id === message.id);
          if (alreadyExists) return prev;
          return [...prev, message];
        });
        markAsRead();
      }
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [conversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      const response = await api.post(
        "/chat/message",
        { conversation_id: conversationId, message: text },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const newMessage = { ...response.data, sender_name: user?.name };

      socket.emit("sendMessage", newMessage);

      setMessages((prev) => {
        const alreadyExists = prev.some((msg) => msg.id === newMessage.id);
        if (alreadyExists) return prev;
        return [...prev, newMessage];
      });

      setText("");
    } catch (error) {
      console.error(error);
    }
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const otherUser = conversation
    ? user?.id === conversation.buyer_id
      ? conversation.seller_name
      : conversation.buyer_name
    : null;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <Navbar />

      <section className="mx-auto max-w-4xl px-4 py-10">
        <Link
          to="/messages"
          className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-950 transition"
        >
          <ArrowLeft size={18} />
          Back to messages
        </Link>

        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl">
          {/* Header */}
          <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
            <div className="flex items-center gap-3">
              {otherUser && (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-sm font-black text-white">
                  {otherUser.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <h1 className="font-black text-slate-900">
                  {otherUser || "Conversation"}
                </h1>
                {conversation?.ad_title && (
                  <p className="text-sm font-semibold text-slate-500 truncate max-w-xs">
                    Re: {conversation.ad_title}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Messages area */}
          <div className="h-[500px] space-y-4 overflow-y-auto bg-slate-50 p-6">
            {messages.length === 0 ? (
              <div className="flex h-full items-center justify-center text-center">
                <p className="font-bold text-slate-500">
                  No messages yet. Start the conversation!
                </p>
              </div>
            ) : (
              messages.map((msg) => {
                const isMe = msg.sender_id === user?.id;
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                  >
                    <div className="flex flex-col gap-1">
                      <div
                        className={`max-w-[75%] rounded-3xl px-5 py-3 ${
                          isMe
                            ? "bg-emerald-500 text-white"
                            : "border border-slate-200 bg-white text-slate-800"
                        }`}
                      >
                        <p className={`text-xs font-black mb-1 ${isMe ? "text-emerald-100" : "text-slate-400"}`}>
                          {isMe ? "You" : msg.sender_name || "User"}
                        </p>
                        <p className="font-semibold leading-relaxed">{msg.message}</p>
                      </div>
                      {msg.created_at && (
                        <p className={`text-[11px] font-semibold text-slate-400 px-2 ${isMe ? "text-right" : "text-left"}`}>
                          {formatTime(msg.created_at)}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={sendMessage}
            className="flex gap-3 border-t border-slate-200 p-4"
          >
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 font-semibold outline-none focus:border-emerald-400 transition"
            />
            <button
              type="submit"
              className="flex items-center gap-2 rounded-2xl bg-emerald-500 px-6 py-3 font-black text-white hover:bg-emerald-600 transition shadow-md shadow-emerald-500/20"
            >
              <Send size={16} />
              Send
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </main>
  );
}
