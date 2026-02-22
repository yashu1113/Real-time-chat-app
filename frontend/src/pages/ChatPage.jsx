import { IoArrowBack } from "react-icons/io5";
import { Navigate } from 'react-router-dom';
import { Sidebar } from '../features/conversations';
import { MessageContainer } from '../features/messages';
import { useAuthContext } from '../shared/context/AuthContext';
import useConversation from '../features/conversations/store/useConversation';
import '../styles/chat-theme.css';

const ChatPage = () => {
    const { authUser } = useAuthContext();
    const { selectedConversation, setSelectedConversation } = useConversation();

    // Redirect to login if not authenticated
    if (!authUser) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="flex h-screen overflow-hidden" style={{ height: '100dvh', backgroundColor: 'var(--chat-bg-main)' }}>
            <div className={`h-full min-h-0 ${selectedConversation ? 'mobile-hidden' : ''}`} style={{ width: 'auto' }}>
                <Sidebar />
            </div>

            <div className={`flex-1 h-full min-h-0 flex flex-col ${!selectedConversation ? 'mobile-hidden' : 'messages-container-wrapper'}`}>
                <MessageContainer />
            </div>
        </div>
    );
};

export default ChatPage;
