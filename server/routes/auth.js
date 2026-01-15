const express = require("express");
const router = express.Router();
const pool = require("../db/postgres");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  try {
    const { username, password, role } = req.body;
    
    // Rolleri frontend ile uyumlu hale getiriyoruz
    const dbRole = (role === "Vatandaş" || role === "citizen") ? "citizen" : "staff";

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const newUser = await pool.query(
      "INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING id, username, role",
      [username, hashedPassword, dbRole]
    );
    res.json(newUser.rows[0]);
  } catch (err) { 
    console.error(err);
    res.status(500).json({ error: "Sunucu hatası: " + err.message }); 
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
    if (result.rows.length === 0) return res.status(401).json({ error: "Kullanıcı bulunamadı" });
    
    const valid = await bcrypt.compare(password, result.rows[0].password);
    if (!valid) return res.status(401).json({ error: "Şifre hatalı" });
    
    const token = jwt.sign({ id: result.rows[0].id, role: result.rows[0].role }, "GIZLI_KELIME");
    res.json({ token, role: result.rows[0].role, username: result.rows[0].username });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;