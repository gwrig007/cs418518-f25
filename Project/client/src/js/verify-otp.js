document.addEventListener("DOMContentLoaded", () => {
  const verifyBtn = document.getElementById("verifyBtn");
  const otpInput = document.getElementById("otp");
  const message = document.getElementById("message");

  // Retrieve phone number stored from signin
  const phone = localStorage.getItem("userPhone");

  if (!phone) {
    message.textContent = "⚠️ No phone number found. Please sign in again.";
    verifyBtn.disabled = true;
    return;
  }

  verifyBtn.addEventListener("click", async () => {
    const otp = otpInput.value.trim();

    if (!otp) {
      message.textContent = "Please enter your OTP.";
      return;
    }

    message.textContent = "Verifying...";

    try {
      const response = await fetch("https://cs418518-f25-z4ax.onrender.com/user/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp }),
      });

      const data = await response.json();

      if (response.ok) {
        message.textContent = data.message;
        localStorage.setItem("userEmail", data.email);
        localStorage.setItem("isAdmin", data.isAdmin);

        // Redirect to home or admin page
        setTimeout(() => {
          if (data.isAdmin) {
            window.location.href = "admin.html";
          } else {
            window.location.href = "home.html";
          }
        }, 1500);
      } else {
        message.textContent = `❌ ${data.message}`;
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      message.textContent = "⚠️ Server error. Please try again.";
    }
  });
});
