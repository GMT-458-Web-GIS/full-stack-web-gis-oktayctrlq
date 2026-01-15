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
  swaggerDefinition: {
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
  apis: ['./routes/*.js'], 
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

// --- MIDDLEWARE ---
app.use(cors()); // Farklı bilgisayarlardan/cihazlardan erişim için kritik
app.use(express.json());

// Swagger Rotası
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// --- DOSYA YOLLARI VE STATİK SUNUM ---
// Önemli: Klasör yapınızda 'client' ve 'server' aynı ana dizin altındaysa bu yol doğrudur.
const clientPath = path.join(__dirname, "../client");

// 1. Harita sayfasını (index.html) sunar
app.use(express.static(clientPath));

// 2. Yüklenen fotoğrafları dışarıya açar 
// Tarayıcıdan http://IP:5002/uploads/resim.png şeklinde erişimi sağlar.
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --- API ROTALARI ---
app.use("/api/issues", issuesRouter);
app.use("/api/auth", authRouter);

// Ana Sayfa Yönlendirmesi (IP adresini yazınca index.html açılır)
app.get("/", (req, res) => {
  res.sendFile(path.join(clientPath, "index.html"));
});

// --- VERİTABANI BAĞLANTI TESTİ ---
pool.query("SELECT NOW()")
  .then(() => console.log("✅ AWS PostgreSQL/PostGIS Bağlantısı Başarılı"))
  .catch(err => {
    console.error("❌ Veritabanı Hatası:", err.message);
    // process.exit(1); // Bağlantı kopsa bile sunucunun tamamen kapanmaması için istersen yoruma alabilirsin
  });

// --- SUNUCUYU BAŞLAT ---
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`🚀 Sunucu Yayında: http://13.48.248.53:${PORT}`);
  console.log(`📖 API Dokümantasyonu: http://13.48.248.53:${PORT}/api-docs`);
});