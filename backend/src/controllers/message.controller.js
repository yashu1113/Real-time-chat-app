// backend/controllers/message.controller.js
import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";

// Send Message Controller
export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user?._id;

    if (!senderId || !receiverId) {
      return res
        .status(400)
        .json({ message: "Sender or receiver ID is missing." });
    }

    const trimmedReceiverId = receiverId.trim();

    console.log("Sender ID:", senderId);
    console.log("Receiver ID:", trimmedReceiverId);

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, trimmedReceiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, trimmedReceiverId],
      });
    }

    const newMessage = new Message({
      senderId,
      receiverId: trimmedReceiverId,
      message,
    });

    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }

    await Promise.all([conversation.save(), newMessage.save()]);

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error in sendMessage controller:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get Messages Controller
export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const senderId = req.user?._id;

    if (!senderId || !userToChatId) {
      return res
        .status(400)
        .json({ message: "Sender or receiver ID is missing." });
    }

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, userToChatId] },
    }).populate("messages");

    if (!conversation) return res.status(200).json([]);

    res.status(200).json(conversation.messages);
  } catch (error) {
    console.error("Error in getMessages controller:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
