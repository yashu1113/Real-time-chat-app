import User from "./user.model.js";
import Conversation from "../messages/conversation.model.js";

/**
 * User Service Layer
 * Handles all user-related business logic
 */

/**
 * Get all users with whom the logged-in user has conversations
 * @param {string} loggedInUserId - ID of the logged-in user
 * @returns {Promise<Array>} Array of users with active conversations
 */
export const getUsersExceptCurrent = async (loggedInUserId) => {
  try {
    // Find all conversations where the logged-in user is a participant
    const conversations = await Conversation.find({
      participants: loggedInUserId,
    }).populate("participants", "-password");

    // Extract unique user IDs (excluding the logged-in user)
    const userIds = new Set();
    conversations.forEach((conversation) => {
      conversation.participants.forEach((participant) => {
        if (participant._id.toString() !== loggedInUserId.toString()) {
          userIds.add(participant._id.toString());
        }
      });
    });

    // Fetch user details for the participant IDs
    const users = await User.find({
      _id: { $in: Array.from(userIds) },
    }).select("-password");
    
    return users;
  } catch (error) {
    throw new Error(`Failed to fetch users: ${error.message}`);
  }
};

/**
 * Find user by username
 * @param {string} username - Username to search for
 * @returns {Promise<Object|null>} User object or null
 */
export const findUserByUsername = async (username) => {
  try {
    return await User.findOne({ username });
  } catch (error) {
    throw new Error(`Failed to find user by username: ${error.message}`);
  }
};

/**
 * Find user by ID
 * @param {string} userId - User ID
 * @returns {Promise<Object|null>} User object or null
 */
export const findUserById = async (userId) => {
  try {
    return await User.findById(userId).select("-password");
  } catch (error) {
    throw new Error(`Failed to find user by ID: ${error.message}`);
  }
};

/**
 * Create a new user
 * @param {Object} userData - User data
 * @returns {Promise<Object>} Created user
 */
export const createUser = async (userData) => {
  try {
    const newUser = new User(userData);
    await newUser.save();
    return newUser;
  } catch (error) {
    throw new Error(`Failed to create user: ${error.message}`);
  }
};

/**
 * Find or create user (for OAuth)
 * @param {Object} query - Query to find user
 * @param {Object} userData - User data to create if not found
 * @returns {Promise<Object>} User object
 */
export const findOrCreateUser = async (query, userData) => {
  try {
    let user = await User.findOne(query);
    
    if (!user) {
      user = new User(userData);
      await user.save();
    }
    
    return user;
  } catch (error) {
    throw new Error(`Failed to find or create user: ${error.message}`);
  }
};
