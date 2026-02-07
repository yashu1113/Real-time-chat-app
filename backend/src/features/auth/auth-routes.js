import express from "express";
import signup, { login, getMe, googleLogin } from "../auth/auth-controller.js";
import { authMiddleware } from "../auth/auth-middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/google", googleLogin);


//protected route
router.get("/me", authMiddleware, getMe);









export default router;
