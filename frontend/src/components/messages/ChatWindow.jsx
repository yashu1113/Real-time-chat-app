import React from "react";
import useConversation from "../../zustand/useConverstion";
import Messages from "./Messages";
import MessageInput from "./MessageInput";

const NoChatSelected = () => {
  return (
    <div className="flex items-center justify-center w-full h-full bg-gray-900">
      <div className="w-full max-w-4xl px-4 text-center flex flex-col items-center gap-4 sm:gap-6 md:gap-8">
        <p className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-200">
          Welcome 👋 Guest ❄
        </p>
        <p className="text-base sm:text-lg md:text-xl text-gray-400">
          Select a chat to start messaging
        </p>
      </div>
    </div>
  );
};

const ChatWindow = () => {
  const { selectedConversation } = useConversation();

  return (
    <div className="w-full h-full flex flex-col">
      {selectedConversation ? (
        <>
          {/* Fixed Header */}
          <div className="flex-shrink-0 sticky top-0 z-10 bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 md:px-6 md:py-4 border-b border-blue-200 shadow-sm">
            <span className="text-gray-800 text-lg md:text-xl font-semibold">
              To: <span className="font-bold text-blue-700">{selectedConversation.fullName}</span>
            </span>
          </div>

          {/* Scrollable Messages */}
          <div className="flex-1 overflow-y-auto">
            <Messages />
          </div>

          {/* Fixed Input Box */}
          <div className="flex-shrink-0 border-t border-gray-200 bg-white">
            <MessageInput />
          </div>
        </>
      ) : (
        <NoChatSelected />
      )}
    </div>
  );
};

export default ChatWindow;
