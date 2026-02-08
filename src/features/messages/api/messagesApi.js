/**
 * Messages API Layer
 * Centralizes all message-related API calls
 */

import { apiFetch } from '../../../shared/utils/api';

/**
 * Get messages for a specific chat
 * @param {string} chatId - ID of the chat
 * @returns {Promise<Object>} Object containing messages array
 */
export const getMessages = async (chatId, { page = 1, limit = 20 } = {}) => {
  const query = new URLSearchParams({ page, limit }).toString();
  return apiFetch(`/api/messages/${chatId}?${query}`);
};

/**
 * Send a message to a chat
 * @param {string} chatId - Target chat ID
 * @param {string} content - Message content
 * @returns {Promise<Object>} Created message
 */
export const sendMessage = async (chatId, content) => {
  return apiFetch('/api/messages', {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chatId, content }),
  });
};

