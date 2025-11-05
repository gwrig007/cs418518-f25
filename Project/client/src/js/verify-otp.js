document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("otpForm");
  const messageBox = document.getElementById("otpMessage");

  const email = sessionStorage.getItem("pendingEmail");
  if (!email) {
    showMessage("⚠️ Session expired. Please sign in again.", "error");
    setTimeout(() => (window.location.href = "./signin.html"), 2000);
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const otp = document.getElementById("otp").value.trim();
    if (!otp) {
      showMessage("⚠️ Please enter the OTP sent to your email.", "error");
      return;
    }

    try {
      const response = await fetch("https://cs418518-f25-z4ax.onrender.com/user/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (!response.ok || data.status !== 200) {
        showMessage(data.message || "❌ Invalid OTP.", "error");
        return;
      }

      showMessage("✅ OTP verified! Logging in...", "success");
      sessionStorage.removeItem("pendingEmail");

      // Redirect after OTP success
      setTimeout(() => {
        if (data.isAdmin) {
          window.location.href = "./admin-dashboard.html";
        } else {
          window.location.href = "./dashboard.html";
        }
      }, 2000);
    } catch (err) {
      console.error("OTP verify error:", err);
      showMessage("⚠️ Server error. Please try again.", "error");
    }
  });

  function showMessage(msg, type) {
    messageBox.textContent = msg;
    messageBox.style.color = type === "success" ? "green" : "red";
  }
});
