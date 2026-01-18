import { useEffect } from "react";
import { useSocketContext } from "../../../shared/context/SocketContext";
import useConversation from "../../conversations/store/useConversation";

/**
 * Hook to listen for real-time messages via socket
 * Automatically updates conversation messages when new messages arrive
 */
const useSocketMessages = () => {
  const { socket } = useSocketContext();
  const { messages, setMessages, selectedConversation } = useConversation();

  useEffect(() => {
    if (!socket) return;

    // Listen for new messages
    socket.on("newMessage", (newMessage) => {
      console.log("📨 Received real-time message:", newMessage);

      // Only update if the message is for the current conversation
      if (
        selectedConversation &&
        (newMessage.senderId === selectedConversation._id ||
          newMessage.receiverId === selectedConversation._id)
      ) {
        setMessages([...messages, newMessage]);
      }
    });

    // Cleanup listener on unmount
    return () => {
      socket.off("newMessage");
    };
  }, [socket, messages, setMessages, selectedConversation]);
};

export default useSocketMessages;
