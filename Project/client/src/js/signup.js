document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("signupForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!firstName || !lastName || !email || !password) {
      alert("⚠️ Please fill in all fields.");
      return;
    }

    try {
   const res = await fetch("https://cs418518-f25-z4ax.onrender.com/user/register", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(user),
});


      const data = await res.json();

      if (res.ok) {
        alert("✅ Account created successfully! Please verify your email before signing in.");
        window.location.href = "signin.html";
      } else {
        alert(`❌ ${data.message || "Registration failed. Please try again."}`);
      }
    } catch (err) {
      console.error("Error during registration:", err);
      alert("⚠️ Unable to connect to the server. Please try again later.");
    }
  });
});
