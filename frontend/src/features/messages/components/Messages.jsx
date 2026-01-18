import React from "react";
import { useEffect, useRef } from "react";
import useConversation from "../../conversations/store/useConversation";
import Message from "./Message";
import useGetMessages from "../hooks/useGetMessages";
import MessageSkeleton from "../../../shared/components/Skeleton/MessageSkeleton";

const Messages = () => {
    const { messages, loading } = useGetMessages();
    const { selectedConversation } = useConversation();
    const lastMessageRef = useRef(null);
    const messagesContainerRef = useRef(null);

    useEffect(() => {
        // Auto-scroll to the last message when messages change
        setTimeout(() => {
            lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    }, [messages]);

    return (
        <div
            ref={messagesContainerRef}
            className="h-full overflow-auto px-4 pb-4 custom-scrollbar"
        >
            {loading ? (
                <div className="py-2 space-y-4">
                    <MessageSkeleton />
                    <MessageSkeleton />
                    <MessageSkeleton />
                </div>
            ) : messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                        <p className="text-gray-400 text-lg mb-2">No messages yet</p>
                        <p className="text-gray-500 text-sm">Start typing to begin your conversation! 💬</p>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col gap-2">
                    {messages.map((message, index) => (
                        <div key={message._id || index} ref={index === messages.length - 1 ? lastMessageRef : null}>
                            <Message message={message} selectedConversation={selectedConversation} />
                        </div>
                    ))}
                </div>
            )}

            <style jsx>{`
                /* Hide scrollbar by default, show on hover */
                .custom-scrollbar {
                    scrollbar-width: thin;
                    scrollbar-color: transparent transparent;
                }
                .custom-scrollbar:hover {
                    scrollbar-color: rgb(75 85 99) transparent;
                }
                /* For webkit browsers (Chrome, Safari, Edge) */
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: transparent;
                    border-radius: 3px;
                }
                .custom-scrollbar:hover::-webkit-scrollbar-thumb {
                    background: rgb(75 85 99);
                }
                .custom-scrollbar:hover::-webkit-scrollbar-thumb:hover {
                    background: rgb(107 114 128);
                }
            `}</style>
        </div>
    );
};

export default Messages;
