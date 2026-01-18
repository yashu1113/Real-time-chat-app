import { useState } from "react";
import { useAuthContext } from "../../../shared/context/AuthContext";
import toast from "react-hot-toast";
import * as authApi from "../api/authApi";

const useLogout = () => {
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthContext();

  const logout = async () => {
    setLoading(true);
    try {
      await authApi.logoutUser();
      
      localStorage.removeItem("chat-user");
      setAuthUser(null);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, logout };
};

export default useLogout;
