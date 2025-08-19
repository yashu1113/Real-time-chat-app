import React from "react";
import { useEffect, useRef } from "react";
import useConversation from "../../zustand/useConverstion";
import Message from "./Message";
import usegetmessage from "../../hooks/usegetMessage";
import MessageSkeleton from "../Skeleton/Messageskeleton";

const Messages = () => {
  const { messages, loading } = usegetmessage();
  const { selectedConversation } = useConversation();
  const lastMessageRef = useRef(null);

  useEffect(() => {
    // Scroll to the last message when messages change
    setTimeout(() => {
      lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [messages]);

  return (
    <div className="h-full">
      <div className="px-4 pb-4">
        {loading ? (
          <div className="py-2">
            <MessageSkeleton/>
            <MessageSkeleton/>
            <MessageSkeleton/>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-gray-400 text-lg mb-2">No messages yet</p>
              <p className="text-gray-500 text-sm">Start typing to begin your conversation!</p>
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
      </div>
    </div>
  );
};

export default Messages;
