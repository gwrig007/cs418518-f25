import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import user from "./route/user.js";

const app = express();

// ✅ CORS Configuration
const allowedOrigins = [
  "https://oduadvisingportal.netlify.app",
  "http://localhost:5500",
  "http://127.0.0.1:5500",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow no origin (like Postman or direct curl)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed for this origin"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// ✅ Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ Logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// ✅ Routes
app.use("/user", user);

// ✅ Health check
app.get("/", (req, res) => {
  res.json({ message: "Server is running 🚀" });
});

// ✅ Global error handler (prevents Render 502 crash)
app.use((err, req, res, next) => {
  console.error("🔥 Server error:", err.message);
  res
    .status(500)
    .json({ message: "Internal server error", error: err.message });
});

// ✅ Catch-all 404 route
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ✅ Start server
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`✅ Server running on port ${port}`));

export default app;
