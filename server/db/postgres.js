const { Pool } = require("pg");
require('dotenv').config(); // .env dosyasını okumak için en üste ekle

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "123456", // Şifre yoksa MacBook şifren yedek kalır
  database: process.env.DB_NAME || "belediye_db",
  port: process.env.DB_PORT || 5432,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};