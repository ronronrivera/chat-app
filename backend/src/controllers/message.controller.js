import cloudinary from "../lib/cloudinary.js";
import Message from "../models/Message.js"
import User from "../models/User.js";

export const getAllContacts = async (req,res) =>{
	try{
		const loggedInUserId = req.user._id;
		const filteredUsers = await User.find({_id: {$ne: loggedInUserId}}).select("-password");

		res.status(200).json(filteredUsers);

	}
	catch(error){
		console.error("Error in getAllContacts", error);
		res.status(500).json({message: "Server error"});
	}
}

export const getMessagesByUserId = async (req, res) =>{
	try{
		const myId = req.user._id;
		const {id: userToChatId} = req.params;

		const message = await Message.find({
			$or: [
				{senderId: myId, receiverId: userToChatId},
				{senderId: userToChatId, receiverId: myId}
			]
		})

		res.status(200).json(message);
	}
	catch(error){
		console.error("Error in getMessagesByUserId", error);
		res.status(500).json({error: "Internal server error"});
	}
}

export const sendMessage = async (req, res) =>{
	

	try{
		const {text, image} = req.body;
		const {id: receiverId} = req.params;
		const senderId = req.user._id;

    // Validate message content
    if (!text && !image) {
      return res.status(400).json({message: "Message must contain text or image"});
    }

    // Validate receiver exists
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({message: "Receiver not found"});
    }

		let imageUrl;
/*
  	before code rabbit
		
		if(image){
			//upload base64 image to cloudinary
			const uploadResponse = await cloudinary.uploader.upload(image);
			imageUrl = uploadResponse.secure_url;
		}
*/

		if(image){
      try {
        //upload base64 image to cloudinary
        const uploadResponse = await cloudinary.uploader.upload(image);
        imageUrl = uploadResponse.secure_url;
      } catch (uploadError) {
        console.error("Cloudinary upload failed:", uploadError);
        return res.status(500).json({message: "Image upload failed"});
      }
		}

		const newMessage = new Message({
			senderId,
			receiverId,
			text,
			image: imageUrl,
		});

		await newMessage.save();

		res.status(201).json({newMessage});

		//todo: send message in real-time if user is online - socket.io

	}
	catch(error){
		console.error("Error in sendMessage controller: ", error);
		res.status(500).json({message: "Internal server error"})
	}
}

export const getChatPartners = async (req, res) =>{
	try{
		const loggedInUserId = req.user._id;
		
		//find all the messages where the logged-in user is either sender or receiver
		const messages = await Message.find({
			$or: [{senderId: loggedInUserId}, {receiverId: loggedInUserId}]
		});
		
		const chatPartnersIds = [...new Set(messages.map(msg => 
			msg.senderId.toString() === loggedInUserId.toString()? 
				msg.receiverId.toString(): 
				msg.senderId.toString()))];

		const chatPartners = await User.find({_id: {$in:chatPartnersIds}}).select("-password");

		res.status(200).json(chatPartners);
	}
	catch(error){
		console.error("Error in getChatPartners", error);
		res.status(500).json({message: "Internal server error"});
	}
}	
