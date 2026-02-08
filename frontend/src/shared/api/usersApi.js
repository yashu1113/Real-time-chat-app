/**
 * Users API Layer
 * Centralizes all user-related API calls
 */

import { apiFetch } from '../utils/api';

/**
 * Get all users (excluding current user)
 * @param {Object} params - Query parameters
 * @param {string} params.search - Search query
 * @param {number} params.page - Page number
 * @param {number} params.limit - Items per page
 * @returns {Promise<Object>} Users data with pagination
 */
export const getAllUsers = async ({ search = '', page = 1, limit = 50 } = {}) => {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  params.append('page', page.toString());
  params.append('limit', limit.toString());
  
  const queryString = params.toString();
  return apiFetch(`/api/users${queryString ? `?${queryString}` : ''}`);
};
