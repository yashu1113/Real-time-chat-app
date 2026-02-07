/**
 * Socket response utilities for consistent error and success responses
 */

/**
 * Emit error response to socket client
 * @param {Socket} socket - Socket.IO socket instance
 * @param {string} message - Error message
 */
export const socketError = (socket, message) => {
  socket.emit("error", {
    success: false,
    message,
  });
};

/**
 * Emit success response to socket client
 * @param {Socket} socket - Socket.IO socket instance
 * @param {string} event - Event name to emit
 * @param {object} data - Data to send
 */
export const socketSuccess = (socket, event, data) => {
  socket.emit(event, {
    success: true,
    ...data,
  });
};

/**
 * Broadcast to room with consistent format
 * @param {Server} io - Socket.IO server instance
 * @param {string} room - Room name/ID
 * @param {string} event - Event name to emit
 * @param {object} data - Data to broadcast
 */
export const broadcastToRoom = (io, room, event, data) => {
  io.to(room).emit(event, {
    success: true,
    ...data,
  });
};

/**
 * Socket event handler wrapper (similar to asyncHandler for REST)
 * Catches errors and emits them to the client
 * @param {Function} fn - Async event handler function
 * @returns {Function} Wrapped handler
 */
export const socketHandler = (fn) => {
  return async (...args) => {
    try {
      await fn(...args);
    } catch (error) {
      const socket = args[0]; // First argument is always socket
      console.error("Socket handler error:", error);
      socketError(socket, error.message || "An error occurred");
    }
  };
};
