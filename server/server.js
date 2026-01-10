require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

const app = express();

/* =========================
   MongoDB
========================= */
connectDB();

/* =========================
   Middlewares
========================= */
app.use(cors());
app.use(express.json());

/* uploads klasörü */
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* =========================
   API Routes
========================= */
const issueRoutes = require("./routes/issues");
app.use("/api/issues", issueRoutes);

/* =========================
   CLIENT (HARİTA)
========================= */
// client klasörünü statik yap
app.use(express.static(path.join(__dirname, "../client")));

// ROOT → index.html (HARİTA)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/index.html"));
});

/* =========================
   Server
========================= */
const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
  console.log(`🚀 Server ${PORT} portunda çalışıyor`);
});
