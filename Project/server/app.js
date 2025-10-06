import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import user from "./route/user.js";

const app = express();
const port = 8080;

// ✅ Start server
app.listen(port, () => {
  console.log(`Server is listening at port ${port}`);
});

// ✅ Middleware example
const myLogger = function (req, res, next) {
  console.log("Calling middleware function");
  next();
};
app.use(myLogger);

// ✅ Enable CORS for your frontend
app.use(
  cors({
    origin: "http://localhost:5173", // frontend origin
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

// ✅ Parse incoming JSON
app.use(bodyParser.json());

// ✅ Use your user route (make sure route/user.js exists)
app.use("/user", user);

// ✅ Example base route
app.get("/", (req, res) => {
  res.send("Response from GET API");
});

// ✅ Example route handling all HTTP methods
app.all("/test", (req, res) => {
  res.json({
    status: 200,
    message: "Response from ALL API",
  });
});

// ✅ Just a console test
const a = 30;
console.log(a);

export default app;
