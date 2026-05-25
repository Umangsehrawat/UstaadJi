import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Send, ArrowLeft } from "lucide-react";
import axios from "axios";
import { io } from "socket.io-client";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const socket = io("https://ustaadji-backend.onrender.com");

export default function Chat() {
  const { conversationId } = useParams();

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const messagesEndRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchMessages = async () => {
    const response = await axios.get(
      `https://ustaadji-backend.onrender.com/api/chat/${conversationId}/messages`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setMessages(response.data);
  };

  const markAsRead = async () => {
    try {
      await axios.put(
        `https://ustaadji-backend.onrender.com/api/chat/${conversationId}/read`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    socket.emit("joinConversation", conversationId);

    fetchMessages();
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
      const response = await axios.post(
        "https://ustaadji-backend.onrender.com/api/chat/message",
        {
          conversation_id: conversationId,
          message: text,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const newMessage = {
        ...response.data,
        sender_name: user?.name,
      };

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

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <Navbar />

      <section className="mx-auto max-w-4xl px-4 py-10">
        <Link
          to="/messages"
          className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-950"
        >
          <ArrowLeft size={18} />
          Back to messages
        </Link>

        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl">
          <div className="border-b border-slate-200 p-6">
            <h1 className="text-2xl font-black">Ustaadji Chat</h1>
            <p className="mt-1 text-sm font-semibold text-slate-500">
              Real-time buyer and seller conversation
            </p>
          </div>

          <div className="h-[500px] space-y-4 overflow-y-auto bg-slate-50 p-6">
            {messages.length === 0 ? (
              <div className="flex h-full items-center justify-center text-center">
                <p className="font-bold text-slate-500">
                  No messages yet. Start the conversation.
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
                    <div
                      className={`max-w-[75%] rounded-3xl px-5 py-3 ${
                        isMe
                          ? "bg-emerald-500 text-white"
                          : "border border-slate-200 bg-white text-slate-800"
                      }`}
                    >
                      <p className="text-sm font-black">
                        {isMe ? "You" : msg.sender_name || "User"}
                      </p>

                      <p className="mt-1 font-semibold">{msg.message}</p>
                    </div>
                  </div>
                );
              })
            )}

            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={sendMessage}
            className="flex gap-3 border-t border-slate-200 p-4"
          >
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 rounded-2xl border border-slate-200 px-4 py-4 font-semibold outline-none focus:border-emerald-400"
            />

            <button
              type="submit"
              className="flex items-center gap-2 rounded-2xl bg-slate-950 px-6 py-4 font-black text-white hover:bg-slate-800"
            >
              <Send size={18} />
              Send
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </main>
  );
}