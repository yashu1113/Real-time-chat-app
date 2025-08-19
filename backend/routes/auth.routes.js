import express from "express";
import {
  signup,
  login,
  logout,
  googleAuth,
  googleAuthCallback,
} from "../controllers/auth.controller.js";
import passport from "passport";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

/**
 * Google OAuth Routes
 * - /google: Initiates Google authentication
 * - /google/callback: Handles Google callback
 */
router.get("/google", googleAuth);
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login", session: false }),
  googleAuthCallback
);

router.get("/me", protectRoute, (req, res) => {
  // Return user info (excluding password)
  const { _id, fullName, username, profilePic } = req.user;
  res.json({ _id, fullName, username, profilePic });
});

export default router;
