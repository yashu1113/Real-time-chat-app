/**
 * Socket Event Handlers
 * Handles all socket.io events with clean separation of concerns
 */

/**
 * Handle new socket connection
 * @param {Socket} socket - Socket.io socket instance
 * @param {Object} userSocketMap - Map of userId to socketId
 * @param {Server} io - Socket.io server instance
 */
export const handleConnection = (socket, userSocketMap, io) => {
  console.log("🔌 User connected:", socket.id);

  const userId = socket.handshake.query.userId;

  // Validate and store user connection
  if (userId && userId !== "undefined") {
    userSocketMap[userId] = socket.id;
    console.log(`✅ User ${userId} mapped to socket ${socket.id}`);

    // Broadcast updated online users list to all clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  } else {
    console.warn("⚠️ Connection without valid userId:", socket.id);
  }
};

/**
 * Handle socket disconnection
 * @param {Socket} socket - Socket.io socket instance
 * @param {Object} userSocketMap - Map of userId to socketId
 * @param {Server} io - Socket.io server instance
 * @param {string} userId - User ID from connection
 */
export const handleDisconnect = (socket, userSocketMap, io, userId) => {
  console.log("🔌 User disconnected:", socket.id);

  // Remove user from online users map
  if (userId && userSocketMap[userId]) {
    delete userSocketMap[userId];
    console.log(`❌ User ${userId} removed from online users`);

    // Broadcast updated online users list to all clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  }
};

/**
 * Handle real-time message sending via socket
 * @param {Socket} socket - Socket.io socket instance
 * @param {Object} data - Message data {receiverId, message, senderId}
 * @param {Function} getReceiverSocketId - Function to get receiver's socket ID
 * @param {Server} io - Socket.io server instance
 */
export const handleSendMessage = (socket, data, getReceiverSocketId, io) => {
  const { receiverId, message, senderId } = data;

  console.log(
    `💬 Real-time message from ${senderId} to ${receiverId}:`,
    message
  );

  // Get receiver's socket ID
  const receiverSocketId = getReceiverSocketId(receiverId);

  if (receiverSocketId) {
    // Send message to specific receiver
    io.to(receiverSocketId).emit("newMessage", {
      senderId,
      receiverId,
      message,
      createdAt: new Date(),
    });
    console.log(`✅ Message delivered to ${receiverId}`);
  } else {
    console.log(`⚠️ Receiver ${receiverId} is offline`);
  }
};
