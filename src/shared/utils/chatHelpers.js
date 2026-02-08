/**
 * Chat UI Helper Functions
 * Utilities for formatting data in the chat interface
 */

/**
 * Get initials from a user's name
 * name: Full name
 * initials: max 2 characters
 */
export const getInitials = (name) => {
  if (!name) return '??';
  
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

/**
 * Format timestamp for message display
 * date: Message timestamp (string or Date)
 * returns: Formatted time string
 */
export const formatMessageTime = (date) => {
  if (!date) return '';
  
  const messageDate = new Date(date);
  const now = new Date();
  const diffInMs = now - messageDate;
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) {
    // Today: show time (e.g., "2:30 PM")
    return messageDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  } else if (diffInDays === 1) {
    return 'Yesterday';
  } else if (diffInDays < 7) {
    // This week: show day name
    return messageDate.toLocaleDateString('en-US', { weekday: 'long' });
  } else {
    // Older: show date
    return messageDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  }
};

/**
 * Generate consistent avatar color based on name
 * name: User's name
 * returns: Tailwind CSS class for background color
 */
export const getAvatarColor = (name) => {
  if (!name) return 'bg-gray-500';
  
  const colors = [
    'bg-cyan-500',
    'bg-blue-500',
    'bg-purple-500',
    'bg-green-600',
    'bg-pink-500',
    'bg-red-500',
    'bg-yellow-500',
    'bg-indigo-500',
    'bg-teal-500',
    'bg-orange-500',
  ];
  
  // Use first character code to pick color
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};

/**
 * Truncate message preview for chat list
 * text: Message content
 * maxLength: Maximum length
 * returns: Truncated text
 */
export const truncateMessage = (text, maxLength = 35) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

/**
 * Format last seen timestamp
 * date: Last seen timestamp (string or Date)
 * returns: Formatted last seen string
 */
export const formatLastSeen = (date) => {
  if (!date) return 'Last seen recently';
  
  const lastSeenDate = new Date(date);
  const now = new Date();
  const diffInMs = now - lastSeenDate;
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) {
    return `Last seen at ${lastSeenDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })}`;
  } else if (diffInDays === 1) {
    return 'Last seen yesterday';
  } else if (diffInDays < 7) {
    return `Last seen on ${lastSeenDate.toLocaleDateString('en-US', { weekday: 'long' })}`;
  } else {
    return `Last seen on ${lastSeenDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })}`;
  }
};

/**
 * Check if user is online
 * userId: User ID to check
 * onlineUsers: Array of online user IDs
 * returns: True if user is online
 */
export const isUserOnline = (userId, onlineUsers) => {
  return onlineUsers?.includes(userId) || false;
};
