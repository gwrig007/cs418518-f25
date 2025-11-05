import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import user from "./route/user.js";

const app = express();

// ✅ FIX: Allow Netlify frontend domain for all routes
app.use(
  cors({
    origin: [
      "https://oduadvisingportal.netlify.app",
      "https://www.oduadvisingportal.netlify.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ✅ Handle preflight requests globally
app.options("*", cors());

// ✅ Parse JSON and form data
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// --- Routes ---
app.use("/user", user);

// Root route
app.get("/", (req, res) => {
  res.json({
    status: 200,
    message: "Server is running successfully 🚀",
  });
});

// --- Start Server ---
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});

export default app;
