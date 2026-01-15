const express = require("express");
const router = express.Router();
const pool = require("../db/postgres");
const auth = require("../middleware/auth");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => { cb(null, Date.now() + path.extname(file.originalname)); },
});
const upload = multer({ storage: storage });

/**
 * @swagger
 * /api/issues:
 * get:
 * summary: Sorunları listele
 * tags: [Issues]
 * responses:
 * 200:
 * description: Başarılı
 */
router.get("/", async (req, res) => {
  try {
    const query = "SELECT id, title, description, photo, created_by, ST_X(geom) as lng, ST_Y(geom) as lat FROM issues ORDER BY created_at DESC";
    const allIssues = await pool.query(query);
    res.json(allIssues.rows);
  } catch (err) { res.status(500).send("Sunucu Hatası"); }
});

/**
 * @swagger
 * /api/issues:
 * post:
 * summary: Yeni sorun bildir
 * tags: [Issues]
 * responses:
 * 200:
 * description: Oluşturuldu
 */
router.post("/", auth, upload.single("photo"), async (req, res) => {
  try {
    const { title, description, latitude, longitude } = req.body;
    const photo = req.file ? req.file.filename : null;
    const userRes = await pool.query("SELECT username FROM users WHERE id = $1", [req.user.id]);
    const username = userRes.rows[0]?.username || "Anonim";
    const newIssue = await pool.query(
      "INSERT INTO issues (title, description, photo, geom, created_by) VALUES ($1, $2, $3, ST_SetSRID(ST_MakePoint($5, $4), 4326), $6) RETURNING *, ST_X(geom) as lng, ST_Y(geom) as lat",
      [title, description, photo, latitude, longitude, username]
    );
    res.json(newIssue.rows[0]);
  } catch (err) { res.status(500).send("Ekleme hatası"); }
});

module.exports = router;