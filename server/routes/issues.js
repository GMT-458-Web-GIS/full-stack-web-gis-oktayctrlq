/* Dosya: server/routes/issues.js (BELEDİYE + UPDATE ÖZELLİĞİ) */
const express = require("express");
const router = express.Router();
const pool = require("../db/postgres");
const auth = require("../middleware/auth");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: function (req, file, cb) { cb(null, Date.now() + path.extname(file.originalname)); },
});
const upload = multer({ storage: storage });

/* 1. VERİLERİ GETİR */
router.get("/", async (req, res) => {
  try {
    const query = `SELECT id, title, description, photo, created_by, created_at, ST_AsGeoJSON(geom)::json as geom FROM issues ORDER BY created_at DESC`;
    const allIssues = await pool.query(query);
    res.json(allIssues.rows);
  } catch (err) { res.status(500).send("Sunucu Hatası"); }
});

/* 2. VERİ EKLE (Herkes Ekleyebilir) */
router.post("/", auth, upload.single("photo"), async (req, res) => {
  try {
    const { title, description, latitude, longitude } = req.body;
    const photo = req.file ? `/uploads/${req.file.filename}` : null;
    
    // Kullanıcı adını al
    const userRes = await pool.query("SELECT username FROM users WHERE id = $1", [req.user.id]);
    const username = userRes.rows[0]?.username || "Anonim";

    const newIssue = await pool.query(
      `INSERT INTO issues (title, description, geom, photo, created_by) VALUES ($1, $2, ST_SetSRID(ST_MakePoint($4, $3), 4326), $5, $6) 
       RETURNING id, title, description, photo, created_by, ST_AsGeoJSON(geom)::json as geom`,
      [title, description, latitude, longitude, photo, username]
    );
    res.json(newIssue.rows[0]);
  } catch (err) { res.status(500).send("Sunucu Hatası"); }
});

/* 3. VERİ GÜNCELLE (SADECE PERSONEL VE YÖNETİCİ) - [YENİ ÖZELLİK!] */
router.put("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body; // Sadece açıklamayı güncelleyelim

    // KURAL: Vatandaş güncelleyemez! Sadece Personel ve Admin.
    if (req.user.role === "citizen") {
        return res.status(403).json({ error: "Vatandaşlar güncelleme yapamaz!" });
    }

    const updateQuery = "UPDATE issues SET description = $1 WHERE id = $2 RETURNING *";
    const update = await pool.query(updateQuery, [description, id]);

    if (update.rows.length === 0) return res.status(404).json({ error: "Kayıt bulunamadı" });

    res.json({ message: "Güncellendi", issue: update.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Sunucu Hatası");
  }
});

/* 4. VERİ SİL (SADECE YÖNETİCİ) */
router.delete("/:id", auth, async (req, res) => {
  try {
    // KURAL: Sadece 'admin' silebilir!
    if (req.user.role !== "admin") {
       return res.status(403).json({ error: "Silmek için YÖNETİCİ olmalısınız!" });
    }
    await pool.query("DELETE FROM issues WHERE id = $1", [req.params.id]);
    res.json({ message: "Silindi" });
  } catch (err) { res.status(500).send("Sunucu Hatası"); }
});

module.exports = router;