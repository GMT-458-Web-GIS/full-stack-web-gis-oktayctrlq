/* Dosya: server/routes/auth.js (BELEDİYE VERSİYONU) */
const express = require("express");
const router = express.Router();
const pool = require("../db/postgres");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/* --- KAYIT OL (YENİ ROLLERLE) --- */
router.post("/register", async (req, res) => {
  try {
    const { username, password, role } = req.body;

    // Rol Kontrolü (Güvenlik için sadece bunlara izin verelim)
    const allowedRoles = ["citizen", "staff", "admin"];
    const userRole = allowedRoles.includes(role) ? role : "citizen"; // Hatalıysa vatandaşa düşür

    // Şifreleme
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await pool.query(
      "INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING id, username, role",
      [username, hashedPassword, userRole]
    );

    res.json(newUser.rows[0]);
  } catch (err) {
    console.error("KAYIT HATASI:", err.message);
    res.status(500).json({ error: err.message }); 
  }
});

/* --- GİRİŞ YAP --- */
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const userResult = await pool.query("SELECT * FROM users WHERE username = $1", [username]);

    if (userResult.rows.length === 0) return res.status(401).json({ error: "Kullanıcı bulunamadı" });

    const user = userResult.rows[0];
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ error: "Şifre yanlış" });

    const token = jwt.sign({ id: user.id, role: user.role }, "GIZLI_KELIME", { expiresIn: "1h" });

    res.json({ token, role: user.role, username: user.username });
  } catch (err) {
    console.error("GİRİŞ HATASI:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;