/**
 * Local Storage Utilities
 * Centralized localStorage operations for type safety and consistency
 */

const STORAGE_KEYS = {
  CHAT_USER: 'chat-user',
  AUTH_TOKEN: 'auth-token',
};

/**
 * Get authenticated user from localStorage
 * @returns {Object|null} User object or null if not found
 */
export const getStoredUser = () => {
  try {
    const userStr = localStorage.getItem(STORAGE_KEYS.CHAT_USER);
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('Error parsing stored user:', error);
    return null;
  }
};

/**
 * Save authenticated user to localStorage
 * @param {Object} user - User object to store
 */
export const setStoredUser = (user) => {
  try {
    localStorage.setItem(STORAGE_KEYS.CHAT_USER, JSON.stringify(user));
  } catch (error) {
    console.error('Error storing user:', error);
  }
};

/**
 * Remove authenticated user from localStorage
 */
export const removeStoredUser = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.CHAT_USER);
  } catch (error) {
    console.error('Error removing stored user:', error);
  }
};

/**
 * Get authentication token from localStorage
 * @returns {string|null} Token or null if not found
 */
export const getStoredToken = () => {
  try {
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  } catch (error) {
    console.error('Error getting stored token:', error);
    return null;
  }
};

/**
 * Save authentication token to localStorage
 * @param {string} token - JWT token to store
 */
export const setStoredToken = (token) => {
  try {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  } catch (error) {
    console.error('Error storing token:', error);
  }
};

/**
 * Remove authentication token from localStorage
 */
export const removeStoredToken = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  } catch (error) {
    console.error('Error removing stored token:', error);
  }
};


