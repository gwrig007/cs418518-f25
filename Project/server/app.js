import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import user from "./route/user.js";

const app = express();

// ✅ Middleware to parse JSON requests
app.use(bodyParser.json()); // or app.use(express.json());

// ✅ Allow both local dev + Netlify frontend
app.use(cors({
  origin: [
    "https://oduadvisingportal.netlify.app",
    "http://localhost:5173",  // for local Vite testing
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

// ✅ Simple logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// ✅ User routes
app.use("/user", user);

// ✅ Root route for testing
app.get("/", (req, res) => {
  res.json({
    status: 200,
    message: "Server is running successfully 🚀",
  });
});

// ✅ Start the server (Render will use this port)
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});

export default app;
