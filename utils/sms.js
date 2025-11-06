// server/utils/sms.js
import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = "+18777804236"; // your Twilio number

const client = twilio(accountSid, authToken);

/**
 * Sends an OTP via SMS using Twilio
 * @param {string} to - recipient phone number
 * @param {number|string} otp - one-time password
 * @returns {Promise<boolean>}
 */
export default async function sendOtpSMS(to, otp) {
  try {
    await client.messages.create({
      body: `Your verification code is: ${otp}`,
      from: fromNumber,
      to: to,
    });
    console.log(`✅ OTP sent successfully to ${to}`);
    return true;
  } catch (error) {
    console.error("❌ Failed to send OTP via Twilio:", error.message);
    return false;
  }
}
