import { useEffect, useState } from "react";
import * as conversationsApi from "../api/conversationsApi";
import useConversation from "../store/useConversation";

const useGetConversations = () => {
  const [loading, setLoading] = useState(false);
  const { conversations, setConversations } = useConversation();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const getConversations = async () => {
      if (loading || (!hasMore && page !== 1)) return;

      setLoading(true);
      try {
        const data = await conversationsApi.getConversations({ page, limit: 20 });
        
        if (data.chats) {
          if (page === 1) {
            setConversations(data.chats);
          } else {
            setConversations(prev => [...prev, ...data.chats]);
          }
          setHasMore(data.page < data.totalPages);
        }
      } catch (error) {
        console.error("Error fetching conversations:", error);
      } finally {
        setLoading(false);
      }
    };

    getConversations();
  }, [page]);

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  return { loading, conversations, hasMore, loadMore };
};

export default useGetConversations;
