import Message from "./message.model.js";
import Conversation from "./conversation.model.js";
import { io, getReceiverSocketId } from "../../shared/sockets/socket.js";

/**
 * Message Service Layer
 * Handles all message and conversation-related business logic
 * Used by both REST controllers and Socket handlers
 */

/**
 * Find or create a conversation between two users
 * @param {string} senderId - Sender user ID
 * @param {string} receiverId - Receiver user ID
 * @returns {Promise<Object>} Conversation object
 */
export const findOrCreateConversation = async (senderId, receiverId) => {
  try {
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    return conversation;
  } catch (error) {
    throw new Error(`Failed to find or create conversation: ${error.message}`);
  }
};

/**
 * Create and save a new message
 * @param {string} senderId - Sender user ID
 * @param {string} receiverId - Receiver user ID
 * @param {string} messageText - Message content
 * @returns {Promise<Object>} Created message object
 */
export const createMessage = async (senderId, receiverId, messageText) => {
  try {
    const trimmedReceiverId = receiverId.trim();

    // Find or create conversation
    const conversation = await findOrCreateConversation(senderId, trimmedReceiverId);

    // Create new message
    const newMessage = new Message({
      senderId,
      receiverId: trimmedReceiverId,
      message: messageText,
    });

    // Add message to conversation
    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }

    // Save both in parallel
    await Promise.all([conversation.save(), newMessage.save()]);

    // Emit real-time message to receiver if they're online
    const receiverSocketId = getReceiverSocketId(trimmedReceiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
      console.log(`✅ Real-time message sent to user ${trimmedReceiverId}`);
    }

    return newMessage;
  } catch (error) {
    throw new Error(`Failed to create message: ${error.message}`);
  }
};

/**
 * Get all messages in a conversation between two users
 * @param {string} senderId - Sender user ID
 * @param {string} receiverId - Receiver user ID
 * @returns {Promise<Array>} Array of message objects
 */
export const getConversationMessages = async (senderId, receiverId) => {
  try {
    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    }).populate("messages");

    if (!conversation) {
      return [];
    }

    return conversation.messages;
  } catch (error) {
    throw new Error(`Failed to get messages: ${error.message}`);
  }
};
