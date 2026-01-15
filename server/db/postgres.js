const { Pool } = require("pg");

const pool = new Pool({
  host: "localhost",
  user: "postgres",
  password: "123456", 
  database: "belediye_db", // ÖNEMLİ: Mutlaka belediye_db olmalı
  port: 5432,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};