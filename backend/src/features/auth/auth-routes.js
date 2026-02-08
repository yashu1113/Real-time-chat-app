import express from "express";
import signup, { login, getMe, googleLogin, logout, getGoogleAuthUrl, handleGoogleCallback } from "../auth/auth-controller.js";
import { authMiddleware } from "../auth/auth-middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/google", googleLogin);

// Google OAuth manual redirect flow
router.get("/google", getGoogleAuthUrl);
router.get("/google/callback", handleGoogleCallback);


//protected routes
router.get("/me", authMiddleware, getMe);
router.post("/logout", authMiddleware, logout);









export default router;
