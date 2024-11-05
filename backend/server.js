import express from "express";
import authRoutes from "./routes/auth.routes.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";
import path from "path";
import { fileURLToPath } from "url";
import connectMongoDB from "./db/connectMongodb.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, ".env") });
console.log("MONGO_URI:", process.env.MONGO_URI);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json()); // To parse JSON data from the request body
app.use(cookieParser());

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
