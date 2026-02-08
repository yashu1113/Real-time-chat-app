import { useEffect, useState } from 'react';
import { getAllUsers } from '../../../shared/api/usersApi';

const useGetAllUsers = (searchQuery = '') => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);

  // Reset pagination when search query changes
  useEffect(() => {
    setUsers([]);
    setPage(1);
    setHasMore(true);
  }, [searchQuery]);

  useEffect(() => {
    const fetchUsers = async () => {
      // Don't fetch if we're already loading or if there are no more users
      if (loading || (!hasMore && page !== 1)) return;
      
      setLoading(true);
      setError(null);
      try {
        const data = await getAllUsers({ search: searchQuery, page, limit: 20 });
        
        if (data.users) {
          setUsers(prev => page === 1 ? data.users : [...prev, ...data.users]);
          setHasMore(data.page < data.totalPages);
        }
      } catch (err) {
        console.error('❌ Error fetching users:', err);
        setError(err.message || 'Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [searchQuery, page]);

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  return { loading, users, error, hasMore, loadMore };
};

export default useGetAllUsers;
