import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import HomePage from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PostAd from "./pages/PostAd";
import AdDetails from "./pages/AdDetails";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import EditAd from "./pages/EditAd";
import Chat from "./pages/Chat";
import Messages from "./pages/Messages";
import Favorites from "./pages/Favorites";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Support from "./pages/Support";
import NotFound from "./pages/NotFound";

// Changes tab title + favicon to orange when the user switches away
function useTabVisibility() {
  useEffect(() => {
    const originalTitle = document.title;

    const getFavicon = () => document.querySelector("link[rel~='icon']");

    const handleVisibility = () => {
      const favicon = getFavicon();
      if (document.hidden) {
        document.title = "👋 Come back to Ustaadji!";
        if (favicon) favicon.href = "/favicon-away.svg";
      } else {
        document.title = originalTitle;
        if (favicon) favicon.href = "/logo-icon.png?v=4";
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);
}

export default function App() {
  useTabVisibility();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/post-ad" element={<PostAd />} />
        <Route path="/ads/:id" element={<AdDetails />} />
        <Route path="/edit-ad/:id" element={<EditAd />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/chat/:conversationId" element={<Chat />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/support" element={<Support />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
