import User from "../features/users/user.model.js";
import Chat from "../features/chat/chat.model.js";
import Message from "../features/messages/message.model.js";
import {
  socketError,
  socketHandler,
  broadcastToRoom,
} from "./socket-utils.js";

const registerSocketEvents = (io) => {
  io.on("connection", async (socket) => {
    try {
      const userId = socket.user._id;
      console.log(` User connected: ${socket.user.name} (${userId})`);

      await User.findByIdAndUpdate(userId, { isOnline: true });

      socket.on("ping", (data) => {
        console.log(` Received ping from ${socket.user.name}:`, data);
        socket.emit("pong", { message: "Pong from server!", timestamp: Date.now() });
      });


      socket.on(
        "joinChat",
        socketHandler(async (data) => {
          const { chatId } = data;

          if (!chatId) {
            return socketError(socket, "chatId is required");
          }

          const chat = await Chat.findById(chatId);
          if (!chat) {
            return socketError(socket, "Chat not found");
          }

          const isParticipant = chat.participants.some(
            (participant) => participant.toString() === userId.toString()
          );

          if (!isParticipant) {
            return socketError(
              socket,
              "You are not a participant in this chat"
            );
          }

          socket.join(chatId);
          console.log(` User ${socket.user.name} joined chat: ${chatId}`);

          socket.emit("joinedChat", {
            success: true,
            message: "Joined chat successfully",
            chatId,
          });
        })
      );

      socket.on(
        "sendMessage",
        socketHandler(async (data) => {
          const { chatId, content } = data;

          if (!chatId || !content) {
            return socketError(socket, "chatId and content are required");
          }

          const chat = await Chat.findById(chatId);
          if (!chat) {
            return socketError(socket, "Chat not found");
          }

          const isParticipant = chat.participants.some(
            (participant) => participant.toString() === userId.toString()
          );

          if (!isParticipant) {
            return socketError(
              socket,
              "You are not a participant in this chat"
            );
          }

          const message = await Message.create({
            sender: userId,
            chat: chatId,
            content: content.trim(),
          });

          await message.populate("sender", "name email avatar");

          chat.lastMessage = message._id;
          chat.updatedAt = Date.now();
          await chat.save();

          broadcastToRoom(io, chatId, "newMessage", {
            message,
          });

          console.log(
            `💬 Message sent in chat ${chatId} by ${socket.user.name}`
          );
        })
      );

      socket.on("disconnect", async () => {
        try {
          await User.findByIdAndUpdate(userId, {
            isOnline: false,
            lastSeen: Date.now(),
          });

          console.log(` User disconnected: ${socket.user.name} (${userId})`);
        } catch (error) {
          console.error("Error in disconnect:", error);
        }
      });
    } catch (error) {
      console.error("Error in connection handler:", error);
    }
  });
};

export default registerSocketEvents;
