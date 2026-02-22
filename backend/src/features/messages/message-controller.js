import Message from "./message.model.js";
import Chat from "../chat/chat.model.js";
import asyncHandler from "../../shared/utils/async-handler.js";
import { broadcastToRoom } from "../../socket/socket-utils.js";

export const sendMessage = asyncHandler(async (req, res) => {
  const senderId = req.user._id;
  const { chatId, content } = req.body;

  if (!chatId || !content) {
    return res.status(400).json({
      success: false,
      message: "chatId and content are required",
    });
  }

  const chat = await Chat.findById(chatId);

  if (!chat) {
    return res.status(404).json({
      success: false,
      message: "Chat not found",
    });
  }

  const isParticipant = chat.participants.some(
    (participant) => participant.toString() === senderId.toString()
  );

  if (!isParticipant) {
    return res.status(403).json({
      success: false,
      message: "You are not a participant in this chat",
    });
  }

  const message = await Message.create({
    sender: senderId,
    chat: chatId,
    content: content.trim(),
  });

  await message.populate("sender", "name email avatar");

  // Update chat with last message and increment unread counts
  chat.lastMessage = message._id;
  chat.updatedAt = Date.now();

  // Increment unread count for other participants
  chat.participants.forEach((participantId) => {
    if (participantId.toString() !== senderId.toString()) {
      const unreadEntry = chat.unreadCounts.find(
        (entry) => entry.user.toString() === participantId.toString()
      );
      if (unreadEntry) {
        unreadEntry.count += 1;
      } else {
        chat.unreadCounts.push({ user: participantId, count: 1 });
      }
    }
  });

  await chat.save();

  const io = req.app.get("socketio");
  if (io) {
    // 1. Broadcast to the chat room (for active chat window updates)
    broadcastToRoom(io, chatId, "newMessage", { message });

    // 2. Broadcast to participants' personal rooms (for sidebar updates)
    chat.participants.forEach((participantId) => {
      io.to(participantId.toString()).emit("newMessage", {
        message,
        isGlobal: true, // Hint for frontend to update sidebar
        unreadCounts: chat.unreadCounts, // Pass updated counts
      });
    });
  }

  res.status(201).json({
    success: true,
    message: "Message sent successfully",
    data: message,
  });
});

export const getMessages = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { chatId } = req.params;

  if (!chatId) {
    return res.status(400).json({
      success: false,
      message: "chatId is required",
    });
  }

  const chat = await Chat.findById(chatId);

  if (!chat) {
    return res.status(404).json({
      success: false,
      message: "Chat not found",
    });
  }

  const isParticipant = chat.participants.some(
    (participant) => participant.toString() === userId.toString()
  );

  if (!isParticipant) {
    return res.status(403).json({
      success: false,
      message: "You are not authorized to view messages from this chat",
    });
  }

  const limit = Number(req.query.limit) || 20;
  const page = Number(req.query.page) || 1;
  const skip = (page - 1) * limit;

  const messages = await Message.find({ chat: chatId })
    .populate("sender", "name email avatar")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalMessages = await Message.countDocuments({ chat: chatId });

  res.status(200).json({
    success: true,
    page,
    limit,
    totalMessages,
    totalPages: Math.ceil(totalMessages / limit),
    messages: messages.reverse(), // Send in chronological order (Old -> New)
  });
});
