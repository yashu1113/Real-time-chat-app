// server.js
import dotenv from "dotenv";
dotenv.config();

import http from "http";
import app from "./app.js";
import connectDB from "./shared/config/database.js";
import { initSocket } from "./shared/sockets/socket.js";

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    
    await connectDB();

  
    const server = http.createServer(app);

    // Attach socket.io
    initSocket(server);

    // server listening
    server.listen(PORT, () => {
      console.log(` Server running on http://localhost:${PORT}`);
      console.log(`🔌 Socket.io ready`);
    });
  } catch (error) {
    console.error(" Server startup failed:", error.message);
    process.exit(1);
  }
}

startServer();
