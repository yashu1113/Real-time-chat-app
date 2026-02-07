import { Server } from "socket.io";
import socketAuth from "./socket-auth.js";
import registerSocketEvents from "./socket-events.js";

const initializeSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      credentials: true,
      methods: ["GET", "POST"],
    },
  });

  io.use(socketAuth);
  registerSocketEvents(io);

  console.log(" Socket.IO initialized");

  return io;
};

export default initializeSocket;
