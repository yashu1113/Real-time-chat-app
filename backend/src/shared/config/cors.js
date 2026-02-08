
import dotenv from 'dotenv';
dotenv.config();

const allowedOrigins = [
  "http://localhost:5173", // Local Development (Vite default)
  "http://localhost:3000", // Local Development (User's current port)
  "https://cheatchatbyyash.vercel.app", // Production Frontend
  process.env.FRONTEND_URL, // Dynamic Override
];

// Filter out undefined/null origins and duplicates
const origins = [...new Set(allowedOrigins.filter(Boolean))];

export const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (origins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.error(`Blocked by CORS: ${origin}`); // Debugging help
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'cookie'],
};

export default corsOptions;
