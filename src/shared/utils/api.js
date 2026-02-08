/**
 * API Configuration
 * Centralized API base URL configuration
 */

import { getStoredToken } from './storage';

export const API_BASE_URL = import.meta.env.VITE_API_URL || '';

/**
 * Fetch wrapper with error handling
 * @param {string} url - API endpoint
 * @param {Object} options - Fetch options
 * @returns {Promise<Object>} Response data
 */
export const apiFetch = async (url, options = {}) => {
  const token = getStoredToken();
  
  const headers = {
    ...options.headers,
  };
  
  // Add Authorization header if token exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${url}`, {
    credentials: 'include',
    ...options,
    headers,
  });

  const data = await res.json();

  // Backend returns { success: false, message: "..." } for errors
  if (!res.ok || data.success === false) {
    throw new Error(data.message || `HTTP error! status: ${res.status}`);
  }

  return data;
};
