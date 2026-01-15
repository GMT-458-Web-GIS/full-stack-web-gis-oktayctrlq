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

router.get("/", async (req, res) => {
  try {
    const query = "SELECT id, title, description, photo, created_by, ST_X(geom) as lng, ST_Y(geom) as lat FROM issues ORDER BY created_at DESC";
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) { res.status(500).send("Veri çekme hatası"); }
});

router.post("/", auth, upload.single("photo"), async (req, res) => {
  try {
    const { title, description, latitude, longitude } = req.body;
    const photo = req.file ? req.file.filename : null;
    
    const userRes = await pool.query("SELECT username FROM users WHERE id = $1", [req.user.id]);
    const username = userRes.rows[0]?.username || "Anonim";

    // PostGIS mekansal veri girişi
    const newIssue = await pool.query(
      "INSERT INTO issues (title, description, photo, geom, created_by) VALUES ($1, $2, $3, ST_SetSRID(ST_MakePoint($5, $4), 4326), $6) RETURNING id, title, ST_X(geom) as lng, ST_Y(geom) as lat",
      [title, description, photo, latitude, longitude, username]
    );
    res.json(newIssue.rows[0]);
  } catch (err) { 
    console.error(err);
    res.status(500).json({ error: "Kaydetme hatası: " + err.message }); 
  }
});

module.exports = router;