import { useState } from "react";
import useConversation from "../../conversations/store/useConversation";
import toast from "react-hot-toast";
import * as messagesApi from "../api/messagesApi";

const useSendMessage = () => {
  const [loading, setLoading] = useState(false);
  const { messages, setMessages, selectedConversation } = useConversation();

  const sendMessage = async (message) => {
    setLoading(true);
    try {
      const data = await messagesApi.sendMessage(selectedConversation._id, message);

      console.log("📤 Message Sent:");
      console.log("   Sender ID:", data.senderId);
      console.log("   Receiver ID:", data.receiverId);
      console.log("   Message:", data.message);
      console.log("   Message ID:", data._id);
      console.log("   Timestamp:", new Date(data.createdAt).toLocaleString());

      setMessages([...messages, data]);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { sendMessage, loading };
};

export default useSendMessage;
