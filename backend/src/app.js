import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import authRoutes from "./features/auth/auth-routes.js";
import userRoutes from "./features/users/user-routes.js";
import chatRoutes from "./features/chat/chat-routes.js";
import messageRoutes from "./features/messages/message-routes.js";




// Create Express app
const app = express();

  
// CORS Configuration - MUST be before other middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true, // Allow cookies to be sent
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'cookie '],
}));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

app.use(express.json());

app.get("/health", (req,res) => {
  res.status(200).json({
    message: "Server is running"
  })
})


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);



 


app.use((err, req, res, next)=> {
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error "
  })
})

export default app;