import React, { useEffect, useRef, useState } from 'react';
import { IoCheckmarkDone } from 'react-icons/io5';
import { formatMessageTime } from '../../../shared/utils/chatHelpers';
import useDeleteMessage from '../hooks/useDeleteMessage';
import { MdDelete } from 'react-icons/md';
import ConfirmModal from '../../../shared/components/ConfirmModal';

const MessageList = ({ messages, loading, authUser, hasMore, loadMore }) => {
    const messagesEndRef = useRef(null);
    const topLoaderRef = useRef(null);
    const containerRef = useRef(null);
    const [prevMessagesCount, setPrevMessagesCount] = useState(0);
    const { deleteMessage } = useDeleteMessage();
    const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, messageId: null });
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, messageId: null });

    const handleContextMenu = (e, message) => {
        if (message.isDeleted || (typeof message.sender === 'object' ? message.sender._id : message.sender) !== authUser._id) return;

        e.preventDefault();

        // Approximate menu dimensions
        const menuWidth = 180;
        const menuHeight = 45;

        let x = e.clientX;
        let y = e.clientY;

        // Check if menu goes off-screen right
        if (x + menuWidth > window.innerWidth) {
            x = window.innerWidth - menuWidth - 10;
        }

        // Check if menu goes off-screen bottom
        if (y + menuHeight > window.innerHeight) {
            y = window.innerHeight - menuHeight - 10;
        }

        setContextMenu({
            visible: true,
            x,
            y,
            messageId: message._id
        });
    };


    // Close context menu on click anywhere
    useEffect(() => {
        const handleClick = () => setContextMenu({ ...contextMenu, visible: false });
        window.addEventListener('click', handleClick);
        return () => window.removeEventListener('click', handleClick);
    }, [contextMenu]);

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
        <div ref={containerRef} className="messages-container relative z-10 flex flex-col overflow-y-auto">
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
                        const isDeleted = message.isDeleted;

                        return (
                            <div
                                key={message._id}
                                className={`flex ${isSent ? 'justify-end' : 'justify-start'}`}
                                onContextMenu={(e) => handleContextMenu(e, message)}
                            >
                                <div
                                    className={`message-bubble ${isSent ? 'message-bubble-sent' : 'message-bubble-received'} ${isDeleted ? 'opacity-60 italic' : ''}`}
                                >
                                    <div className="message-text">
                                        {isDeleted ? (
                                            <span className="flex items-center gap-1">
                                                <MdDelete className="text-sm opacity-50" />
                                                {isSent ? "You deleted this message" : `${message.sender?.name || 'User'} deleted this message`}
                                            </span>
                                        ) : message.content}
                                    </div>
                                    <div className="message-timestamp">
                                        <span>{formatMessageTime(message.createdAt)}</span>
                                        {isSent && !isDeleted && (
                                            <IoCheckmarkDone className="check-mark" />
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {/* Simple Right-Click Context Menu for Web */}
                    {contextMenu.visible && (
                        <div
                            className="fixed bg-[#2a2f32] border border-[#3c4144] rounded shadow-xl z-[9999] py-1 text-white text-sm"
                            style={{ top: contextMenu.y, left: contextMenu.x }}
                        >
                            <button
                                className="w-full text-left px-4 py-2 hover:bg-[#3c4144] flex items-center gap-2 text-red-400"
                                onClick={() => {
                                    const isMobile = window.innerWidth < 768;
                                    if (isMobile) {
                                        deleteMessage(contextMenu.messageId);
                                        setContextMenu({ ...contextMenu, visible: false });
                                    } else {
                                        setConfirmModal({ isOpen: true, messageId: contextMenu.messageId });
                                    }
                                }}
                            >
                                <MdDelete /> Delete for everyone
                            </button>
                        </div>
                    )}

                    {/* Modern Confirmation Modal */}
                    <ConfirmModal
                        isOpen={confirmModal.isOpen}
                        onClose={() => setConfirmModal({ isOpen: false, messageId: null })}
                        onConfirm={() => deleteMessage(confirmModal.messageId)}
                        title="Delete Message?"
                        message="This message will be deleted for everyone in this chat."
                        confirmText="Delete"
                        type="danger"
                    />
                </>
            )}
            <div ref={messagesEndRef} />
        </div>
    );
};

export default MessageList;
