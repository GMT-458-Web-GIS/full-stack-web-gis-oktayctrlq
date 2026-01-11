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

  } catch (err) {
    console.error("Hata:", err.message);
  } finally {
    pool.end();
  }
}

checkIndex();