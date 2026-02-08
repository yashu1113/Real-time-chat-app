import { useState } from "react";
import { useAuthContext } from "../../../shared/context/AuthContext";
import { removeStoredUser, removeStoredToken } from "../../../shared/utils/storage";
import toast from "react-hot-toast";
import * as authApi from "../api/authApi";

const useLogout = () => {
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthContext();

  const logout = async () => {
    setLoading(true);
    try {
      const data = await authApi.logoutUser();
      
      // Backend returns: { success: true, message: "Logged out successfully" }
      removeStoredToken();
      removeStoredUser();
      setAuthUser(null);
      
      if (data.success) {
        toast.success(data.message || "Logged out successfully");
      }
    } catch (error) {
      toast.error(error.message || "Logout failed");
    } finally {
      setLoading(false);
    }
  };

  return { loading, logout };
};

export default useLogout;
