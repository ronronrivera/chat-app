import jwt from "jsonwebtoken";
import User from "../models/User.js"
import { ENV } from "../lib/env.js";

export const protectRoute = async (req, res, next) =>{
	
	try{
		const token = req.cookies.jwt;
		if(!token) return res.status(401).json({message: "Unauthorized - No token provided"});
		
		const decode = jwt.verify(token, ENV.JWT_SECRET);
		if(!decode) return res.status(401).json({message: "Unauthorized - Invalid token"});

		const user = await User.findById(decode.userId).select("-password");

		if(!user) return res.status(401).json({message: "User not found!"});

		req.user = user;

		next();
	}
	catch(error){
		console.error("Error in protectRoute middleware");
		res.status(500).json({message: "Internal server error"});
	}

}
