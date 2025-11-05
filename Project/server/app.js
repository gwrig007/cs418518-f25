import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import user from "./route/user.js";

const app = express();

// ✅ Allow your frontend domain
app.use(cors({
  origin: "https://oduadvisingportal.netlify.app",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

// Simple logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// --- Routes ---
app.use("/user", user);

// Root route
app.get("/", (req, res) => {
  res.json({
    status: 200,
    message: "Server is running successfully 🚀",
  });
});

// --- Step 4: START SERVER ---
const port = process.env.PORT || 8080; // ✅ required for Render
app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});

export default app;
