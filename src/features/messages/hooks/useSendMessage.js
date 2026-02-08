import { useState } from "react";
import useConversation from "../../conversations/store/useConversation";
import toast from "react-hot-toast";
import * as messagesApi from "../api/messagesApi";

const useSendMessage = () => {
  const [loading, setLoading] = useState(false);
  const { messages, setMessages, selectedConversation, upsertConversation } = useConversation();

  const sendMessage = async (content) => {
    if (!content.trim()) return;
    setLoading(true);
    try {
      const response = await messagesApi.sendMessage(selectedConversation._id, content);
      
      // Update message list
      setMessages([...messages, response.data]);
      
      // Update sidebar list immediately
      upsertConversation({
          ...selectedConversation,
          lastMessage: response.data,
          updatedAt: response.data.createdAt
      });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { sendMessage, loading };
};

export default useSendMessage;
