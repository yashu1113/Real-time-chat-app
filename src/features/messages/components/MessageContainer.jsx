import React from "react";
import { TiMessages } from "react-icons/ti";
import { useAuthContext } from "../../../shared/context/AuthContext";
import { useSocketContext } from "../../../shared/context/SocketContext";
import useConversation from "../../conversations/store/useConversation";
import useSocketMessages from "../hooks/useSocketMessages";
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
    const { onlineUsers } = useSocketContext();

    // Listen for real-time messages
    useSocketMessages();

    // Check if selected user is online
    const isOnline = selectedConversation && onlineUsers.includes(selectedConversation._id);

    return (
        <div className="w-full h-full flex flex-col overflow-hidden">
            {selectedConversation ? (
                <>
                    {/* Fixed Header - Receiver Name with Online Status */}
                    <div className="flex-shrink-0 bg-gray-800 px-4 py-3 md:px-6 md:py-4 border-b border-gray-700 shadow-sm">
                        <div className="flex items-center gap-2">
                            <span className="text-white text-lg md:text-xl font-semibold">
                                {selectedConversation.fullName}
                            </span>
                            {isOnline && (
                                <span className="flex items-center gap-1 text-sm text-green-400">
                                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                    Online
                                </span>
                            )}
                        </div>
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
