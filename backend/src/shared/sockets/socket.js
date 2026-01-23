// shared/sockets/socket.js
import { Server } from "socket.io";
import {
  handleConnection,
  handleDisconnect,
  handleSendMessage,
} from "./socket.events.js";

let io;

// Store online users (userId -> socketId)
const userSocketMap = {};

/**
 * Initialize Socket.io and attach it to HTTP server
 */
export function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

    handleConnection(socket, userSocketMap, io, userId);

    socket.on("sendMessage", (data) => {
      handleSendMessage(socket, data, getReceiverSocketId, io);
    });

    socket.on("disconnect", () => {
      handleDisconnect(socket, userSocketMap, io, userId);
    });
  });
}

/**
 * Get socket ID for a user
 */
export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

/**
 * Optional getter for io (emit from controllers if needed)
 */
export function getIO() {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
}
