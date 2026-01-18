import React from "react";
import { useAuthContext } from "../../../shared/context/AuthContext";

const Message = ({ message, selectedConversation }) => {
  const { authUser } = useAuthContext();
  const fromMe = message.senderId === authUser?._id;
  const chatClassName = fromMe ? "chat-end" : "chat-start";
  const bubbleBgColor = fromMe ? "bg-blue-500" : "bg-gray-700";

  // Use profile pic if available, otherwise use initials avatar
  const senderName = fromMe ? authUser?.fullName : (selectedConversation?.fullName || 'User');
  const profilePic = fromMe ? authUser?.profilePic : selectedConversation?.profilePic;
  const avatarBg = fromMe ? '3B82F6' : '374151';
  const fallbackAvatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(senderName)}&background=${avatarBg}&color=fff&size=128&bold=true`;

  // Format timestamps
  const shortTime = new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const fullTimestamp = new Date(message.createdAt).toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  return (
    <div className={`chat ${chatClassName} flex-shrink-0`}>
      <div className="chat-image avatar">
        <div className="w-10 h-10 rounded-full ring-2 ring-gray-600">
          <img
            alt={senderName}
            src={profilePic || fallbackAvatarUrl}
            className="w-full h-full rounded-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = fallbackAvatarUrl;
            }}
          />
        </div>
      </div>
      <div className={`chat-bubble text-white ${bubbleBgColor} pb-2 break-words max-w-xs md:max-w-md lg:max-w-lg`}>
        {message.message}
      </div>
      <div
        className="chat-footer opacity-50 text-xs flex gap-1 items-center cursor-help transition-opacity hover:opacity-100"
        title={fullTimestamp}
      >
        {shortTime}
      </div>
    </div>
  );
};

export default Message;
