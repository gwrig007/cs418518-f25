// utils/sms.js
import twilio from "twilio";

// ✅ Replace with your actual Twilio credentials
const accountSid = process.env.TWILIO_ACCOUNT_SID || "YOUR_TWILIO_ACCOUNT_SID";
const authToken = process.env.TWILIO_AUTH_TOKEN || "YOUR_TWILIO_AUTH_TOKEN";
const twilioPhone = process.env.TWILIO_PHONE_NUMBER || "+1XXXXXXXXXX"; // Your Twilio phone number

const client = twilio(accountSid, authToken);

/**
 * Send OTP via SMS using Twilio
 * @param {string} phone - The recipient phone number (in E.164 format, e.g. +15551234567)
 * @param {string|number} otp - The one-time password code
 * @returns {Promise<boolean>} - Returns true if sent successfully, false otherwise
 */
export default async function sendOtpSMS(phone, otp) {
  try {
    const message = await client.messages.create({
      body: `🔐 Your verification code is: ${otp}. It expires in 5 minutes.`,
      from: twilioPhone,
      to: phone,
    });

    console.log("✅ OTP sent via Twilio:", message.sid);
    return true;
  } catch (error) {
    console.error("❌ Error sending OTP via Twilio:", error.message);
    return false;
  }
}
