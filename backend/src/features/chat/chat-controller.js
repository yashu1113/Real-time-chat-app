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
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const chats = await Chat.find({
    participants: userId,
  })
    .populate("participants", "name email avatar isOnline lastSeen")
    .populate({
      path: "lastMessage",
      select: "content createdAt sender",
    })
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalChats = await Chat.countDocuments({ participants: userId });

  res.status(200).json({
    success: true,
    page,
    limit,
    totalChats,
    totalPages: Math.ceil(totalChats / limit),
    chats,
  });
});

export const markAsRead = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { chatId } = req.params;

  const chat = await Chat.findOne({ _id: chatId, participants: userId });

  if (!chat) {
    return res.status(404).json({
      success: false,
      message: "Chat not found",
    });
  }

  // Find the unread count entry for this user and reset it
  const unreadEntry = chat.unreadCounts.find(
    (entry) => entry.user.toString() === userId.toString()
  );

  if (unreadEntry) {
    unreadEntry.count = 0;
    await chat.save();
  }

  res.status(200).json({
    success: true,
    message: "Chat marked as read",
  });
});
