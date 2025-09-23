import { Router } from "express";
import { connection } from "../database/connection.js";
const user = Router();

user.get("/", (req, res) => {
  ////write logic
  connection.execute("select * from user_info", function (err, result) {
    if (err) {
      return res.json({ message: err.message });
    }
    // response json
    res.json({
      status: 200,
      message: "Response from get api",
      result: result,
    });
  });
});

user.get("/:id", (req, res) => {
  ////write logic
  // response json
  res.json({
    status: 200,
    message: "Response from get api",
    id: req.params.id,
  });
});

export default user;
