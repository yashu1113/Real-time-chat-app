import React from 'react';
import { getInitials, getAvatarColor } from '../../../shared/utils/chatHelpers';
import '../../../styles/chat-theme.css';

const UserListItem = ({ user, onSelectUser, isSelected = false, isOnline = false }) => {
    const avatarColor = getAvatarColor(user.name);
    const initials = getInitials(user.name);

    return (
        <div
            className={`chat-list-item ${isSelected ? 'active' : ''}`}
            onClick={() => onSelectUser(user)}
        >
            <div className={`chat-avatar ${avatarColor}`}>
                {user.avatar ? (
                    <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-full h-full object-cover rounded-full"
                    />
                ) : (
                    initials
                )}
                {isOnline && <div className="online-indicator"></div>}
            </div>
            <div className="chat-info">
                <div className="chat-header-row">
                    <span className="chat-name">{user.name}</span>
                </div>
                <div className="flex items-center justify-between">
                    <p className="chat-preview">
                        {user.about || 'Hey there! I am using chat app'}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default UserListItem;
