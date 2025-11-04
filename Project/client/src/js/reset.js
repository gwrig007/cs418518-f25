// reset.js
document.addEventListener("DOMContentLoaded", () => {
  const resetForm = document.getElementById("resetForm");
  const messageDiv = document.getElementById("message");

  // 🟦 Extract the email from the URL (example: reset.html?email=test@email.com)
  const params = new URLSearchParams(window.location.search);
  const email = params.get("email");

  if (!email) {
    messageDiv.textContent = "⚠️ Invalid or missing email link.";
    resetForm.style.display = "none";
    return;
  }

  // 🟩 Handle form submission
  resetForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const newPassword = document.getElementById("newPassword").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();

    // Validate inputs
    if (!newPassword || !confirmPassword) {
      messageDiv.style.color = "red";
      messageDiv.textContent = "⚠️ Please fill in both fields.";
      return;
    }

    if (newPassword !== confirmPassword) {
      messageDiv.style.color = "red";
      messageDiv.textContent = "❌ Passwords do not match.";
      return;
    }

    try {
    const res = await fetch("https://odu-advising-server.onrender.com/user/reset-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, newPassword }),
});


      const data = await res.json();

      if (res.ok) {
        messageDiv.style.color = "green";
        messageDiv.textContent = "✅ Password reset successful! Redirecting to sign in...";
        setTimeout(() => {
          window.location.href = "signin.html";
        }, 2000);
      } else {
        messageDiv.style.color = "red";
        messageDiv.textContent = `❌ ${data.message || "Reset failed."}`;
      }
    } catch (err) {
      console.error("Reset error:", err);
      messageDiv.style.color = "red";
      messageDiv.textContent = "⚠️ Unable to connect to the server.";
    }
  });
});
