<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Verify OTP</title>
  <link rel="stylesheet" href="./style.css" />
</head>
<body>
  <div class="container">
    <h2>📱 Verify Your Phone</h2>
    <p>We’ve sent a 6-digit verification code to your phone number.</p>

    <form id="otpForm">
      <input type="text" id="otp" maxlength="6" placeholder="Enter OTP" required />
      <button type="submit">Verify</button>
    </form>

    <p id="otpMessage"></p>
  </div>

  <script src="./verify-otp.js"></script>
</body>
</html>
