/**
 * Socket response utilities for consistent error and success responses
 */

export const socketError = (socket, message) => {
  socket.emit("error", {
    success: false,
    message,
  });
};

export const socketSuccess = (socket, event, data) => {
  socket.emit(event, {
    success: true,
    ...data,
  });
};

export const broadcastToRoom = (io, room, event, data) => {
  io.to(room).emit(event, {
    success: true,
    ...data,
  });
};

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
