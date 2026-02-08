import { createContext, useContext, useState, useEffect } from "react";
import { getStoredUser, setStoredUser, getStoredToken, setStoredToken } from "../utils/storage";

export const AuthContext = createContext();

export const useAuthContext = () => {
    return useContext(AuthContext);
};

export const AuthContextProvider = ({ children }) => {
    const [authUser, setAuthUser] = useState(getStoredUser());

    useEffect(() => {
        // Check for token in URL (Google Auth redirect flow)
        const urlParams = new URLSearchParams(window.location.search);
        const tokenFromUrl = urlParams.get('token');

        if (tokenFromUrl) {
            setStoredToken(tokenFromUrl);
            // Clean up the URL to remove the token from the browser history
            window.history.replaceState({}, document.title, window.location.pathname);
        }

        const token = getStoredToken();

        // Only fetch /me if we have a token but no user in state
        if (token && !authUser) {
            fetch("/api/auth/me", {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                credentials: "include",
            })
                .then((res) => (res.ok ? res.json() : null))
                .then((data) => {
                    // Backend returns: { success: true, user: {...} }
                    if (data && data.success && data.user) {
                        setAuthUser(data.user);
                        setStoredUser(data.user);
                    }
                })
                .catch((error) => {
                    console.error('Error fetching user:', error);
                });
        }
        // eslint-disable-next-line
    }, []);

    return <AuthContext.Provider value={{ authUser, setAuthUser }}>{children}</AuthContext.Provider>;
};


