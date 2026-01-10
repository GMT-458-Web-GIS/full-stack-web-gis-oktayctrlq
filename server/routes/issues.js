const express = require("express");
const router = express.Router();
const Issue = require("../models/Issue");
const multer = require("multer");
const path = require("path");

/* =========================
   MULTER (FOTO UPLOAD)
========================= */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

/* =========================
   GET — TÜM ISSUE'LAR
========================= */
router.get("/", async (req, res) => {
  try {
    const issues = await Issue.find();
    res.json(issues);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   POST — FOTO + KONUM + METİN
========================= */
router.post("/", upload.single("photo"), async (req, res) => {
  try {
    const { title, description, lat, lng } = req.body;

    if (!title || !lat || !lng) {
      return res.status(400).json({ error: "Eksik alanlar var" });
    }

    const issue = await Issue.create({
      title,
      description,
      location: {
        type: "Point",
        coordinates: [Number(lng), Number(lat)]
      },
      photo: req.file ? req.file.filename : null
    });

    res.status(201).json(issue);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
