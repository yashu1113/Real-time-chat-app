import User from "../features/users/user.model.js";
import Chat from "../features/chat/chat.model.js";
import Message from "../features/messages/message.model.js";
import {
  socketError,
  socketHandler,
  broadcastToRoom,
} from "./socket-utils.js";

const userSocketMap = {}; // {userId: socketId}

const registerSocketEvents = (io) => {
  io.on("connection", async (socket) => {
    try {
      const userId = socket.user._id;
      userSocketMap[userId] = socket.id;

      // Join a personal room for targeted notifications
      socket.join(userId.toString());

      console.log(` User connected: ${socket.user.name} (${userId})`);

      await User.findByIdAndUpdate(userId, { isOnline: true });

      // Emit online users to all clients
      io.emit("getOnlineUsers", Object.keys(userSocketMap));

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
          if (!chatId || !content) return;

          broadcastToRoom(io, chatId, "newMessage", {
            message: {
              sender: { _id: userId, name: socket.user.name, avatar: socket.user.avatar },
              chat: chatId,
              content: content.trim(),
              createdAt: new Date(),
            }
          });
        })
      );

      socket.on("disconnect", async () => {
        try {
          const lastSeen = new Date();
          delete userSocketMap[userId];
          io.emit("getOnlineUsers", Object.keys(userSocketMap));
          
          // Broadcast status update for accurate last seen
          io.emit("userStatusUpdate", { userId, isOnline: false, lastSeen });

          await User.findByIdAndUpdate(userId, {
            isOnline: false,
            lastSeen: lastSeen,
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
