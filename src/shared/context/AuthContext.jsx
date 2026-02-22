import { createContext, useContext, useState, useEffect } from "react";
import { getStoredUser, setStoredUser, removeStoredUser, getStoredToken, setStoredToken, removeStoredToken } from "../utils/storage";

export const AuthContext = createContext();

export const useAuthContext = () => {
    return useContext(AuthContext);
};

// Extract token from URL synchronously BEFORE React renders anything.
// This is the critical fix: if we wait until useEffect, App.jsx has already
// redirected to /login and the token URL is gone.
function extractTokenFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get('token');
    if (tokenFromUrl) {
        setStoredToken(tokenFromUrl);
        window.history.replaceState({}, document.title, window.location.pathname);
    }
}
extractTokenFromUrl();

export const AuthContextProvider = ({ children }) => {
    const [authUser, setAuthUser] = useState(getStoredUser());
    const [loading, setLoading] = useState(!getStoredUser() && !!getStoredToken());

    useEffect(() => {
        const token = getStoredToken();

        // Fetch /me if we have a token but no user object yet (e.g. fresh Google login)
        if (token && !authUser) {
            const apiUrl = import.meta.env.VITE_API_URL || "";
            fetch(`${apiUrl}/api/auth/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                credentials: "include",
            })
                .then((res) => (res.ok ? res.json() : null))
                .then((data) => {
                    if (data && data.success && data.user) {
                        setAuthUser(data.user);
                        setStoredUser(data.user);
                    } else {
                        // Token is invalid/expired — clear it so spinner never shows again
                        removeStoredToken();
                        removeStoredUser();
                    }
                })
                .catch((error) => {
                    console.error('Error fetching user:', error);
                    removeStoredToken();
                    removeStoredUser();
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
        // eslint-disable-next-line
    }, []);

    return (
        <AuthContext.Provider value={{ authUser, setAuthUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
