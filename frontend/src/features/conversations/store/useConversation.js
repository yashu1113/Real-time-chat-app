import { create } from "zustand";

const useConversation = create((set) => ({
  selectedConversation: null,
  setSelectedConversation: (conversation) =>
    set({ selectedConversation: conversation }),
  messages: [],
  setMessages: (messages) => {
    if (typeof messages === "function") {
      set((state) => ({ messages: messages(state.messages) }));
    } else {
      set({ messages });
    }
  },
  conversations: [],
  setConversations: (conversations) => {
    if (typeof conversations === "function") {
      set((state) => ({ conversations: conversations(state.conversations) }));
    } else {
      set({ conversations });
    }
  },
  upsertConversation: (conversation) => {
    set((state) => {
      const existingIndex = state.conversations.findIndex(
        (c) => c._id === conversation._id
      );
      
      let updatedConversations = [...state.conversations];
      let newConversation = conversation;
      
      if (existingIndex !== -1) {
        // Merge existing and new (to keep fields that might be missing in upsert)
        newConversation = { ...updatedConversations[existingIndex], ...conversation };
        updatedConversations.splice(existingIndex, 1);
      }
      
      return { 
        conversations: [newConversation, ...updatedConversations] 
      };
    });
  },

  markChatAsRead: (chatId, userId) => {
    set((state) => {
        const updatedConversations = state.conversations.map((c) => {
            if (c._id === chatId) {
                const updatedUnreadCounts = c.unreadCounts?.map((entry) => {
                    const entryUserId = typeof entry.user === 'object' ? entry.user._id : entry.user;
                    // Ensure we compare strings
                    return entryUserId?.toString() === userId?.toString() ? { ...entry, count: 0 } : entry;
                });
                return { ...c, unreadCounts: updatedUnreadCounts };
            }
            return c;
        });

        // Also update selectedConversation if it matches
        let updatedSelected = state.selectedConversation;
        if (state.selectedConversation?._id === chatId) {
             const updatedUnreadCounts = state.selectedConversation.unreadCounts?.map((entry) => {
                const entryUserId = typeof entry.user === 'object' ? entry.user._id : entry.user;
                return entryUserId?.toString() === userId?.toString() ? { ...entry, count: 0 } : entry;
             });
            updatedSelected = { ...state.selectedConversation, unreadCounts: updatedUnreadCounts };
        }

        return { 
            conversations: updatedConversations,
            selectedConversation: updatedSelected
        };
    });
  },
  updateParticipantStatus: (userId, isOnline, lastSeen) => {
    set((state) => {
      // Update in conversations list
      const updatedConversations = state.conversations.map((c) => {
        const updatedParticipants = c.participants.map((p) =>
          p._id === userId ? { ...p, isOnline, lastSeen } : p
        );
        return { ...c, participants: updatedParticipants };
      });

      if (!state.selectedConversation) return { conversations: updatedConversations };

      const isDirectUser = state.selectedConversation._id === userId;
      const participants = state.selectedConversation.participants || [];
      const updatedParticipants = participants.map((p) =>
        p._id === userId ? { ...p, isOnline, lastSeen } : p
      );

      // Check if any participant was updated or if it's the direct user (for user list views)
      const participantUpdated = participants.some((p) => p._id === userId);

      if (isDirectUser || participantUpdated) {
        return {
          conversations: updatedConversations,
          selectedConversation: {
            ...state.selectedConversation,
            lastSeen: isDirectUser ? lastSeen : state.selectedConversation.lastSeen,
            participants: updatedParticipants,
          },
        };
      }
      return { conversations: updatedConversations };
    });
  },
}));

export default useConversation;
