import { createContext, useState, useEffect, useContext } from "react";
import { useAuthContext } from "./AuthContext";
import io from "socket.io-client";

export const SocketContext = createContext();

/**
 * Hook to access socket context
 */
export const useSocketContext = () => {
    return useContext(SocketContext);
};

/**
 * SocketContext Provider
 * Manages WebSocket connection and online users state
 */
export const SocketContextProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const { authUser } = useAuthContext();

    useEffect(() => {
        if (authUser) {
            // Initialize socket connection with user ID
            // Connect directly to backend for WebSocket (Vite proxy doesn't handle WS well)
            const socketInstance = io("http://localhost:5000", {
                query: {
                    userId: authUser._id,
                },
                transports: ["websocket", "polling"],
            });

            setSocket(socketInstance);

            // Listen for online users updates
            socketInstance.on("getOnlineUsers", (users) => {
                setOnlineUsers(users);
                console.log("👥 Online users:", users);
            });

            // Cleanup on unmount
            return () => {
                socketInstance.close();
            };
        } else {
            // Close socket if user logs out
            if (socket) {
                socket.close();
                setSocket(null);
            }
        }
    }, [authUser]);

    return (
        <SocketContext.Provider value={{ socket, onlineUsers }}>
            {children}
        </SocketContext.Provider>
    );
};
