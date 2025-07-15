import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [unseenMessages, setUnseenMessages] = useState({});

  const { socket, axios, authUser } = useContext(AuthContext); 

  // Automatically fetch users once authUser is ready (token is valid)
  useEffect(() => {
    if (authUser) {
      getUsers();
    }
  }, [authUser]);

  // Function to get all users for sidebar
  const getUsers = async () => {
    try {
      const { data } = await axios.get("/api/messages/users");
      console.log("📤 Response from /api/messages/users:", data);

      if (data.success) {
        console.log("USERS RECEIVED:", data.users);
        setUsers(data.users);
        setUnseenMessages(data.unseenMessages);
      }
    } catch (error) {
      console.error("Error in getUsers:", error);
      toast.error(error.response?.data?.message || error.message);
    }
    console.log("getUsers called");
  };

  // Function to get messages for selected user
  const getMessages = async (userId) => {
    try {
      const { data } = await axios.get(`/api/messages/${userId}`);
      if (data.success) {
        setMessages(data.messages);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Function to send message to selected user
 const sendMessage = async (messageData) => {
  if (!selectedUser || !selectedUser._id) {
    toast.error("No user selected. Cannot send message.");
    return;
  }

  try {
    const { data } = await axios.post(
      `/api/messages/send/${selectedUser._id}`,
      messageData
    );

    if (data.success) {
      setMessages((prev) => [...prev, data.newMessage]);
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    toast.error(error.message);
  }
};


  // Real-time message subscription
  const subscribeToMessages = () => {
    if (!socket) return;

    socket.on("newMessage", (newMessage) => {
      if (selectedUser && newMessage.senderId === selectedUser._id) {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        axios.put(`/api/messages/mark/${newMessage._id}`);
      } else {
        setUnseenMessages((prevUnseen) => ({
          ...prevUnseen,
          [newMessage.senderId]: prevUnseen[newMessage.senderId]
            ? prevUnseen[newMessage.senderId] + 1
            : 1,
        }));
      }
    });
  };

  const unsubscribeFromMessages = () => {
    if (socket) socket.off("newMessage");
  };

  useEffect(() => {
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [socket, selectedUser]);

  const value = {
    messages,
    users,
    selectedUser,
    getUsers,
    getMessages,
    sendMessage,
    setSelectedUser,
    unseenMessages,
    setUnseenMessages,
  };

  return (
    <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
  );
};
