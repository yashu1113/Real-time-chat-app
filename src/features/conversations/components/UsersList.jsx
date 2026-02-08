import React, { useEffect, useRef } from 'react';
import { IoSearch, IoChatbubbleEllipsesOutline } from 'react-icons/io5';
import UserListItem from './UserListItem';

const UsersList = ({ users, selectedConversation, onSelectUser, hasMore, loadMore, loading, onlineUsers }) => {
    const loaderRef = useRef(null);

    useEffect(() => {
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

    return (
        <>
            {/* List */}
            {(!users || users.length === 0) && !loading ? (
                <div className="empty-state">
                    <IoChatbubbleEllipsesOutline
                        className="welcome-icon mb-4"
                        style={{ fontSize: '64px', color: 'var(--chat-text-tertiary)', opacity: 0.5 }}
                    />
                    <p className="empty-state-text">No users found</p>
                    <p className="empty-state-subtext">Try a different search</p>
                </div>
            ) : (
                <>
                    {users.map((user) => {
                        const isOnline = onlineUsers?.includes(user._id);
                        const isSelected = selectedConversation?.participants
                            ? selectedConversation.participants.some(p => p._id === user._id)
                            : selectedConversation?._id === user._id;

                        return (
                            <UserListItem
                                key={user._id}
                                user={user}
                                onSelectUser={onSelectUser}
                                isSelected={isSelected}
                                isOnline={isOnline}
                            />
                        );
                    })}

                    {/* Sentinel for infinite scroll */}
                    {hasMore && (
                        <div ref={loaderRef} className="flex justify-center p-4">
                            {loading && <span className="loading loading-spinner loading-sm" style={{ color: 'var(--chat-accent-primary)' }}></span>}
                        </div>
                    )}
                </>
            )}
        </>
    );
};

export default UsersList;
