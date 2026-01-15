/* Dosya: server/routes/auth.js */
const express = require("express");
const router = express.Router();
const pool = require("../db/postgres");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/**
 * @swagger
 * /api/auth/register:
 * post:
 * summary: Yeni kullanıcı kaydı
 * tags: [Auth]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * username:
 * type: string
 * password:
 * type: string
 * role:
 * type: string
 * responses:
 * 200:
 * description: Kayıt başarılı
 */
router.post("/register", async (req, res) => {
  try {
    const { username, password, role } = req.body;

    // ÖNEMLİ: index.html'deki değerlerle (citizen, staff, admin) eşleşmeli
    // Veritabanındaki DEFAULT 'citizen' olduğu için bunu koruyoruz
    const allowedRoles = ["citizen", "staff", "admin", "Vatandaş", "Belediye"]; 
    const userRole = allowedRoles.includes(role) ? role : "citizen";

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await pool.query(
      "INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING id, username, role",
      [username, hashedPassword, userRole]
    );

    res.json(newUser.rows[0]);
  } catch (err) {
    console.error("KAYIT HATASI:", err.message);
    res.status(500).json({ error: "Kayıt işlemi sırasında bir hata oluştu." }); 
  }
});

/**
 * @swagger
 * /api/auth/login:
 * post:
 * summary: Kullanıcı girişi
 * tags: [Auth]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * username:
 * type: string
 * password:
 * type: string
 * responses:
 * 200:
 * description: Giriş başarılı, token döner
 */
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const userResult = await pool.query("SELECT * FROM users WHERE username = $1", [username]);

    if (userResult.rows.length === 0) return res.status(401).json({ error: "Kullanıcı bulunamadı" });

    const user = userResult.rows[0];
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ error: "Şifre yanlış" });

    // "GIZLI_KELIME" yerine .env dosyasındaki JWT_SECRET kullanılması daha güvenlidir
    const secret = process.env.JWT_SECRET || "GIZLI_KELIME";
    const token = jwt.sign({ id: user.id, role: user.role }, secret, { expiresIn: "1h" });

    res.json({ token, role: user.role, username: user.username });
  } catch (err) {
    console.error("GİRİŞ HATASI:", err.message);
    res.status(500).json({ error: "Giriş yapılamadı." });
  }
});

module.exports = router;