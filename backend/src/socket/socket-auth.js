import jwt from "jsonwebtoken";
import User from "../features/users/user.model.js";

const socketAuth = async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error("Authentication token required"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return next(new Error("User not found"));
    }

    socket.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(new Error("Token expired. Please login again."));
    }
    return next(new Error("Invalid authentication token"));
  }
};

export default socketAuth;
