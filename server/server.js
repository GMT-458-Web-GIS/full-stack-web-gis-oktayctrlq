require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const pool = require("./db/postgres");

const issuesRouter = require("./routes/issues");
const authRouter = require("./routes/auth");

const app = express();

app.use(cors());
app.use(express.json());

const clientPath = path.join(__dirname, "../client");
app.use(express.static(clientPath));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/issues", issuesRouter);
app.use("/api/auth", authRouter);

app.get("/", (req, res) => { res.sendFile(path.join(clientPath, "index.html")); });

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => { console.log(`🚀 Sunucu Yayında: ${PORT}`); });