import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import user from "./route/user.js";

const app = express();
const port = 8080;

// --- Middleware ---
app.use(bodyParser.json());

app.use(
  cors({
    origin: "http://127.0.0.1:5500", // or http://localhost:5173 if using Vite
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

const myLogger = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
};
app.use(myLogger);

// --- Routes ---
app.use("/user", user); // mount user routes

app.get("/", (req, res) => {
  res.json({
    status: 200,
    message: "Server is running successfully 🚀",
  });
});

app.all("/test", (req, res) => {
  res.json({
    status: 200,
    message: "Response from ALL API",
  });
});

// --- Start server ---
app.listen(port, () => {
  console.log(`✅ Server is listening at port ${port}`);
});

export default app;
