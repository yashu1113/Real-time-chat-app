import { useEffect, useState } from "react";
import * as conversationsApi from "../api/conversationsApi";

const useGetConversations = () => {
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    const getConversations = async () => {
      setLoading(true);
      try {
        const data = await conversationsApi.getConversations();
        setConversations(data);
      } catch (error) {
        console.error("Error fetching conversations:", error);
      } finally {
        setLoading(false);
      }
    };

    getConversations();
  }, []);

  return { loading, conversations };
};

export default useGetConversations;
