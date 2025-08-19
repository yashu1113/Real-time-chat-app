import React from "react";
import { useAuthContext } from "../../context/AuthContext";

const Message = ({ message, selectedConversation }) => {
  const { authUser } = useAuthContext();
  const fromMe = message.senderId === authUser?._id;
  const chatClassName = fromMe ? "chat-end" : "chat-start";
  const profilePic = fromMe ? authUser?.profilePic : selectedConversation?.profilePic;
  const bubbleBgColor = fromMe ? "bg-blue-500" : "bg-gray-700";

  return (
    <div className={`chat ${chatClassName} flex-shrink-0`}>
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <img alt="avatar" src={profilePic || "/avatar-placeholder.png"} />
        </div>
      </div>
      <div className={`chat-bubble text-white ${bubbleBgColor} pb-2 break-words max-w-xs md:max-w-md lg:max-w-lg`}>
        {message.message}
      </div>
      <div className="chat-footer opacity-50 text-xs flex gap-1 items-center">
        {new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </div>
    </div>
  );
};

export default Message;
