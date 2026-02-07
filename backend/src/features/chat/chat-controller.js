import Chat from "./chat.model.js";
import asyncHandler from "../../shared/utils/async-handler.js";

export const createOrGetChat = asyncHandler(async (req, res) => {
  const senderId = req.user._id;
  const { receiverUserId } = req.body;

  if (!receiverUserId) {
    return res.status(400).json({
      success: false,
      message: "receiverUserId is required",
    });
  }

  if (senderId.toString() === receiverUserId.toString()) {
    return res.status(400).json({
      success: false,
      message: "Cannot create chat with yourself",
    });
  }

  let chat = await Chat.findOne({
    participants: { $all: [senderId, receiverUserId] },
    isGroupChat: false,
  }).populate("participants", "name email avatar isOnline lastSeen");

  if (chat) {
    return res.status(200).json({
      success: true,
      message: "Chat retrieved successfully",
      chat,
    });
  }

  chat = await Chat.create({
    participants: [senderId, receiverUserId],
    isGroupChat: false,
  });

  chat = await Chat.findById(chat._id).populate(
    "participants",
    "name email avatar isOnline lastSeen"
  );

  res.status(201).json({
    success: true,
    message: "Chat created successfully",
    chat,
  });
});

export const getMyChats = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const chats = await Chat.find({
    participants: userId,
  })
    .populate("participants", "name email avatar isOnline lastSeen")
    .sort({ updatedAt: -1 });

  res.status(200).json({
    success: true,
    count: chats.length,
    chats,
  });
});
