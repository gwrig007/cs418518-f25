// ==============================
// ODU Course Advising Portal Backend
// ==============================

import express from "express";
import cors from "cors";
import https from "https";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// ====== Path setup ======
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ====== Middleware ======
app.use(cors());
app.use(express.json());

// ====== Example API route ======
app.get("/user/profile", (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ message: "Email required" });

  // Example mock response
  res.json({
    u_first_name: "Grace",
    u_last_name: "Wright",
    email: email,
  });
});

// ====== Example POST route ======
app.post("/user/register", (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  console.log("New user registered:", firstName, lastName, email);
  res.json({ message: "✅ User registered successfully!" });
});

// ====== HTTPS configuration ======
const options = {
  key: fs.readFileSync(path.join(__dirname, "certs", "key.pem")),
  cert: fs.readFileSync(path.join(__dirname, "certs", "cert.pem")),
};

// ====== Start server ======
const PORT = 8080;

https.createServer(options, app).listen(PORT, () => {
  console.log(`✅ HTTPS Server running at https://localhost:${PORT}`);
});
