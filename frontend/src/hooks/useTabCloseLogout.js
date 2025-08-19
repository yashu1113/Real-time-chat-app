import { useEffect } from "react";

const useTabCloseLogout = (setAuthUser) => {
  useEffect(() => {
    const handleTabClose = (event) => {
      // Check if this is a refresh vs actual tab close
      // PerformanceNavigation.type: 0 = navigate, 1 = reload, 2 = back_forward
      const isRefresh = performance.getEntriesByType('navigation')[0]?.type === 'reload';
      
      if (!isRefresh) {
        // Only logout on actual tab/window close, not refresh
        localStorage.removeItem("chat-user");
        localStorage.removeItem("token");
        sessionStorage.clear();
        setAuthUser(null);
      }
    };

    // Add event listener for tab close
    window.addEventListener('beforeunload', handleTabClose);

    // Cleanup function
    return () => {
      window.removeEventListener('beforeunload', handleTabClose);
    };
  }, [setAuthUser]);
};

export default useTabCloseLogout;
