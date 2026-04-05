import { Navigate } from 'react-router-dom';
import { Sidebar } from '../features/conversations';
import { MessageContainer } from '../features/messages';
import { useAuthContext } from '../shared/context/AuthContext';
import useConversation from '../features/conversations/store/useConversation';
import '../styles/chat-theme.css';

const ChatPage = () => {
    const { authUser } = useAuthContext();
    const { selectedConversation } = useConversation();

    // Redirect to login if not authenticated
    if (!authUser) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="flex h-[100dvh] w-full overflow-hidden" style={{ backgroundColor: 'var(--chat-bg-main)' }}>
            {/* Sidebar Container */}
            <div className={`h-full flex-shrink-0 ${selectedConversation ? 'hidden sm:flex' : 'w-full sm:w-auto'}`}>
                <Sidebar />
            </div>

            {/* Chat Container */}
            <div className={`flex-1 h-full flex flex-col ${!selectedConversation ? 'hidden sm:flex' : 'w-full messages-container-wrapper relative'}`}>
                <MessageContainer />
            </div>
        </div>
    );
};

export default ChatPage;
