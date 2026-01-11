/* Dosya: server/middleware/auth.js */
const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  // 1. Token'ı al (Header'dan)
  const token = req.header("x-auth-token");

  // 2. Token yoksa içeri alma
  if (!token) {
    return res.status(401).json({ error: "Yetkisiz Erişim! Lütfen giriş yapın." });
  }

  // 3. Token geçerli mi diye kontrol et
  try {
    const decoded = jwt.verify(token, "GIZLI_KELIME"); // auth.js'teki kelimeyle aynı olmalı
    req.user = decoded; // Kullanıcı bilgisini isteğe ekle
    next(); // Devam et (Kapıyı aç)
  } catch (err) {
    res.status(400).json({ error: "Geçersiz Token." });
  }
};