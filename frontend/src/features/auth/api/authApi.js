/**
 * Auth API Layer
 * Centralizes all authentication-related API calls
 */

import { apiFetch } from '../../../shared/utils/api';

/**
 * Login user with credentials
 * @param {string} email
 * @param {string} password
 * @returns {Promise<Object>} User data
 */
export const loginUser = async (email, password) => {
  return apiFetch('/api/auth/login', {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
};

/**
 * Register a new user
 * @param {Object} userData - User registration data (name, email, password)
 * @returns {Promise<Object>} User data
 */
export const registerUser = async ({ name, email, password }) => {
  return apiFetch('/api/auth/signup', {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
};

/**
 * Logout current user
 * @returns {Promise<Object>} Logout response
 */
export const logoutUser = async () => {
  return apiFetch('/api/auth/logout', {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
};

