import React, { useState, useEffect } from 'react';
import { useGetConversations, conversationsApi } from '..';
import useGetAllUsers from '../hooks/useGetAllUsers';
import useConversation from '../store/useConversation';
import { useSocketContext } from '../../../shared/context/SocketContext';
import { useAuthContext } from '../../../shared/context/AuthContext';
import SidebarHeader from './SidebarHeader';
import ConversationsList from './ConversationsList';
import UsersList from './UsersList';
import useListenConversations from '../hooks/useListenConversations';
import '../../../styles/chat-theme.css';

const Sidebar = () => {
    useListenConversations();
    const { authUser } = useAuthContext();
    const [activeTab, setActiveTab] = useState('chats'); // 'chats' or 'users'
    const [searchInput, setSearchInput] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    // Debounce search query
    useEffect(() => {
        const handler = setTimeout(() => {
            setSearchQuery(searchInput);
        }, 300);

        return () => clearTimeout(handler);
    }, [searchInput]);

    const { loading: loadingChats, conversations, hasMore: hasMoreChats, loadMore: loadMoreChats } = useGetConversations();
    const { loading: loadingUsers, users, hasMore: hasMoreUsers, loadMore: loadMoreUsers } = useGetAllUsers(searchQuery);
    const { selectedConversation, setSelectedConversation, upsertConversation, markChatAsRead } = useConversation();
    const { onlineUsers } = useSocketContext();
    const [isCreatingChat, setIsCreatingChat] = useState(false);

    const handleSelectConversation = async (conversation) => {
        setSelectedConversation(conversation);
        // Mark as read on selection
        try {
            await conversationsApi.markAsRead(conversation._id);
            markChatAsRead(conversation._id, authUser._id);
        } catch (error) {
            console.error('Error marking chat as read:', error);
        }
    };

    const handleSelectUser = async (user) => {
        setIsCreatingChat(true);
        try {
            const data = await conversationsApi.createOrGetChat(user._id);
            if (data.success && data.chat) {
                // Instantly add/update in global conversation list
                upsertConversation(data.chat);
                setSelectedConversation(data.chat);
                // Mark as read
                await conversationsApi.markAsRead(data.chat._id);
                markChatAsRead(data.chat._id, authUser._id);
                setActiveTab('chats');
            }
        } catch (error) {
            console.error('Error starting conversation:', error);
        } finally {
            setIsCreatingChat(false);
        }
    };

    const isLoading = activeTab === 'chats' ? (loadingChats && conversations.length === 0) : (loadingUsers && users.length === 0);

    return (
        <div className="sidebar flex flex-col h-full">
            <SidebarHeader activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* Persistent Search Bar for Users Tab */}
            {activeTab === 'users' && (
                <div className="search-bar px-4 py-2 flex-shrink-0">
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl" style={{ color: 'var(--chat-text-secondary)' }}>
                            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M456.69 421.39L362.6 327.3a173.81 173.81 0 0034.84-104.58C397.44 126.38 319.06 48 222.72 48S48 126.38 48 222.72s78.38 174.72 174.72 174.72A173.81 173.81 0 00327.3 362.6l94.09 94.09a25 25 0 0035.3-35.3zM98 222.72a124.72 124.72 0 11124.72 124.72A124.86 124.86 0 0198 222.72z"></path></svg>
                        </span>
                        <input
                            type="text"
                            placeholder="Search users..."
                            className="search-input"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                        />
                    </div>
                </div>
            )}

            <div className="overflow-y-auto flex-1 custom-scrollbar">
                {isLoading ? (
                    <div className="flex items-center justify-center p-8">
                        <span className="loading loading-spinner loading-lg" style={{ color: 'var(--chat-accent-primary)' }}></span>
                    </div>
                ) : (
                    <>
                        {activeTab === 'chats' ? (
                            <ConversationsList
                                conversations={conversations}
                                selectedConversation={selectedConversation}
                                onSelectConversation={handleSelectConversation}
                                authUser={authUser}
                                onlineUsers={onlineUsers}
                                hasMore={hasMoreChats}
                                loadMore={loadMoreChats}
                                loading={loadingChats}
                            />
                        ) : (
                            <UsersList
                                users={users}
                                selectedConversation={selectedConversation}
                                onSelectUser={handleSelectUser}
                                searchQuery={searchInput}
                                setSearchQuery={setSearchInput}
                                hasMore={hasMoreUsers}
                                loadMore={loadMoreUsers}
                                loading={loadingUsers}
                                onlineUsers={onlineUsers}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Sidebar;
