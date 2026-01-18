import express from "express";
import { sendMessage, getMessages } from "../controllers/message.controller.js"; // Ensure this path is correct
import protectRoute from "../middleware/protectRoute.js"; // Ensure this middleware is properly defined

const router = express.Router();

// Route to get messages between two users
router.get("/:id", protectRoute, getMessages);  // Use `:id` to correctly capture userToChatId

// Route to send a message
router.post("/send/:id", protectRoute, sendMessage);  // Use `:id` to capture receiverId

export default router;