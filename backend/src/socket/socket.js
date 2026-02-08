import { Server } from "socket.io";
import socketAuth from "./socket-auth.js";
import registerSocketEvents from "./socket-events.js";

import corsOptions from "../shared/config/cors.js";

const initializeSocket = (httpServer, app) => {
  const io = new Server(httpServer, {
    cors: corsOptions,
  });

  io.use(socketAuth);
  registerSocketEvents(io);

  if (app) {
    app.set('socketio', io);
  }

  console.log(" Socket.IO initialized");

  return io;
};

export default initializeSocket;
