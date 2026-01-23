import express from "express";
import { sendMessage, getMessages } from "./message.controller.js";
import protectRoute from "../../shared/middleware/protectRoute.js";

const router = express.Router();

// Route to get messages between two users
router.get("/:id", protectRoute, getMessages);

// Route to send a message
router.post("/send/:id", protectRoute, sendMessage);

export default router;
