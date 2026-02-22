import { useState } from "react";
import useConversation from "../../conversations/store/useConversation";
import toast from "react-hot-toast";
import * as messagesApi from "../api/messagesApi";

const useDeleteMessage = () => {
    const [loading, setLoading] = useState(false);
    const { deleteMessageFromStore } = useConversation();

    const deleteMessage = async (messageId) => {
        setLoading(true);
        try {
            const response = await messagesApi.deleteMessage(messageId);
            if (response.success) {
                // Update local state across all components
                deleteMessageFromStore(messageId);
                toast.success("Message deleted");
            }
        } catch (error) {
            toast.error(error.message || "Failed to delete message");
        } finally {
            setLoading(false);
        }
    };

    return { deleteMessage, loading };
};

export default useDeleteMessage;
