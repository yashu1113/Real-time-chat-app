import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../../../shared/context/AuthContext";
import { setStoredUser, setStoredToken } from "../../../shared/utils/storage";
import * as authApi from "../api/authApi";

const useSignup = () => {
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthContext();

  const signup = async ({ name, email, password, confirmPassword }) => {
    const success = handleInputErrors({ name, email, password, confirmPassword });
    if (!success) return;

    setLoading(true);
    try {
      const data = await authApi.registerUser({
        name,
        email,
        password,
      });

      // Backend returns: { success: true, message: "...", user: {...} }
      // Note: Signup doesn't return token, user needs to login
      if (data.success) {
        toast.success(data.message || "Signup successful! Please login.");
      }
      
      return data;
    } catch (error) {
      toast.error(error.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return { loading, signup };
};

export default useSignup;

function handleInputErrors({ name, email, password, confirmPassword }) {
  if (!name || !email || !password || !confirmPassword) {
    toast.error("Please fill in all fields");
    return false;
  }

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    toast.error("Please enter a valid email address");
    return false;
  }

  if (password !== confirmPassword) {
    toast.error("Passwords don't match");
    return false;
  }

  if (password.length < 6) {
    toast.error("Password must be at least 6 characters");
    return false;
  }

  return true;
}
