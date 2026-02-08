import { useEffect } from "react";
import { useSocketContext } from "../../../shared/context/SocketContext";
import useConversation from "../../conversations/store/useConversation";

/**
 * Hook to listen for real-time messages via socket
 * Automatically updates conversation messages when new messages arrive
 */
const useSocketMessages = () => {
  const { socket } = useSocketContext();
  const { setMessages, selectedConversation } = useConversation();

  useEffect(() => {
    if (!socket || !selectedConversation?._id) return;

    const chatId = selectedConversation._id;

    // Join the chat room
    socket.emit("joinChat", { chatId });

    // Listen for new messages
    const handleNewMessage = (data) => {
      const newMessage = data.message || data;
      
      // Only update if the message belongs to this chat
      if (newMessage.chat === chatId) {
        setMessages((prevMessages) => {
          // Deduplication: Don't add if message already exists
          const isDuplicate = prevMessages.some(m => m._id === newMessage._id);
          if (isDuplicate) return prevMessages;
          
          return [...prevMessages, newMessage];
        });
      }
    };

    socket.on("newMessage", handleNewMessage);

    // Cleanup listener and leave room if necessary
    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, selectedConversation?._id, setMessages]);
};

export default useSocketMessages;
