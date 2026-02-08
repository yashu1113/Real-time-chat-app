/**
 * Conversations API Layer
 * Centralizes all conversation-related API calls
 */

import { apiFetch } from '../../../shared/utils/api';

/**
 * Get all conversations for current user
 * @returns {Promise<Object>} Object containing chats array
 */
export const getConversations = async ({ page = 1, limit = 20 } = {}) => {
  const query = new URLSearchParams({ page, limit }).toString();
  return apiFetch(`/api/chats?${query}`);
};

/**
 * Create or get an existing chat with another user
 * @param {string} receiverUserId - ID of the user to chat with
 * @returns {Promise<Object>} Created or retrieved chat object
 */
export const createOrGetChat = async (receiverUserId) => {
  return apiFetch('/api/chats', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ receiverUserId }),
  });
};

/**
 * Mark a specific chat as read for the current user
 * @param {string} chatId - ID of the chat to mark as read
 * @returns {Promise<Object>} Success message
 */
export const markAsRead = async (chatId) => {
  return apiFetch(`/api/chats/${chatId}/read`, {
    method: 'PATCH',
  });
};

