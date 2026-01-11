/* Dosya: server/server.js */
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const pool = require("./db/postgres");

// Rotaları İçe Aktar
const issuesRouter = require("./routes/issues");
const authRouter = require("./routes/auth"); // <--- YENİ EKLENEN SATIR

const app = express();

// Middleware (Ara Yazılımlar)
app.use(cors());
app.use(express.json());

// --- YOL AYARLARI ---
const clientPath = path.join(__dirname, "../client");

// Statik dosyaları sun
app.use(express.static(clientPath));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --- API ROTALARI ---
app.use("/api/issues", issuesRouter);
app.use("/api/auth", authRouter); // <--- YENİ EKLENEN SATIR (Giriş Sistemi Burayı Kullanacak)

// Ana Sayfa Yönlendirmesi
app.get("/", (req, res) => {
  res.sendFile(path.join(clientPath, "index.html"));
});

// Veritabanı Testi
pool.query("SELECT NOW()")
  .then(() => console.log("✅ Veritabanı Bağlı"))
  .catch(err => {
    console.error("❌ Veritabanı Hatası:", err.message);
    process.exit(1);
  });

// Sunucuyu Başlat
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`🚀 Sunucu Çalışıyor: http://localhost:${PORT}`);
});