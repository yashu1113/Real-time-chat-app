import { useEffect } from "react";
import { useAuthContext } from "../../../shared/context/AuthContext";
import { useSocketContext } from "../../../shared/context/SocketContext";
import useConversation from "../store/useConversation";
import * as conversationsApi from "../api/conversationsApi";

/**
 * Hook to listen for real-time conversation updates (sidebar)
 * Updates the global conversations list when new messages arrive
 */
const useListenConversations = () => {
  const { authUser } = useAuthContext();
  const { socket } = useSocketContext();
  const { upsertConversation } = useConversation();

  useEffect(() => {
    if (!socket || !authUser) return;

    const handleNewMessage = async (data) => {
      const newMessage = data.message || data;
      const unreadCounts = data.unreadCounts; 
      const isFromMe = newMessage.sender._id === authUser._id;
      
      // key fix: get fresh state directly from store to avoid stale closure
      const selectedConversation = useConversation.getState().selectedConversation;
      const isSelected = selectedConversation?._id === newMessage.chat;

      // If we are currently looking at this chat, we should mark it as read immediately
      if (isSelected) {
          try {
              conversationsApi.markAsRead(newMessage.chat);
          } catch (e) { console.error(e); }
      }
      
      // Calculate effective unread count for local display
      // If selected, force 0. Else use server data.
      // Calculate effective unread count for local display
      // If selected, force 0. Else use server data.
      let effectiveUnreadCounts = unreadCounts;
      if (isSelected && unreadCounts) {
           effectiveUnreadCounts = unreadCounts.map(u => {
               const uId = typeof u.user === 'object' ? u.user._id : u.user;
               return uId?.toString() === authUser._id?.toString() ? { ...u, count: 0 } : u;
           });
      }

      // We pass the mission critical info to upsertConversation
      // The store will handle finding the existing chat and merging
      // OR prepending a new one.
      const partialChat = {
          _id: newMessage.chat,
          lastMessage: newMessage,
          updatedAt: newMessage.createdAt,
          unreadCounts: effectiveUnreadCounts,
      };

      upsertConversation(partialChat);

      // If it's a new chat, fetch full details
      if (!isFromMe) {
          try {
            // Check if we have the chat in our list (by ID check or just fetch to be safe)
            // Since we don't have access to 'conversations' list here (to avoid stale state),
            // and we want to ensure we have participant info for the Avatar/Name,
            // we should fetch if we suspect it's missing data.
            // For now, let's just fetch. It's one extra call per message from a NEW person (or if we blindly fetch).
            // Optimization: We could check if 'conversations' has it, but we removed it from dependency.
            // Let's rely on the API. createOrGetChat is idempotent-ish (gets existing).
            
            // To avoid fetching for EVERY message, we could try to look it up in the store? 
            // no, we removed it.
            // Let's just fetch. It ensures data consistency.
            const res = await conversationsApi.createOrGetChat(newMessage.sender._id);
            if (res.success && res.chat) {
              upsertConversation({
                  ...res.chat,
                  lastMessage: newMessage, // Keep the latest message reference
                  updatedAt: newMessage.createdAt,
                  unreadCounts: unreadCounts || res.chat.unreadCounts
              });
            }
          } catch (error) {
            console.error("Error updating conversation list on new message:", error);
          }
      }
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, authUser, upsertConversation]);
};

export default useListenConversations;
