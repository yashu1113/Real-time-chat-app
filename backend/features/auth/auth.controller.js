import passport from "passport";
import * as authService from "./auth.service.js";
import generateTokenAndSetCookie from "../../shared/utils/generateToken.js";

/**
 * User signup/registration
 * @route POST /api/auth/signup
 */
export const signup = async (req, res) => {
  try {
    const { fullName, username, password, confirmPassword, gender } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords don't match" });
    }

    const user = await authService.registerUser({
      fullName,
      username,
      password,
      gender,
    });

    // Generate JWT token
    generateTokenAndSetCookie(user._id, res);

    res.status(201).json(user);
  } catch (error) {
    console.error("Error in signup controller:", error.message);
    
    if (error.message === "Username already exists") {
      return res.status(400).json({ error: error.message });
    }
    
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * User login
 * @route POST /api/auth/login
 */
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const user = await authService.authenticateUser(username, password);

    generateTokenAndSetCookie(user._id, res);

    res.status(200).json(user);
  } catch (error) {
    console.error("Error in login controller:", error.message);
    
    if (error.message === "Invalid username or password") {
      return res.status(401).json({ error: error.message });
    }
    
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * User logout
 * @route POST /api/auth/logout
 */
export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error in logout controller:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Initiates Google OAuth authentication
 * @route GET /api/auth/google
 */
export const googleAuth = (req, res, next) => {
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })(req, res, next);
};

/**
 * Handles Google OAuth callback
 * @route GET /api/auth/google/callback
 */
export const googleAuthCallback = (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Google authentication failed (no user found)",
      });
    }
    
    generateTokenAndSetCookie(req.user._id, res);
    res.redirect(process.env.FRONTEND_URL + "/");
  } catch (error) {
    console.error("Error in Google auth callback:", error.message);
    res.status(500).json({
      success: false,
      message: "Google authentication failed",
    });
  }
};
