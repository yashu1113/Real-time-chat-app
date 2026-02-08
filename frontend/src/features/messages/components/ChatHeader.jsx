import { IoArrowBack } from 'react-icons/io5';
import useConversation from '../../conversations/store/useConversation';
import { getInitials, getAvatarColor, formatLastSeen } from '../../../shared/utils/chatHelpers';

const ChatHeader = ({ otherParticipant, isOnline }) => {
    const { setSelectedConversation } = useConversation();
    const avatarColor = getAvatarColor(otherParticipant?.name || 'User');
    const initials = getInitials(otherParticipant?.name || 'U');

    return (
        <div className="chat-header">
            <div className="mobile-back-btn" onClick={() => setSelectedConversation(null)}>
                <IoArrowBack />
            </div>
            <div className={`header-avatar ${avatarColor}`}>
                {otherParticipant?.avatar ? (
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
            <div className="header-info">
                <div className="header-name">{otherParticipant?.name || 'Unknown User'}</div>
                <div className="header-status">
                    {isOnline ? (
                        <span style={{ color: 'var(--chat-accent-primary)', fontWeight: '500' }}>Online</span>
                    ) : (
                        formatLastSeen(otherParticipant?.lastSeen)
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatHeader;
