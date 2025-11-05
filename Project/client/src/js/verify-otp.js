document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("verifyOtpForm");
  const messageBox = document.getElementById("verifyMessage");
  const email = sessionStorage.getItem("pendingEmail");

  if (!email) {
    showMessage("❌ Missing email session. Please sign in again.", "error");
    setTimeout(() => (window.location.href = "./signin.html"), 2000);
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const otp = document.getElementById("otp").value.trim();

    if (!otp) {
      showMessage("⚠️ Please enter the OTP.", "error");
      return;
    }

    try {
      const response = await fetch("https://cs418518-f25-z4ax.onrender.com/user/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        showMessage(data.message || "❌ Invalid OTP.", "error");
        return;
      }

      showMessage("✅ Login successful! Redirecting...", "success");

      setTimeout(() => {
        const isAdmin = sessionStorage.getItem("isAdmin") === "true";
        window.location.href = isAdmin ? "./admin.html" : "./dashboard.html";
      }, 1500);
    } catch (err) {
      console.error("Verify OTP error:", err);
      showMessage("⚠️ Server error. Please try again.", "error");
    }
  });

  function showMessage(msg, type) {
    messageBox.textContent = msg;
    messageBox.style.color = type === "success" ? "green" : "red";
  }
});
