import * as messageService from "./message.service.js";

/**
 * Send a message to another user
 * @route POST /api/messages/send/:id
 */
export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user?._id;

    if (!message) {
      return res.status(400).json({ error: "Message content is required" });
    }

    if (!senderId || !receiverId) {
      return res.status(400).json({ error: "Sender or receiver ID is missing" });
    }

    const newMessage = await messageService.createMessage(
      senderId,
      receiverId,
      message
    );

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error in sendMessage controller:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Get messages in a conversation
 * @route GET /api/messages/:id
 */
export const getMessages = async (req, res) => {
  try {
    const { id: receiverId } = req.params;
    const senderId = req.user?._id;

    if (!senderId || !receiverId) {
      return res.status(400).json({ error: "Sender or receiver ID is missing" });
    }

    const messages = await messageService.getConversationMessages(
      senderId,
      receiverId
    );

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error in getMessages controller:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
