require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const pool = require("./db/postgres");

// 1. Swagger Paketlerini İçe Aktar
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Rotaları İçe Aktar
const issuesRouter = require("./routes/issues");
const authRouter = require("./routes/auth");

const app = express(); // <--- Önce uygulama başlatılmalı!

// 2. Swagger Ayarlarını Yapılandır
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Belediye CBS API',
      version: '1.0.0',
      description: 'Akıllı Kent Yönetim Sistemi API Dokümantasyonu',
    },
    servers: [{ url: 'http://localhost:5002' }],
  },
  apis: ['./routes/*.js'], // Routes klasöründeki JSDoc yorumlarını oku
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Middleware (Ara Yazılımlar)
app.use(cors());
app.use(express.json());

// 3. Swagger Rotasını Tanımla
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// --- YOL AYARLARI ---
const clientPath = path.join(__dirname, "../client");

// Statik dosyaları sun
app.use(express.static(clientPath));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --- API ROTALARI ---
app.use("/api/issues", issuesRouter);
app.use("/api/auth", authRouter);

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
  console.log(`📖 API Dokümantasyonu: http://localhost:${PORT}/api-docs`);
});