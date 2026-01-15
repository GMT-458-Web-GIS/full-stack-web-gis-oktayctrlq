require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const pool = require("./db/postgres");

// Swagger Paketleri
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Rotaları İçe Aktar
const issuesRouter = require("./routes/issues");
const authRouter = require("./routes/auth");

const app = express();

// --- SWAGGER AYARLARI ---
const swaggerOptions = {
  swaggerDefinition: { // 'definition' veya 'swaggerDefinition' ikisi de olur
    openapi: '3.0.0',
    info: {
      title: 'Belediye CBS API',
      version: '1.0.0',
      description: 'Akıllı Kent Yönetim Sistemi API Dokümantasyonu',
    },
    servers: [
        { url: 'http://13.48.248.53:5002', description: 'Canlı AWS Sunucusu' },
        { url: 'http://localhost:5002', description: 'Yerel Geliştirme' }
    ],
  },
  // KRİTİK DÜZELTME: Yolun başına 'server/' ekledik
  apis: ['./server/routes/*.js', './server/server.js'], 
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

// --- MIDDLEWARE ---
app.use(cors()); 
app.use(express.json());

// Swagger Rotası
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// --- DOSYA YOLLARI VE STATİK SUNUM ---
const clientPath = path.join(__dirname, "../client");
app.use(express.static(clientPath));

// Fotoğraflar için statik yol
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --- API ROTALARI ---
app.use("/api/issues", issuesRouter);
app.use("/api/auth", authRouter);

app.get("/", (req, res) => {
  res.sendFile(path.join(clientPath, "index.html"));
});

// --- VERİTABANI BAĞLANTI TESTİ ---
pool.query("SELECT NOW()")
  .then(() => console.log("✅ AWS PostgreSQL/PostGIS Bağlantısı Başarılı"))
  .catch(err => {
    console.error("❌ Veritabanı Hatası:", err.message);
  });

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`🚀 Sunucu Yayında: http://13.48.248.53:${PORT}`);
  console.log(`📖 API Dokümantasyonu: http://13.48.248.53:${PORT}/api-docs`);
});