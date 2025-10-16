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
    
    const {authUser} = useAuthStore.getState()
    
    const tempId = `tem-${Date.now()}`

    const optimisticMessage = {
      _id: tempId,
      senderId: authUser._id,
      receiverId: selectedUser._id,
      text: messageData.text,
      image: messageData.image,
      createdAt: new Date().toISOString(),
      isOptimistic: true,
    };
    //immediately update the UI by adding the message
    set({messages: [...messages, optimisticMessage]});

    try{
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      set({messages: messages.concat(res.data)})
    }
    catch(error){
      toast.error(error?.response?.data?.message || "Something went wrong");
      //remove optimistic messsage on failure
      set({messages: messages})
    }
  },
  
  subscribeToMessages: () =>{
    const {selectedUser, isSoundEnabled} = get();
    if(!selectedUser) return;
    
    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      const currentMessages = get().messages;
      set({messages: [...currentMessages, newMessage]});
      
      if(isSoundEnabled){
        const notificationSound = new Audio("/sounds/frontend_public_sounds_notification.mp3")
        notificationSound.currentTime = 0; // reset to start
        notificationSound.play().catch((e) => console.log("Audio play failed", e));
      }

    });
  },
  
  unsubscribeFromMessages:() =>{
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  }

}));
