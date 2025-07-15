import { createContext, useEffect, useState } from "react";
import axios from 'axios';
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [authUser, setAuthUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);

  // Check if the user is authenticated and set the user data and connect the socket
  const checkAuth = async () => {
  try {
    const storedToken = localStorage.getItem("token");
console.log("Stored Token:", storedToken); // Debug log

const { data } = await axios.get("/api/auth/check", {
  headers: {
    token: storedToken,  // Pass token manually
  },
});

    if (data.success) {
      const fullUser = {
        ...data.user,
        token: storedToken,
      };
      setAuthUser(fullUser);
      connectSocket(fullUser);
    } else {
      toast.error("Authentication failed");
    }
  } catch (error) {
    toast.error(error.response?.data?.message || error.message);
  }
};


  // Login function to handle user authentication and socket connection
  const login = async (state, credentials) => {
    try {
      const { data } = await axios.post(`/api/auth/${state}`, credentials);
      if (data.success) {
        const fullUser = {
          ...data.userData,
          token: data.token,
        };
        setAuthUser(fullUser);
        connectSocket(fullUser);
        axios.defaults.headers.common["token"] = data.token;
        setToken(data.token);
        localStorage.setItem("token", data.token);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // Logout function to handle user logout and socket disconnection
  const logout = async () => {
    localStorage.removeItem("token");
    setToken(null);
    setAuthUser(null);
    setOnlineUsers([]);
    axios.defaults.headers.common["token"] = null;
    toast.success("Logged out successfully");
    socket?.disconnect();
  };

  // Update profile function to handle user profile updates
  const updateProfile = async (body) => {
  try {
    const tokenToSend = authUser?.token || localStorage.getItem("token");
    const { data } = await axios.put("/api/auth/update-profile", body, {
      headers: {
        token: tokenToSend,
      },
    });

    if (data.success) {
      setAuthUser((prev) => ({ ...prev, ...data.user }));
      toast.success("Profile updated successfully");
    }
  } catch (error) {
    toast.error(error.response?.data?.message || error.message);
  }
};

  // Connect socket function to handle socket connection and online users updates
  const connectSocket = (userData) => {
  if (!userData || socket?.connected) return;

  const newSocket = io(backendUrl, {
    query: {
      userId: userData._id,
    },
  });

  setSocket(newSocket);

  newSocket.on("getOnlineUsers", (userIds) => {
    setOnlineUsers(userIds);
  });
};


  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      axios.defaults.headers.common["token"] = token;
    checkAuth();
    }
  }, [token]);

  const value = {
    axios,
    authUser,
    onlineUsers,
    socket,
    login,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
