import twilio from "twilio";

// Use your Twilio credentials from .env
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

/**
 * Send a one-time passcode (OTP) via SMS
 * @param {string} phoneNumber - recipient's phone number in +1XXXXXXXXXX format
 * @param {string|number} otp - the one-time code to send
 */
export async function sendOtpSMS(phoneNumber, otp) {
  try {
    await client.messages.create({
      body: `Your Course Advising Portal verification code is: ${otp}`,
      from: "+18777804236", // ✅ your new Twilio number
      to: phoneNumber, // must include +1 and area code
    });
    console.log(`✅ OTP sent to ${phoneNumber}`);
  } catch (error) {
    console.error("❌ OTP SMS failed:", error.message);
  }
}
