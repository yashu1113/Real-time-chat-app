import React, { useEffect, useRef, useState } from 'react';
import { IoCheckmarkDone } from 'react-icons/io5';
import { formatMessageTime } from '../../../shared/utils/chatHelpers';

const MessageList = ({ messages, loading, authUser, hasMore, loadMore }) => {
    const messagesEndRef = useRef(null);
    const topLoaderRef = useRef(null);
    const containerRef = useRef(null);
    const [prevMessagesCount, setPrevMessagesCount] = useState(0);

    // Scroll to bottom whenever messages change
    useEffect(() => {
        if (messages.length > 0) {
            // If it's the very first load or a new message, scroll to bottom
            // We can check if the user was already at the bottom to decide whether to auto-scroll,
            // but for now, let's enforce scroll on mount and new messages.
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    // Infinite scroll for older messages (upwards)
    useEffect(() => {
        if (!topLoaderRef.current || !hasMore) return;

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !loading) {
                loadMore();
            }
        }, { threshold: 0.1 });

        observer.observe(topLoaderRef.current);

        return () => {
            if (topLoaderRef.current) observer.unobserve(topLoaderRef.current);
        };
    }, [hasMore, loadMore, loading]);

    return (
        <div ref={containerRef} className="messages-container relative z-10 flex flex-col h-full overflow-y-auto">
            {/* Sentinel for loading history */}
            {hasMore && (
                <div ref={topLoaderRef} className="flex justify-center p-4">
                    {loading && <span className="loading loading-spinner loading-sm" style={{ color: 'var(--chat-accent-primary)' }}></span>}
                </div>
            )}

            {messages.length === 0 && !loading ? (
                <div className="flex items-center justify-center flex-1">
                    <p style={{ color: 'var(--chat-text-secondary)' }}>
                        No messages yet. Start the conversation!
                    </p>
                </div>
            ) : (
                <>
                    {messages.map((message) => {
                        const messageSenderId = typeof message.sender === 'object' ? message.sender._id : message.sender;
                        const isSent = messageSenderId === authUser._id;

                        return (
                            <div
                                key={message._id}
                                className={`flex ${isSent ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`message-bubble ${isSent ? 'message-bubble-sent' : 'message-bubble-received'}`}
                                >
                                    <div className="message-text">{message.content}</div>
                                    <div className="message-timestamp">
                                        <span>{formatMessageTime(message.createdAt)}</span>
                                        {isSent && (
                                            <IoCheckmarkDone className="check-mark" />
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </>
            )}
            <div ref={messagesEndRef} />
        </div>
    );
};

export default MessageList;
