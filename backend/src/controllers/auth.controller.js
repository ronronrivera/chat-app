import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import { sendWelcomeEmail } from "../emails/emailHandlers.js";
import { ENV } from "../lib/env.js";

export const Signup = async (req, res) =>{

	const {fullname, email, password} = req.body;

	try{
		if(!fullname || !email || !password){
			return res.status(400).json({message: "All fields are required"})
		}
		else if(password.length < 8){
			return res.status(400).json({message: "Password must be at least 8 characters"})
		}
		//check if email is valid with regex;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

		const user = await User.findOne({email});

		if(user) return res.status(400).json({message: "Email already exist"});
	
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		const newUser = new User({
			fullname,
			password: hashedPassword,
			email,
		})
	
		if(newUser){
		// before code rabbit
		//	generateToken(newUser._id, res);
		//	await newUser.save();

		// after code rabbit
			await newUser.save();
			generateToken(newUser._id, res);

			res.status(201).json({
				_id: newUser._id,
				fullname: newUser.fullname,
				email: newUser.email,
				profilePic: newUser.profilePic
			})

			//send welcome email
			try{
				await sendWelcomeEmail(newUser.email, newUser.fullname, ENV.CLIENT_URL);
			}
			catch(error){
				console.error("Failed to send welcome email", error);
			}

		}
		else{
			return res.status(400).json({message: "Invalid user data"});
		}

	}
	catch(error){
		console.log("Error in signup controller: ", error);
		res.status(500).json({message: "Internal server error"})
	}
}

export const Login = async (req, res) =>{
	const {email, password} = req.body;
	
	try{
		const user = await User.findOne({email});

		if(!user) return res.status(400).json({message: "Invalid Credentials"}); //never tell the client to which one is incorrect: password or email
		
		const isPasswordCorrect = await bcrypt.compare(password, user.password);
		
		if(!isPasswordCorrect) return res.status(400).json({message: "Invalid Credentials"});
		
		generateToken(user._id, res);

		res.status(200).json({
			_id: user._id,
			fullname: user.fullname,
			email: user.email,
			profilePic: user.profilePic
		});

	}
	catch(error){
		console.error("Error in login controller", error);
		res.status(500).json({message: "Internal server error"});
	}

} 

export const Logout = (_, res) =>{
	res.cookie("jwt", "", {maxAge:0});
	res.status(200).json({message: "Logout successfully"});
} 
