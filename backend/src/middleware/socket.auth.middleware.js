import jwt from "jsonwebtoken";
import User from "../models/User.js";
import {ENV} from "../lib/env.js";

export const socketAuthMiddleware = async (socket, next) =>{
	try{
		//extract token from http-only cookies
		const token = socket.handshake.headers.cookie
				?.split("; ")
				?.find((row) => row.startsWith("jwt"))
				?.split("=")[1];
		if(!token){
			console.log("Socket connections rejected: No token provided");
			return next(new Error("Unauthorized - No token provided")) 
		}

		//verify token
		const decoded = jwt.verify(token, ENV.JWT_SECRET);
		if(!decoded){
			console.log("Socket connections rejected: Invalid token");
			return next(new Error("Unauthorized - Invalid token"));
		}
		//find user fromdb
		const user = await User.findById(decoded.userId).select("-password");
		if(!user){
			console.log("Socket connections rejected: User not found");
			return next(new Error("User not found"));
		}
	
		socket.user = user;
		socket.userId = user._id.toString()
		
		console.log(`Socket authenticated for this user: ${user.fullname} (${user._id})`);
		next()

	}
	catch(error){
		console.log("Error in socket authentication", error.message);
		next(new Error("Unauthorized - Authentication failed"));
	}
};
