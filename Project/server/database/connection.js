import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

export const connection = mysql.createConnection({
  host: process.env.DB_HOST,       // ✅ use Clever Cloud
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});
connection.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err);
  } else {
    console.log("✅ Connected to Clever Cloud MySQL!");
  }
});
