import express from "express";
import { authMiddleware } from "../auth/auth-middleware.js";
import { sendMessage, getMessages } from "./message-controller.js";

const router = express.Router();

// Send a message
router.post("/", authMiddleware, sendMessage);

// Get messages of a specific chat
router.get("/:chatId", authMiddleware, getMessages);

export default router;
