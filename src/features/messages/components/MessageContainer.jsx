import React, { useState, useRef, useEffect } from "react";
import { IoChatbubblesOutline } from 'react-icons/io5';
import { useGetMessages, useSendMessage } from '..';
import * as conversationsApi from '../../conversations/api/conversationsApi';
import useSocketMessages from '../hooks/useSocketMessages';
import useConversation from '../../conversations/store/useConversation';
import { useAuthContext } from '../../../shared/context/AuthContext';
import { useSocketContext } from '../../../shared/context/SocketContext';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import '../../../styles/chat-theme.css';

const MessageContainer = () => {
    const [messageText, setMessageText] = useState('');
    const { selectedConversation, setMessages, messages, markChatAsRead } = useConversation();
    const { loading, hasMore, loadMore } = useGetMessages();
    const { sendMessage, loading: sending } = useSendMessage();
    const { authUser } = useAuthContext();
    const { onlineUsers } = useSocketContext();

    // Listen for real-time messages
    useSocketMessages();

    useEffect(() => {
        if (selectedConversation?._id) {
            const markRead = async () => {
                try {
                    await conversationsApi.markAsRead(selectedConversation._id);
                    markChatAsRead(selectedConversation._id, authUser._id);
                } catch (error) {
                    console.error("Failed to mark chat as read:", error);
                }
            };
            markRead();
        }
    }, [selectedConversation?._id, markChatAsRead, authUser._id]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!messageText.trim() || sending) return;

        await sendMessage(messageText);
        setMessageText('');
    };

    if (!selectedConversation) {
        return (
            <div className="flex flex-col h-screen items-center justify-center" style={{ backgroundColor: 'var(--chat-bg-main)' }}>
                <div className="welcome-container">
                    <IoChatbubblesOutline className="welcome-icon mb-6" />
                    <h2 className="welcome-title">
                        Welcome 👋 {authUser?.name || 'Guest'}
                    </h2>
                    <p className="welcome-subtitle">
                        Select a chat to start messaging
                    </p>
                </div>
            </div>
        );
    }

    const otherParticipant = selectedConversation.participants?.find(p => p._id !== authUser._id) || selectedConversation;
    const isOnline = onlineUsers?.includes(otherParticipant._id);

    return (
        <div className="flex flex-col h-full">
            <ChatHeader otherParticipant={otherParticipant} isOnline={isOnline} />

            {/* Messages Area with Background Pattern */}
            <div className="flex-1 relative overflow-hidden" style={{ backgroundColor: 'var(--chat-bg-main)' }}>
                <div
                    className="absolute inset-0 opacity-[0.06]"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='400' height='400' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='pattern' x='0' y='0' width='40' height='40' patternUnits='userSpaceOnUse'%3E%3Cg fill='%23667781'%3E%3Ccircle cx='10' cy='10' r='2'/%3E%3Cpath d='M20,5 L25,10 L20,15 Z'/%3E%3Crect x='5' y='25' width='8' height='8' rx='1'/%3E%3Ccircle cx='30' cy='30' r='3'/%3E%3C/g%3E%3C/pattern%3E%3C/defs%3E%3Crect width='400' height='400' fill='url(%23pattern)'/%3E%3C/svg%3E")`,
                        backgroundRepeat: 'repeat',
                        backgroundSize: '400px',
                    }}
                ></div>

                <MessageList
                    messages={messages}
                    loading={loading}
                    authUser={authUser}
                    hasMore={hasMore}
                    loadMore={loadMore}
                />
            </div>

            <MessageInput
                messageText={messageText}
                setMessageText={setMessageText}
                onSubmit={handleSendMessage}
                sending={sending}
            />
        </div>
    );
};

export default MessageContainer;
