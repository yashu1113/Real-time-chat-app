import { useEffect, useState } from "react";
import useConversation from "../../conversations/store/useConversation";
import * as messagesApi from "../api/messagesApi";

const useGetMessages = () => {
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { messages, setMessages, selectedConversation } = useConversation();

  // Reset pagination when conversation changes
  useEffect(() => {
    setPage(1);
    setHasMore(true);
  }, [selectedConversation?._id]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (loading || (!hasMore && page !== 1)) return;
      
      setLoading(true);
      try {
        const data = await messagesApi.getMessages(selectedConversation._id, { page, limit: 20 });
        
        if (data.messages) {
          // If first page, replace. If older pages, prepend.
          setMessages(prev => page === 1 ? data.messages : [...data.messages, ...prev]);
          setHasMore(data.page < data.totalPages);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
        if (page === 1) setMessages([]);
      } finally {
        setLoading(false);
      }
    };

    if (selectedConversation?._id) fetchMessages();
  }, [selectedConversation?._id, page]);

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  return { messages, loading, hasMore, loadMore };
};

export default useGetMessages;
