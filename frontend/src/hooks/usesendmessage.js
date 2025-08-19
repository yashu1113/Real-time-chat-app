import { useState } from "react";
import useConversation from "../zustand/useConverstion";
import toast from "react-hot-toast";

const useSendMessage = () => {
  const [loading, setLoading] = useState(false);
  const { messages, setMessages, selectedConversation } = useConversation();

  const sendMessage = async (message) => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/messages/send/${selectedConversation._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message }),
        }
      );
      const data = await res.json();
      if (data.error) throw new Error(data.error);

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
