import Message from "./message.model.js";
import Chat from "../chat/chat.model.js";
import asyncHandler from "../../shared/utils/async-handler.js";

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

  chat.updatedAt = Date.now();
  await chat.save();

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

  const limit = Number(req.query.limit) || 50;
  const skip = Number(req.query.skip) || 0;

  const messages = await Message.find({ chat: chatId })
    .populate("sender", "name email avatar")
    .sort({ createdAt: 1 })
    .skip(skip)
    .limit(limit);

  const totalMessages = await Message.countDocuments({ chat: chatId });

  res.status(200).json({
    success: true,
    count: messages.length,
    total: totalMessages,
    messages,
  });
});
