import { BrowserRouter, Routes, Route } from "react-router-dom";
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

export default function App() {
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
      </Routes>
    </BrowserRouter>
  );
}
