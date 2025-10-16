import {create} from "zustand"
import {axiosInstance} from "../lib/axios.js";
import toast from "react-hot-toast";

import {io} from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development"? "http://localhost:8080" : "/";

export const useAuthStore = create((set, get) => ({

  authUser: null,
  isCheckingAuth: true,
  isSignUp: false,
  isLoggingIn: false,
  socket: null,
  onlineUsers: [],

  checkAuth: async () =>{
    try{
      const res = await  axiosInstance.get("/auth/check");
      set({authUser: res.data});
      get().connectSocket();
    }
    catch(error){
      console.log("Error in authCheck", error);
      set({authUser: null});
    }
    finally{
      set({isCheckingAuth: false});
    }
  },

  login: async (data) =>{
    
    set({isLoggingIn: true});

    try{
      const res = await axiosInstance.post("/auth/login", data);
      set({authUser: res.data});
  
      toast.success("Logged in successfully");
      get().connectSocket();
    }
    catch(error){
      toast.error(error.response.data.message);
    }
    finally{
      set({isLoggingIn: false});
    }

  },
     
  signup: async (data) =>{
    set({isSignUp: true});
    try{
      const res = await axiosInstance.post("/auth/signup", data);
      set({authUser: res.data}); 

      toast.success("Account created successfully!");
      get().connectSocket();
    }
    catch(error){
      toast.error(error.response.data.message);
    }
    finally{
      set({isSignUp: false});
    }
  },

  logout: async () =>{
    try{
      await axiosInstance.post("/auth/logout");
      set({authUser: null});
      toast.success("Logged out success");
      get().disconnectSocket();
    }
    catch(error){
      toast.error("Logout error", error);
    }
  },

  updateProfile: async (data) =>{
    try{
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({authUser: res.data})
      toast.success("Profile updated successfully");
    }
    catch(error){
      toast.error(error.response.data.message);
    }
  },

  connectSocket: () =>{
    const {authUser} = get();

    if(!authUser || get().socket?.connected) return;
    
    const socket = io(BASE_URL, {withCredentials: true}); //this ensures that cookies are sent with connection
    
    socket.connect();
    
    set({socket});

    //listen for online users event
    
    socket.on("getOnlineUsers", (userId) =>{
      set({onlineUsers: userId});
    })

  },

  disconnectSocket: () =>{
    if (get().socket?.connected){
      get().socket.disconnect()
    } 
  },



})) 
