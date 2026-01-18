// import path from "path";
// import { fileURLToPath } from "url";
// import dotenv from "dotenv";
// import app from "../backend/sockets/socket.js";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Load environment variables FIRST
// dotenv.config({ path: path.resolve(__dirname, ".env") });

// import express from "express";
// import authRoutes from "./routes/auth.routes.js";
// import cookieParser from "cookie-parser";
// import messageRoutes from "./routes/message.routes.js";
// import userRoutes from "./routes/user.routes.js";
// import connectMongoDB from "./db/connectMongodb.js";
// import passport from "passport";

// import session from "express-session";

// // Dynamically import passport config after dotenv config
// (async () => {
//   await import("../config/passport.cjs");
// })();

// console.log("MONGO_URI:", process.env.MONGO_URI);

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(express.json()); 
// app.use(cookieParser());
// app.use(
//   session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false,
//   })
// );
// app.use(passport.initialize());
// app.use(passport.session());

// // Connect to MongoDB before starting the server
// connectMongoDB()
//   .then(() => {
//     // Define Routes
//     app.use("/api/auth", authRoutes);
//     app.use("/api/messages", messageRoutes);
//     app.use("/api/users", userRoutes);

//     // Start the server after the database connection is successful
//     app.listen(PORT, () => {
//       console.log(`Server is running on port ${PORT}`);
//     });
//   })
//   .catch((error) => {
//     console.error("Failed to connect to MongoDB:", error.message);
//   });

import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });   

// Load passport configuration (must be after dotenv)
await import("../config/passport.js");

import { server } from "./shared/sockets/socket.js";
import connectDB from "./shared/config/database.js";

// Import app.js AFTER socket.js has created the app (to avoid circular dependency)
await import("./app.js");

const PORT = process.env.PORT || 5000;

try {
  await connectDB();  

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`🔌 WebSocket server is ready`);
  });

} catch (err) {
  console.log("server startup error:", err.message);
  process.exit(1);
}
