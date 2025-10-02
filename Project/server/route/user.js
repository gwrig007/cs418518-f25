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

//API with multiple parameters
user.get("/:user/:postId", (req, res) => {
  res.json({
    status: 200,
    message: "Response from GET API",
    userId: req.params.user,
    postId: req.params.postId,
  });
});

// Post API
// -- add body-parser package include as a middleware
// app.use(bodyParser.json());
user.post("/", (req, res) => {
  connection.execute(
    "insert into user_info (u_first_name,u_last_name,u_email,u_password,is_verified,is_admin) values (?,?,?,?,?,?)",
    [
      req.body.u_first_name,
      req.body.u_last_name,
      req.body.u_email,
      req.body.u_password,
      req.body.is_verified,
      req.body.is_admin,
    ],
    function (error, result) {
      if (error) {
        res.json({ message: error.message });
      }
      res.json({
        status: "200",
        message: "Response of post api",
        result: result,
      });
    }
  );
});

//PUT API
user.put("/:id", (req, res) => {
  connection.execute(
    "update user_info set u_first_name=?, u_last_name=? where u_id=?",
    [req.body.u_first_name, req.body.u_last_name, req.params.id],
    function (error, result) {
      if (error) {
        res.json({ message: error.message });
      }
      res.json({
        status: "200",
        message: "Response of put api",
        result: result,
      });
    }
  );
});

//Delete API
user.delete("/:id", (req, res) => {
  connection.execute(
    "delete from user_info where u_id=?",
    [req.params.id],
    function (error, result) {
      if (error) {
        res.json({ message: error.message });
      }
      res.json({
        status: "200",
        message: "Response of put api",
        result: result,
      });
    }
  );
});

//Login API
user.post("/login", (req, res) => {
  connection.execute(
    "select * from user_info where u_email=? and u_password=?",
    [req.body.Email, req.body.Password],
    function (error, result) {
      if (error) {
        res.json({ message: error.message });
      }
      if (result.length > 0) {
        res.json({
          status: "200",
          message: "Response of post api",
          result: result,
        });
      }
    }
  );
});

export default user;
