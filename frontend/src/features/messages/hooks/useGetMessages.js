import { useEffect, useState } from "react";
import useConversation from "../../conversations/store/useConversation";
import * as messagesApi from "../api/messagesApi";

const useGetMessages = () => {
  const [loading, setLoading] = useState(false);
  const { messages, setMessages, selectedConversation } = useConversation();

  useEffect(() => {
    const getMessages = async () => {
      setLoading(true);
      try {
        const data = await messagesApi.getMessages(selectedConversation._id);

        console.log(
          `📥 Loaded ${data.length} messages for conversation:`,
          selectedConversation._id
        );
        data.forEach((msg, index) => {
          console.log(`   Message ${index + 1}:`);
          console.log("      Sender ID:", msg.senderId);
          console.log("      Receiver ID:", msg.receiverId);
          console.log("      Message:", msg.message);
          console.log("      Message ID:", msg._id);
          console.log(
            "      Timestamp:",
            new Date(msg.createdAt).toLocaleString()
          );
        });

        setMessages(data);
      } catch (error) {
        console.error("Error fetching messages:", error);
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };

    if (selectedConversation?._id) getMessages();
  }, [selectedConversation?._id, setMessages]);

  return { messages, loading };
};

export default useGetMessages;
