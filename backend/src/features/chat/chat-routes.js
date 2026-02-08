import express from "express";
import { authMiddleware } from "../auth/auth-middleware.js";
import { createOrGetChat, getMyChats, markAsRead } from "./chat-controller.js";

const router = express.Router();

router.get("/", authMiddleware, getMyChats);
router.post("/", authMiddleware, createOrGetChat);
router.patch("/:chatId/read", authMiddleware, markAsRead);

export default router;
