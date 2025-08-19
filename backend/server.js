import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables FIRST
dotenv.config({ path: path.resolve(__dirname, ".env") });

import express from "express";
import authRoutes from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";
import connectMongoDB from "./db/connectMongodb.js";
import passport from "passport";

import session from "express-session";

// Dynamically import passport config after dotenv config
(async () => {
  await import("../config/passport.cjs");
})();

console.log("MONGO_URI:", process.env.MONGO_URI);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json()); // To parse JSON data from the request body
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Connect to MongoDB before starting the server
connectMongoDB()
  .then(() => {
    // Define Routes
    app.use("/api/auth", authRoutes);
    app.use("/api/messages", messageRoutes);
    app.use("/api/users", userRoutes);

    // Start the server after the database connection is successful
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error.message);
  });
