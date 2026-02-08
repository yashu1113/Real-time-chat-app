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
        <div className="flex h-screen overflow-hidden" style={{ backgroundColor: 'var(--chat-bg-main)' }}>
            <div className={`h-full ${selectedConversation ? 'mobile-hidden' : ''}`} style={{ width: 'auto' }}>
                <Sidebar />
            </div>

            <div className={`flex-1 h-full flex flex-col ${!selectedConversation ? 'mobile-hidden' : 'messages-container-wrapper'}`}>
                {/* Mobile Header Override / Back Button area could be here or inside MessageContainer */}
                {/* Actually, it's cleaner to put the back button inside the ChatHeader or a wrapper here. 
                    Let's put a subtle back button overlay or rely on the ChatHeader modification.
                    Wait, the design says "Add 'Back' button to ChatHeader.jsx".
                    Let's follow that. For now, pass the handler down or just use the store in ChatHeader.
                */}
                <MessageContainer />
            </div>
        </div>
    );
};

export default ChatPage;
