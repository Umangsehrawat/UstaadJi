const express = require("express");
const cors = require("cors");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

require("dotenv").config();

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
});

const pool = require("./config/db");

const runMigrations = async () => {
  try {
    await pool.query(`ALTER TABLE users ALTER COLUMN email DROP NOT NULL`);
  } catch (_) {}
  try {
    await pool.query(`ALTER TABLE users ADD CONSTRAINT users_phone_unique UNIQUE (phone)`);
  } catch (_) {}
  try {
    await pool.query(
      `UPDATE users SET is_admin = true, role = 'admin' WHERE phone = $1`,
      ["9718411915"]
    );
  } catch (_) {}

  const newCategories = [
    "Appliance Repair", "Brick & Masonry", "Carpentry & Woodwork",
    "Electrician", "Excavation & Demolition", "Air Conditioning",
    "Painters & Painting", "Plumbing", "Renovations",
    "Welding", "Windows & Doors", "Deep Cleaning",
    "Marble & Tilework", "Wifi / CCTV / Smart Door", "Other Services",
  ];
  for (const name of newCategories) {
    try {
      await pool.query(
        `INSERT INTO categories (name)
         SELECT $1 WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = $1)`,
        [name]
      );
    } catch (_) {}
  }
};

runMigrations();

const authRoutes = require("./routes/authRoutes");
const adRoutes = require("./routes/adRoutes");
const reportRoutes = require("./routes/reportRoutes");
const chatRoutes = require("./routes/chatRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const adminRoutes = require("./routes/adminRoutes");

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.get("/", (req, res) => {
  res.send("Ustaadji API is running 🚀");
});

app.use("/api/auth", authRoutes);
app.use("/api/ads", adRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/admin", adminRoutes);

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinConversation", (conversationId) => {
    socket.join(`conversation_${conversationId}`);
  });

  socket.on("sendMessage", (data) => {
    io.to(`conversation_${data.conversation_id}`).emit(
      "receiveMessage",
      data
    );
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});