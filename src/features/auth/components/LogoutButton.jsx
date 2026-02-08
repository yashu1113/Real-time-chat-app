import React from 'react';
import { IoLogOutOutline } from "react-icons/io5";
import useLogout from "../hooks/useLogout";

const LogoutButton = () => {
    const { loading, logout } = useLogout();

    return (
        <button
            className="logout-button-compact"
            onClick={logout}
            disabled={loading}
            title="Logout"
            style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--chat-text-secondary)',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                outline: 'none'
            }}
            onMouseOver={(e) => {
                e.currentTarget.style.color = 'var(--chat-text-primary)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
            }}
            onMouseOut={(e) => {
                e.currentTarget.style.color = 'var(--chat-text-secondary)';
                e.currentTarget.style.background = 'transparent';
            }}
        >
            {!loading ? (
                <IoLogOutOutline size={24} />
            ) : (
                <span className="loading loading-spinner loading-sm"></span>
            )}
        </button>
    );
};

export default LogoutButton;
