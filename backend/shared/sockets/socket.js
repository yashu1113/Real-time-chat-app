import { Server } from "socket.io";
import http from "http";
import express from "express";
import {
  handleConnection,
  handleDisconnect,
  handleSendMessage,
} from "./socket.events.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Store online users
const userSocketMap = {}; // {userId: socketId}

/**
 * Get socket ID for a specific user
 * @param {string} receiverId - Receiver user ID
 * @returns {string|undefined} socketId
 */
export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

/**
 * Socket.io connection handler
 * Registers all socket event listeners with clean separation
 */
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  // Handle connection
  handleConnection(socket, userSocketMap, io);

  // Handle real-time message sending (optional: for instant messaging without DB)
  socket.on("sendMessage", (data) => {
    handleSendMessage(socket, data, getReceiverSocketId, io);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    handleDisconnect(socket, userSocketMap, io, userId);
  });
});

export { app, io, server };
