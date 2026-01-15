const express = require("express");
const router = express.Router();
const pool = require("../db/postgres");
const auth = require("../middleware/auth");

router.get("/", async (req, res) => {
  try {
    const query = "SELECT id, title, description, photo, ST_X(geom) as lng, ST_Y(geom) as lat FROM issues";
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) { res.status(500).send(err.message); }
});

module.exports = router;