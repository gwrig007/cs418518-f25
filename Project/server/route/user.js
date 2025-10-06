import { Router } from "express";
import { connection } from "../database/connection.js";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";

const user = Router();

// ✅ Set up email transporter ONCE
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // your Gmail address
    pass: process.env.EMAIL_PASS, // app password
  },
});

// ✅ REGISTER (sign-up)
user.post("/register", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  // Check for existing email
  connection.execute(
    "SELECT * FROM user_information WHERE u_email = ?",
    [email],
    async (err, results) => {
      if (err) return res.status(500).json({ message: err.message });
      if (results.length > 0) {
        return res.status(400).json({ message: "Email already registered." });
      }

      // Encrypt password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert user
      connection.execute(
        "INSERT INTO user_information (u_first_name, u_last_name, u_email, u_password, is_verified, is_admin) VALUES (?, ?, ?, ?, ?, ?)",
        [firstName, lastName, email, hashedPassword, 0, 0],
        async (error, result) => {
          if (error) return res.status(500).json({ message: error.message });

          // Send verification email
          const verifyLink = `http://localhost:8080/user/verify?email=${encodeURIComponent(email)}`;
          await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Verify your email - Course Advising Portal",
            html: `
              <p>Hi ${firstName},</p>
              <p>Click below to verify your account:</p>
              <a href="${verifyLink}">${verifyLink}</a>
            `,
          });

          res.status(201).json({
            status: 201,
            message: "User registered successfully! Please verify your email.",
          });
        }
      );
    }
  );
});

// ✅ VERIFY EMAIL
user.get("/verify", (req, res) => {
  const { email } = req.query;

  connection.execute(
    "UPDATE user_information SET is_verified = 1 WHERE u_email = ?",
    [email],
    (error, result) => {
      if (error) return res.status(500).json({ message: error.message });
      res.send(`
        <h2>Email verified successfully! You can now log in.</h2>
        <a href="http://127.0.0.1:5500/cs418518-f25/Project/client/signin.html">Go to Login</a>
      `);
    }
  );
});

// ✅ LOGIN with OTP
user.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Check user exists
  connection.execute(
    "SELECT * FROM user_information WHERE u_email = ?",
    [email],
    async (error, result) => {
      if (error) return res.status(500).json({ message: error.message });
      if (result.length === 0)
        return res.status(401).json({ message: "Invalid email or password" });

      const user = result[0];
      const match = await bcrypt.compare(password, user.u_password);

      if (!match)
        return res.status(401).json({ message: "Invalid password" });

      if (!user.is_verified)
        return res.status(403).json({ message: "Please verify your email first." });

      // ✅ Generate OTP
      const otp = Math.floor(100000 + Math.random() * 900000);

      // Save OTP temporarily in DB
      connection.execute(
        "UPDATE user_information SET otp_code = ? WHERE u_email = ?",
        [otp, email]
      );

      // ✅ Send OTP Email
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your OTP Code - Course Advising Portal",
        html: `<p>Hello ${user.u_first_name},</p>
               <p>Your OTP code is: <strong>${otp}</strong></p>
               <p>This code expires in 10 minutes.</p>`,
      });

      // ✅ Respond to frontend
      res.json({
        status: 200,
        message: "OTP sent to email. Please verify.",
        email: email,
      });
    }
  );
});

// ✅ VERIFY OTP
user.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;

  connection.execute(
    "SELECT * FROM user_information WHERE u_email = ? AND otp_code = ?",
    [email, otp],
    (error, result) => {
      if (error) return res.status(500).json({ message: error.message });

      if (result.length === 0)
        return res.status(400).json({ message: "Invalid or expired OTP" });

      // Clear OTP after success
      connection.execute("UPDATE user_information SET otp_code = NULL WHERE u_email = ?", [email]);

      res.json({
        status: 200,
        message: "OTP verified successfully",
      });
    }
  );
});



// ✅ FORGOT PASSWORD
user.post("/forgot-password", (req, res) => {
  const { email } = req.body;

  connection.execute(
    "SELECT * FROM user_information WHERE u_email = ?",
    [email],
    async (error, result) => {
      if (error) return res.status(500).json({ message: error.message });
      if (result.length === 0)
        return res.status(404).json({ message: "Email not found" });

      const resetLink = `http://127.0.0.1:5500/cs418518-f25/Project/client/reset.html?email=${encodeURIComponent(
        email
      )}`;

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Password Reset - Course Advising Portal",
        html: `<p>Click below to reset your password:</p>
               <a href="${resetLink}">${resetLink}</a>`,
      });

      res.json({ message: "Password reset email sent!" });
    }
  );
});

// ✅ RESET PASSWORD
user.post("/reset-password", async (req, res) => {
  const { email, newPassword } = req.body;
  const hashed = await bcrypt.hash(newPassword, 10);

  connection.execute(
    "UPDATE user_information SET u_password = ? WHERE u_email = ?",
    [hashed, email],
    (error, result) => {
      if (error) return res.status(500).json({ message: error.message });
      res.json({ message: "Password updated successfully!" });
    }
  );
});

export default user;
