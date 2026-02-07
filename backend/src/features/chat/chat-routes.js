import express from "express";
import { authMiddleware } from "../auth/auth-middleware.js";
import { createOrGetChat, getMyChats } from "./chat-controller.js";

const router = express.Router();

router.get("/", authMiddleware, getMyChats);
router.post("/", authMiddleware, createOrGetChat);

export default router;
