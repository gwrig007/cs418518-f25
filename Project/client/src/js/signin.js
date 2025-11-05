document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("signinForm");
  const messageBox = document.getElementById("signinMessage");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
      showMessage("⚠️ Please fill in all fields.", "error");
      return;
    }

    try {
      const response = await fetch("https://cs418518-f25-z4ax.onrender.com/user/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        showMessage(data.message || "❌ Login failed.", "error");
        return;
      }

      // ✅ Save info for OTP verification
      sessionStorage.setItem("pendingEmail", email);
      sessionStorage.setItem("isAdmin", data.isAdmin);

      showMessage("✅ OTP sent to your email. Redirecting...", "success");

      // ✅ Redirect to OTP page
      setTimeout(() => {
        window.location.href = "./verify-otp.html";
      }, 2000);
    } catch (err) {
      console.error("Signin error:", err);
      showMessage("⚠️ Server error. Please try again later.", "error");
    }
  });

  function showMessage(msg, type) {
    messageBox.textContent = msg;
    messageBox.style.color = type === "success" ? "green" : "red";
  }
});
