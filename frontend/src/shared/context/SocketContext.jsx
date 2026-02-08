import { createContext, useState, useEffect, useContext } from "react";
import { useAuthContext } from "./AuthContext";
import { getStoredToken } from "../utils/storage";
import useConversation from "../../features/conversations/store/useConversation";
import io from "socket.io-client";

export const SocketContext = createContext();

export const useSocketContext = () => {
    return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const { authUser } = useAuthContext();
    const { updateParticipantStatus } = useConversation();

    useEffect(() => {
        if (authUser) {
            const token = getStoredToken();
            const socketInstance = io("http://127.0.0.1:5000", {
                auth: {
                    token,
                },
                query: {
                    userId: authUser._id,
                },
                transports: ["websocket", "polling"],
                reconnection: true,
                reconnectionAttempts: 5,
            });

            setSocket(socketInstance);

            // Listen for online users updates
            socketInstance.on("getOnlineUsers", (users) => {
                setOnlineUsers(users);
            });

            // Listen for specific user status updates (for accurate last seen)
            socketInstance.on("userStatusUpdate", (data) => {
                const { userId, isOnline, lastSeen } = data;
                updateParticipantStatus(userId, isOnline, lastSeen);
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
