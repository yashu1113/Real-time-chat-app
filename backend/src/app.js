import cookieParser from 'cookie-parser';
// import session from 'express-session';
import express from 'express';
import passport from 'passport';
import cors from 'cors';
import { authRoutes } from "./features/auth/index.js";
import { messageRoutes } from "./features/messages/index.js";
import { userRoutes } from "./features/users/index.js";

// Create Express app
const app = express();

// CORS Configuration - MUST be before other middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true, // Allow cookies to be sent
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Middleware
app.use(express.json());
app.use(cookieParser());
// app.use(
//   session({
//     secret: process.env.SESSION_SECRET || 'your-secret-key',
//     resave: false,
//     saveUninitialized: false,
//   })

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

export default app;