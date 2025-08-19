import React from "react";
import { TiMessages } from "react-icons/ti";
import { useAuthContext } from "../../context/AuthContext";
import useConversation from "../../zustand/useConverstion";
import Messages from "./Messages";
import MessageInput from "./MessageInput";

// NoChatSelected component - shown when no conversation is selected
const NoChatSelected = () => {
  const { authUser } = useAuthContext();

  return (
    <div className="flex items-center justify-center w-full h-full bg-gray-900">
      <div className="w-full max-w-4xl px-4 text-center flex flex-col items-center gap-4 sm:gap-6 md:gap-8">
        {/* Welcome message */}
        <p className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-200">
          Welcome 👋 {authUser?.fullName || "Guest"} ❄
        </p>
        {/* Prompt to select a chat */}
        <p className="text-base sm:text-lg md:text-xl text-gray-400">
          Select a chat to start messaging
        </p>
        {/* Icon */}
        <TiMessages className="text-4xl sm:text-5xl md:text-7xl text-blue-500" aria-label="Message Icon" />
      </div>
    </div>
  );
};

// Main MessageContainer component with proper fixed scrolling layout
const MessageContainer = () => {
  const { selectedConversation } = useConversation();

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      {selectedConversation ? (
        <>
          {/* Fixed Header - Receiver Name */}
          <div className="flex-shrink-0 bg-gray-800 px-4 py-3 md:px-6 md:py-4 border-b border-gray-700 shadow-sm">
            <span className="text-white text-lg md:text-xl font-semibold">
              {selectedConversation.fullName}
            </span>
          </div>

          {/* Scrollable Messages Container - takes remaining space */}
          <div className="flex-1 overflow-y-auto">
            <Messages />
          </div>

          {/* Fixed Input Box */}
          <div className="flex-shrink-0 border-t border-gray-200 bg-white">
            <MessageInput />
          </div>
        </>
      ) : (
        // Show no chat selected when no conversation is selected
        <NoChatSelected />
      )}
    </div>
  );
};

export default MessageContainer;
