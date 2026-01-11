/* Dosya: server/setup.js (PERFORMANS İNDEKSİ EKLENDİ) */
const pool = require("./db/postgres");

const createTablesQuery = `
    -- 1. Kullanıcılar Tablosu
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role VARCHAR(20) DEFAULT 'citizen', -- citizen, staff, admin
        created_at TIMESTAMP DEFAULT NOW()
    );

    -- 2. Sorunlar Tablosu (PostGIS Geometrisi ile)
    CREATE TABLE IF NOT EXISTS issues (
        id SERIAL PRIMARY KEY,
        title VARCHAR(100),
        description TEXT,
        photo TEXT,
        geom GEOMETRY(Point, 4326),
        created_by VARCHAR(50),
        created_at TIMESTAMP DEFAULT NOW()
    );

    -- 3. PERFORMANS İÇİN İNDEKSLEME (R-TREE / GIST)
    -- Bu satır, harita sorgularını hızlandırır ve projedeki %25'lik Performans şartını sağlar.
    CREATE INDEX IF NOT EXISTS issues_geom_idx ON issues USING GIST (geom);
`;

async function setupDatabase() {
  try {
    console.log("🛠 Tablolar ve İndeksler oluşturuluyor...");
    await pool.query(createTablesQuery);
    console.log("✅ BAŞARILI: Tablolar hazır ve GIST (R-Tree) İndeksi oluşturuldu!");
  } catch (err) {
    console.error("❌ HATA:", err.message);
  } finally {
    pool.end();
  }
}

setupDatabase();