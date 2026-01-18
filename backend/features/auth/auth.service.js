import bcrypt from "bcryptjs";
import { User } from "../users/user.model.js";
import * as userService from "../users/user.service.js";

/**
 * Auth Service Layer
 * Handles all authentication-related business logic
 */

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} Created user object
 */
export const registerUser = async ({ fullName, username, password, gender }) => {
  // Check if user already exists
  const existingUser = await userService.findUserByUsername(username);
  
  if (existingUser) {
    throw new Error("Username already exists");
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Generate profile picture
  const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
  const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

  // Create new user
  const newUser = await userService.createUser({
    fullName,
    username,
    password: hashedPassword,
    gender,
    profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
  });

  return {
    _id: newUser._id,
    fullName: newUser.fullName,
    username: newUser.username,
    profilePic: newUser.profilePic,
  };
};

/**
 * Authenticate user login
 * @param {string} username - Username
 * @param {string} password - Password
 * @returns {Promise<Object>} User object
 */
export const authenticateUser = async (username, password) => {
  const user = await User.findOne({ username });
  
  const isPasswordCorrect = await bcrypt.compare(
    password,
    user?.password || ""
  );

  if (!user || !isPasswordCorrect) {
    throw new Error("Invalid username or password");
  }

  return {
    _id: user._id,
    fullName: user.fullName,
    username: user.username,
    profilePic: user.profilePic,
  };
};

/**
 * Handle Google OAuth user
 * @param {Object} profile - Google profile data
 * @returns {Promise<Object>} User object
 */
export const handleGoogleAuth = async (profile) => {
  const user = await userService.findOrCreateUser(
    { googleId: profile.id },
    {
      googleId: profile.id,
      email: profile.emails[0].value,
      fullName: profile.displayName,
      username: profile.emails[0].value.split("@")[0],
      provider: "google",
      profilePic: profile.photos[0]?.value || "",
    }
  );

  return user;
};
