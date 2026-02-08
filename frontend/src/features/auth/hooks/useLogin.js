import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../../../shared/context/AuthContext";
import { setStoredUser, setStoredToken } from "../../../shared/utils/storage";
import * as authApi from "../api/authApi";

const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthContext();

  const login = async (email, password) => {
    const success = handleInputErrors(email, password);
    if (!success) return;
    
    setLoading(true);
    try {
      const data = await authApi.loginUser(email, password);

      // Backend returns: { success: true, token: "...", user: { _id, name, email } }
      if (data.success && data.token && data.user) {
        setStoredToken(data.token);
        setStoredUser(data.user);
        setAuthUser(data.user);
        toast.success("Login successful!");
      }
    } catch (error) {
      toast.error(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return { loading, login };
};

export default useLogin;

function handleInputErrors(email, password) {
  if (!email || !password) {
    toast.error("Please fill in all fields");
    return false;
  }

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    toast.error("Please enter a valid email address");
    return false;
  }

  return true;
}
