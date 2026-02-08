import React from 'react';
import { IoPeople, IoChatbubbles } from 'react-icons/io5';
import { LogoutButton } from '../../auth';

const SidebarHeader = ({ activeTab, setActiveTab }) => {
    return (
        <div className="sidebar-header" style={{ flexDirection: 'column', alignItems: 'stretch', padding: '16px 0 0 0', height: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px 12px 20px' }}>
                <h1 className="sidebar-title" style={{ padding: 0, margin: 0 }}>Messages</h1>
                <LogoutButton />
            </div>

            {/* Tab Navigation */}
            <div style={{ display: 'flex', borderBottom: `1px solid var(--chat-border)` }}>
                <button
                    onClick={() => setActiveTab('chats')}
                    style={{
                        flex: 1,
                        padding: '12px 16px',
                        background: 'transparent',
                        border: 'none',
                        color: activeTab === 'chats' ? 'var(--chat-accent-primary)' : 'var(--chat-text-secondary)',
                        fontWeight: activeTab === 'chats' ? 600 : 400,
                        fontSize: '14px',
                        cursor: 'pointer',
                        borderBottom: activeTab === 'chats' ? '2px solid var(--chat-accent-primary)' : '2px solid transparent',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                    }}
                >
                    <IoChatbubbles size={18} />
                    Chats
                </button>
                <button
                    onClick={() => setActiveTab('users')}
                    style={{
                        flex: 1,
                        padding: '12px 16px',
                        background: 'transparent',
                        border: 'none',
                        color: activeTab === 'users' ? 'var(--chat-accent-primary)' : 'var(--chat-text-secondary)',
                        fontWeight: activeTab === 'users' ? 600 : 400,
                        fontSize: '14px',
                        cursor: 'pointer',
                        borderBottom: activeTab === 'users' ? '2px solid var(--chat-accent-primary)' : '2px solid transparent',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                    }}
                >
                    <IoPeople size={18} />
                    All Users
                </button>
            </div>
        </div>
    );
};

export default SidebarHeader;
