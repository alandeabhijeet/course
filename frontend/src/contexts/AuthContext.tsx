import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);
const VITE_verify = import.meta.env.VITE_verify;
const VITE_login = import.meta.env.VITE_login;
const VITE_signup = import.meta.env.VITE_signup;
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("authToken"));
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get(VITE_verify, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.userId) {
          setUser({ userId: response.data.userId });
        } else {
          localStorage.removeItem("authToken");
          setUser(null);
        }
      } catch (error) {
        console.error("Token verification failed:", error.response?.data || error.message);
        localStorage.removeItem("authToken");
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  const login = async (username, password) => {
    try {
      setIsLoading(true);
      const response = await axios.post(VITE_login, { username, password });

      if (response.data.token) {
        localStorage.setItem("authToken", response.data.token);
        setToken(response.data.token);
        setUser({ username });
        navigate("/courses");
      }
    } catch (error) {
      console.error("Login failed:", error.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (username, password) => {
    try {
      setIsLoading(true);
      const response = await axios.post(VITE_signup, { username, password });

      if (response.data.token) {
        localStorage.setItem("authToken", response.data.token);
        setToken(response.data.token);
        setUser({ username });
        navigate("/courses");
      }
    } catch (error) {
      console.error("Signup failed:", error.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
    setToken(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
