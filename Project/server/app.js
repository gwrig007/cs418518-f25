import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import user from "./route/user.js";

const app = express();

// ✅ Force CORS headers for all routes
const allowedOrigin = "https://oduadvisingportal.netlify.app";

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", allowedOrigin);
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

// ✅ Also use CORS middleware (belt + suspenders)
app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  })
);

// ✅ JSON + body parser
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ Basic logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// ✅ Routes
app.use("/user", user);

// ✅ Root health check
app.get("/", (req, res) => {
  res.json({ message: "Server is running 🚀" });
});

// ✅ Catch-all fallback (still keeps CORS headers)
app.use((req, res) => {
  res.header("Access-Control-Allow-Origin", allowedOrigin);
  res.status(404).json({ message: "Route not found" });
});

// ✅ Start server
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`✅ Server running on port ${port}`));

export default app;
