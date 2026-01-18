/**
 * Conversations API Layer
 * Centralizes all conversation-related API calls
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

/**
 * Get all conversations/users for sidebar
 * @returns {Promise<Array>} Array of users
 */
export const getConversations = async () => {
  const res = await fetch(`${API_BASE_URL}/api/users`, {
    credentials: "include",
  });
  const data = await res.json();
  
  if (data.error) {
    throw new Error(data.error);
  }

  return data;
};
