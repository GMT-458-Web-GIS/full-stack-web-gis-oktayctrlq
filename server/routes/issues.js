/* Dosya: server/routes/issues.js */
const express = require("express");
const router = express.Router();
const pool = require("../db/postgres");
const auth = require("../middleware/auth");
const multer = require("multer");
const path = require("path");

// Dosya yükleme ayarları
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: function (req, file, cb) { 
    cb(null, Date.now() + path.extname(file.originalname)); 
  },
});
const upload = multer({ storage: storage });

/**
 * @swagger
 * /api/issues:
 * get:
 * summary: Tüm sorunları listeler
 * tags: [Issues]
 * responses:
 * 200:
 * description: Başarılı
 */
router.get("/", async (req, res) => {
  try {
    // PostGIS fonksiyonları ile koordinatları 'lat' ve 'lng' olarak çekiyoruz
    const query = `
      SELECT id, title, description, photo, created_by, created_at,
      ST_X(geom) as lng, ST_Y(geom) as lat 
      FROM issues 
      ORDER BY created_at DESC`;
    const allIssues = await pool.query(query);
    res.json(allIssues.rows);
  } catch (err) { 
    console.error("Veri çekme hatası:", err.message);
    res.status(500).send("Sunucu Hatası"); 
  }
});

/**
 * @swagger
 * /api/issues:
 * post:
 * summary: Yeni bir sorun bildirimi oluşturur
 * tags: [Issues]
 * security:
 * - bearerAuth: []
 * responses:
 * 200:
 * description: Oluşturuldu
 */
router.post("/", auth, upload.single("photo"), async (req, res) => {
  try {
    const { title, description, latitude, longitude } = req.body;
    
    // Veritabanına sadece dosya adını kaydediyoruz (Frontend ile uyum için)
    const photo = req.file ? req.file.filename : null;
    
    const userRes = await pool.query("SELECT username FROM users WHERE id = $1", [req.user.id]);
    const username = userRes.rows[0]?.username || "Anonim";

    // Mekânsal Veri (Point) kaydı:
    const newIssue = await pool.query(
      `INSERT INTO issues (title, description, photo, geom, created_by) 
       VALUES ($1, $2, $3, ST_SetSRID(ST_MakePoint($5, $4), 4326), $6) 
       RETURNING *, ST_X(geom) as lng, ST_Y(geom) as lat`,
      [title, description, photo, latitude, longitude, username]
    );
    res.json(newIssue.rows[0]);
  } catch (err) { 
    console.error("Ekleme hatası:", err.message);
    res.status(500).send("Sunucu Hatası: " + err.message); 
  }
});

/**
 * @swagger
 * /api/issues/{id}:
 * delete:
 * summary: Belirtilen sorunu siler
 * tags: [Issues]
 * parameters:
 * - in: path
 * name: id
 * required: true
 * responses:
 * 200:
 * description: Silindi
 */
router.delete("/:id", auth, async (req, res) => {
  try {
    // Rol Kontrolü: 'Vatandaş' ve 'citizen' rollerini yetkisiz kılıyoruz
    if (req.user.role === "Vatandaş" || req.user.role === "citizen") {
       return res.status(403).json({ error: "Silmek için yetkili olmalısınız!" });
    }
    await pool.query("DELETE FROM issues WHERE id = $1", [req.params.id]);
    res.json({ message: "Silindi" });
  } catch (err) { 
    console.error("Silme hatası:", err.message);
    res.status(500).send("Sunucu Hatası"); 
  }
});

module.exports = router;