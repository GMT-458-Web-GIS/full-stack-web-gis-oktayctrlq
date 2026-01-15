const pool = require("./db/postgres");

async function checkIndex() {
  try {
    console.log("🕵️‍♂️ İndeksler Kontrol Ediliyor...");
    
    // Veritabanına soruyoruz: 'issues' tablosunda hangi indeksler var?
    const res = await pool.query(`
      SELECT indexname, indexdef 
      FROM pg_indexes 
      WHERE tablename = 'issues';
    `);

    console.log("\n📋 BULUNAN İNDEKSLER:");
    res.rows.forEach((row, i) => {
      console.log(`${i + 1}. İSİM: ${row.indexname}`);
      console.log(`   TANIM: ${row.indexdef}`);
      console.log("------------------------------------------------");
    });

  } catch (err) {-- Mevcut tabloları temizleyip en hatasız haliyle kuralım
DROP TABLE IF EXISTS issues;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id SERIAL PRIMARY KEY, 
    username TEXT UNIQUE NOT NULL, 
    password TEXT NOT NULL, 
    role TEXT DEFAULT 'Vatandaş'
);

CREATE TABLE issues (
    id SERIAL PRIMARY KEY, 
    title TEXT NOT NULL, 
    description TEXT, 
    photo TEXT, 
    lat REAL, 
    lng REAL, 
    created_at TIMESTAMP DEFAULT NOW()
);

-- Senin giriş yapabilmen için örnek kullanıcı -- 
INSERT INTO users (username, password, role) VALUES ('123456', '123456', 'Vatandaş');
    console.error("Hata:", err.message);
  } finally {
    pool.end();
  }
}

checkIndex();