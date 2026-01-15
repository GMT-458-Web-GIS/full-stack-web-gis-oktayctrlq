/* Dosya: server/routes/issues.js - TEMİZ VE HATASIZ SÜRÜM */
const express = require("express");
const router = express.Router();
const pool = require("../db/postgres");
const auth = require("../middleware/auth");
const multer = require("multer");
const path = require("path");

// Dosya yükleme ayarları (Fotoğraflar için)
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: function (req, file, cb) { 
    cb(null, Date.now() + path.extname(file.originalname)); 
  },
});
const upload = multer({ storage: storage });

/* 1. TÜM VERİLERİ LİSTELE */
router.get("/", async (req, res) => {
  try {
    const query = `SELECT * FROM issues ORDER BY created_at DESC`;
    const allIssues = await pool.query(query);
    res.json(allIssues.rows);
  } catch (err) { 
    console.error("Veri çekme hatası:", err.message);
    res.status(500).send("Sunucu Hatası"); 
  }
});

/* 2. YENİ SORUN EKLE */
router.post("/", auth, upload.single("photo"), async (req, res) => {
  try {
    const { title, description, latitude, longitude } = req.body;
    const photo = req.file ? `/uploads/${req.file.filename}` : null;
    
    // Kullanıcı adını ID üzerinden çekiyoruz
    const userRes = await pool.query("SELECT username FROM users WHERE id = $1", [req.user.id]);
    const username = userRes.rows[0]?.username || "Anonim";

    const newIssue = await pool.query(
      `INSERT INTO issues (title, description, photo, lat, lng, created_by) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [title, description, photo, latitude, longitude, username]
    );
    res.json(newIssue.rows[0]);
  } catch (err) { 
    console.error("Ekleme hatası:", err.message);
    res.status(500).send("Sunucu Hatası: " + err.message); 
  }
});

/* 3. VERİ GÜNCELLE (Belediye ve Admin Yetkili) */
router.put("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;

    // Rol Kontrolü
    if (req.user.role === "Vatandaş") {
        return res.status(403).json({ error: "Vatandaşlar güncelleme yapamaz!" });
    }

    const updateQuery = "UPDATE issues SET description = $1 WHERE id = $2 RETURNING *";
    const update = await pool.query(updateQuery, [description, id]);

    if (update.rows.length === 0) return res.status(404).json({ error: "Kayıt bulunamadı" });

    res.json({ message: "Güncellendi", issue: update.rows[0] });
  } catch (err) {
    console.error("Güncelleme hatası:", err.message);
    res.status(500).send("Sunucu Hatası");
  }
});

/* 4. VERİ SİL (Belediye ve Admin Yetkili) */
router.delete("/:id", auth, async (req, res) => {
  try {
    // Rol Kontrolü
    if (req.user.role === "Vatandaş") {
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