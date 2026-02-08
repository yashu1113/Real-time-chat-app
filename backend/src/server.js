// server.js
import dotenv from "dotenv";
dotenv.config();

import http from "http";
import app from "./app.js";
import connectDB from "./shared/config/database.js";
import initializeSocket from "./socket/socket.js";


const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    
    await connectDB();

  
    const server = http.createServer(app);

    // Initialize Socket.IO
    initializeSocket(server, app);

    // server listening
    server.listen(PORT, () => {
      console.log(` Server running on http://localhost:${PORT}`);
    
    });
  } catch (error) {
    console.error(" Server startup failed:", error.message);
    process.exit(1);
  }
}

startServer();
