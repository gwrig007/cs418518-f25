import { Router } from "express";
import { connection } from "../database/connection.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import sendOtpSMS from "../utils/sms.js";

const user = Router();

/* ================================
   ENSURE ADMIN USER EXISTS
   ================================ */
const ensureAdminUser = () => {
  const adminEmail = "admin@odu.edu";
  const adminPassword = "Admin@123";

  connection.execute(
    "SELECT * FROM user_information WHERE u_email = ?",
    [adminEmail],
    async (err, results) => {
      if (err) {
        console.error("❌ Error checking for admin:", err);
        return;
      }

      if (results.length === 0) {
        const hashed = await bcrypt.hash(adminPassword, 10);
        connection.execute(
          "INSERT INTO user_information (u_first_name, u_last_name, u_email, u_password, is_verified, is_admin, phone) VALUES (?, ?, ?, ?, ?, ?, ?)",
          ["System", "Admin", adminEmail, hashed, 1, 1, "+10000000000"],
          (insertErr) => {
            if (insertErr) console.error("⚠️ Failed to create admin:", insertErr);
            else console.log("✅ Admin user created (admin@odu.edu / Admin@123)");
          }
        );
      } else {
        console.log("✅ Admin user already exists.");
      }
    }
  );
};
ensureAdminUser();

/* ================================
   REGISTER (Sign-Up)
   ================================ */
user.post("/register", async (req, res) => {
  const { firstName, lastName, email, password, phone } = req.body;

  if (!firstName || !lastName || !email || !password || !phone)
    return res.status(400).json({ message: "All fields are required." });

  connection.execute(
    "SELECT * FROM user_information WHERE u_email = ? OR phone = ?",
    [email, phone],
    async (err, results) => {
      if (err) return res.status(500).json({ message: err.message });
      if (results.length > 0)
        return res.status(400).json({ message: "Email or phone already registered." });

      const hashedPassword = await bcrypt.hash(password, 10);

      connection.execute(
        "INSERT INTO user_information (u_first_name, u_last_name, u_email, u_password, phone, is_verified, is_admin) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [firstName, lastName, email, hashedPassword, phone, 1, 0],
        (error) => {
          if (error) return res.status(500).json({ message: error.message });
          res.status(201).json({ message: "✅ Account created successfully!" });
        }
      );
    }
  );
});

/* ================================
   SIGN IN (Send OTP via SMS)
   ================================ */
user.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email and password are required." });

  connection.execute(
    "SELECT * FROM user_information WHERE u_email = ?",
    [email],
    async (err, results) => {
      if (err) return res.status(500).json({ message: "Database error." });
      if (results.length === 0)
        return res.status(404).json({ message: "❌ No user found." });

      const user = results[0];
      const isMatch = await bcrypt.compare(password, user.u_password);
      if (!isMatch) return res.status(401).json({ message: "Incorrect password." });

      // Generate OTP
      const otp = Math.floor(100000 + Math.random() * 900000);
      const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

      connection.execute(
        "UPDATE user_information SET otp = ?, otpExpires = ? WHERE u_email = ?",
        [otp, otpExpires, email],
        async (updateErr) => {
          if (updateErr)
            return res.status(500).json({ message: "Error saving OTP." });

          const smsSent = await sendOtpSMS(user.phone, otp);
          if (!smsSent)
            return res.status(500).json({ message: "Failed to send OTP via SMS." });

          res.status(200).json({
            status: 200,
            message: "✅ OTP sent via SMS.",
            isAdmin: user.is_admin,
            phone: user.phone,
          });
        }
      );
    }
  );
});

/* ================================
   VERIFY OTP
   ================================ */
user.post("/verify-otp", (req, res) => {
  const { phone, otp } = req.body;

  if (!phone || !otp)
    return res.status(400).json({ message: "Phone number and OTP are required." });

  connection.execute(
    "SELECT * FROM user_information WHERE phone = ? AND otp = ? AND otpExpires > NOW()",
    [phone, otp],
    (err, results) => {
      if (err) return res.status(500).json({ message: "Database error." });
      if (results.length === 0)
        return res.status(400).json({ message: "Invalid or expired OTP." });

      // Clear OTP
      connection.execute(
        "UPDATE user_information SET otp = NULL, otpExpires = NULL WHERE phone = ?",
        [phone]
      );

      res.status(200).json({
        message: "✅ OTP verified successfully!",
        email: results[0].u_email,
        isAdmin: results[0].is_admin,
      });
    }
  );
});

/* ================================
   FORGOT PASSWORD (SMS LINK)
   ================================ */
user.post("/forgot-password", async (req, res) => {
  const { phone } = req.body;

  connection.execute(
    "SELECT * FROM user_information WHERE phone = ?",
    [phone],
    async (error, result) => {
      if (error) return res.status(500).json({ message: error.message });
      if (result.length === 0)
        return res.status(404).json({ message: "Phone not found." });

      const resetCode = Math.floor(100000 + Math.random() * 900000);
      const resetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 min

      connection.execute(
        "UPDATE user_information SET otp = ?, otpExpires = ? WHERE phone = ?",
        [resetCode, resetExpires, phone],
        async () => {
          await sendOtpSMS(phone, resetCode);
          res.json({ message: "Reset code sent via SMS." });
        }
      );
    }
  );
});

/* ================================
   RESET PASSWORD
   ================================ */
user.post("/reset-password", async (req, res) => {
  const { phone, otp, newPassword } = req.body;
  const hashed = await bcrypt.hash(newPassword, 10);

  connection.execute(
    "SELECT * FROM user_information WHERE phone = ? AND otp = ? AND otpExpires > NOW()",
    [phone, otp],
    (error, result) => {
      if (error) return res.status(500).json({ message: error.message });
      if (result.length === 0)
        return res.status(400).json({ message: "Invalid or expired OTP." });

      connection.execute(
        "UPDATE user_information SET u_password = ?, otp = NULL, otpExpires = NULL WHERE phone = ?",
        [hashed, phone],
        (err) => {
          if (err) return res.status(500).json({ message: err.message });
          res.json({ message: "✅ Password reset successfully!" });
        }
      );
    }
  );
});

/* ================================
   PROFILE (GET / UPDATE)
   ================================ */
user.get("/profile", (req, res) => {
  const email = req.query.email;
  if (!email) return res.status(400).json({ message: "Email is required." });

  connection.execute(
    "SELECT u_first_name AS firstName, u_last_name AS lastName, u_email AS email, phone, is_admin AS isAdmin FROM user_information WHERE u_email = ?",
    [email],
    (err, results) => {
      if (err) return res.status(500).json({ message: "Error fetching profile." });
      if (results.length === 0)
        return res.status(404).json({ message: "User not found." });
      res.json(results[0]);
    }
  );
});

user.put("/update-profile", async (req, res) => {
  const { email, firstName, lastName, password } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required." });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    connection.execute(
      "UPDATE user_information SET u_first_name = ?, u_last_name = ?, u_password = ? WHERE u_email = ?",
      [firstName, lastName, hashedPassword, email],
      (err, result) => {
        if (err) return res.status(500).json({ message: "Error updating profile." });
        if (result.affectedRows === 0)
          return res.status(404).json({ message: "User not found." });
        res.json({ message: "Profile updated successfully!" });
      }
    );
  } catch {
    res.status(500).json({ message: "Error updating password." });
  }
});

export default user;
