/**
 * Messages API Layer
 * Centralizes all message-related API calls
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

/**
 * Get messages for a conversation
 * @param {string} userId - User ID to get conversation with
 * @returns {Promise<Array>} Array of messages
 */
export const getMessages = async (userId) => {
  const res = await fetch(`${API_BASE_URL}/api/messages/${userId}`, {
    credentials: "include",
  });
  const data = await res.json();
  
  if (data.error) {
    throw new Error(data.error);
  }

  return data;
};

/**
 * Send a message to a user
 * @param {string} userId - Receiver user ID
 * @param {string} message - Message content
 * @returns {Promise<Object>} Created message
 */
export const sendMessage = async (userId, message) => {
  const res = await fetch(`${API_BASE_URL}/api/messages/send/${userId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ message }),
  });

  const data = await res.json();
  
  if (data.error) {
    throw new Error(data.error);
  }

  return data;
};
