import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  allContacts: [],
  chats: [],
  messages: [],
  activeTab: "chats",
  selectedUser: null,
  isUsersLoading: false,
  isMessageLoading: false,
  isSoundEnabled: JSON.parse(localStorage.getItem("isSoundEnabled")) === true,

  toggleSound: () => {
    const newValue = !get().isSoundEnabled;
    localStorage.setItem("isSoundEnabled", newValue);
    set({ isSoundEnabled: newValue });
  },

  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedUser: (selectedUser) => set({ selectedUser }),

  getAllContacts: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/contacts");
      set({ allContacts: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },
  getMyChatPartners: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/chats");
      set({ chats: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessagesByUserId: async (userId) =>{
    set({isMessageLoading: true});
    try{
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({messages: res.data})
    }
    catch(error){
      toast.error(error.response.data.message || "Something went wrong");
    }
    finally{
      set({isMessageLoading: false})
    }
  },
  
  sendMessage: async (messageData) =>{
    
    const {selectedUser, messages} = get()

    try{
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      set({messages: messages.concat(res.data)})
    }
    catch(error){
      toast.error(error.response.data.message);
    }
  }

}));
