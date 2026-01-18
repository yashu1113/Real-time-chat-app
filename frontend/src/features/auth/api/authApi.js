/**
 * Auth API Layer
 * Centralizes all authentication-related API calls
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

/**
 * Login user with credentials
 * @param {string} username
 * @param {string} password
 * @returns {Promise<Object>} User data
 */
export const loginUser = async (username, password) => {
  const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();
  
  if (data.error) {
    throw new Error(data.error);
  }

  return data;
};

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} User data
 */
export const registerUser = async ({ fullName, username, password, confirmPassword, gender }) => {
  const res = await fetch(`${API_BASE_URL}/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ fullName, username, password, confirmPassword, gender }),
  });

  const data = await res.json();
  
  if (data.error) {
    throw new Error(data.error);
  }

  return data;
};

/**
 * Logout current user
 * @returns {Promise<Object>} Logout response
 */
export const logoutUser = async () => {
  const res = await fetch(`${API_BASE_URL}/api/auth/logout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  const data = await res.json();
  
  if (data.error) {
    throw new Error(data.error);
  }

  return data;
};
