import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  root: ".", // your client folder is the root
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        signin: resolve(__dirname, "signin.html"),
        signup: resolve(__dirname, "signup.html"),
        home: resolve(__dirname, "home.html"),
        profile: resolve(__dirname, "profile.html"),
        reset: resolve(__dirname, "reset.html"),
        forgot: resolve(__dirname, "forgot.html"),
        verifyOtp: resolve(__dirname, "verify-otp.html"),
        admin: resolve(__dirname, "admin.html"),
        changePass: resolve(__dirname, "change-password.html"),
      },
    },
  },
  server: {
    https: true,
    port: 5173,
  },
});
