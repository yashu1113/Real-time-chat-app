import React from 'react';
import { IoChatbubbleEllipsesOutline } from 'react-icons/io5';
import { getInitials, getAvatarColor, formatMessageTime } from '../../../shared/utils/chatHelpers';

const ConversationsList = ({ conversations, selectedConversation, onSelectConversation, authUser, onlineUsers, hasMore, loadMore, loading }) => {
    const loaderRef = React.useRef(null);

    React.useEffect(() => {
        if (!loaderRef.current || !hasMore) return;

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                loadMore();
            }
        }, { threshold: 1.0 });

        observer.observe(loaderRef.current);

        return () => {
            if (loaderRef.current) observer.unobserve(loaderRef.current);
        };
    }, [hasMore, loadMore]);

    if (!conversations || (conversations.length === 0 && !loading)) {
        return (
            <div className="empty-state">
                <IoChatbubbleEllipsesOutline
                    className="welcome-icon mb-4"
                    style={{ fontSize: '64px', color: 'var(--chat-text-tertiary)', opacity: 0.5 }}
                />
                <p className="empty-state-text">No conversations yet</p>
                <p className="empty-state-subtext">Start chatting with someone!</p>
            </div>
        );
    }

    return (
        <>
            {conversations.map((chat) => {
                const otherParticipant = chat.participants?.find(p => p._id !== authUser._id) || {};
                const isOnline = onlineUsers?.includes(otherParticipant._id);
                const isSelected = selectedConversation?._id === chat._id;
                const avatarColor = getAvatarColor(otherParticipant.name || 'User');
                const initials = getInitials(otherParticipant.name || 'U');
                const unreadCount = chat.unreadCounts?.find(e => {
                    const entryId = typeof e.user === 'object' ? e.user._id : e.user;
                    return entryId?.toString() === authUser._id?.toString();
                })?.count || 0;

                const isLastMsgFromMe = chat.lastMessage?.sender?._id === authUser._id || chat.lastMessage?.sender === authUser._id;

                return (
                    <div
                        key={chat._id}
                        className={`chat-list-item ${isSelected ? 'active' : ''}`}
                        onClick={() => onSelectConversation(chat)}
                    >
                        <div className={`chat-avatar ${avatarColor}`}>
                            {otherParticipant.avatar ? (
                                <img
                                    src={otherParticipant.avatar}
                                    alt={otherParticipant.name}
                                    className="w-full h-full object-cover rounded-full"
                                />
                            ) : (
                                initials
                            )}
                            {isOnline && <div className="online-indicator"></div>}
                        </div>
                        <div className="chat-info">
                            <div className="chat-header-row">
                                <span className="chat-name">{otherParticipant.name || 'Unknown User'}</span>
                                <span className="chat-time">
                                    {formatMessageTime(chat.updatedAt || chat.lastMessage?.createdAt)}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <p className="chat-preview truncate pr-2">
                                    {isLastMsgFromMe ? 'You: ' : ''}
                                    {chat.lastMessage?.content || 'No messages yet'}
                                </p>
                                {unreadCount > 0 && !isSelected && (
                                    <span className="bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                                        {unreadCount}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}

            {/* Sentinel for infinite scroll */}
            {hasMore && (
                <div ref={loaderRef} className="flex justify-center p-4">
                    {loading && <span className="loading loading-spinner loading-sm" style={{ color: 'var(--chat-accent-primary)' }}></span>}
                </div>
            )}
        </>
    );
};

export default ConversationsList;
