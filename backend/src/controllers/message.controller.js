import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId,io } from "../lib/socket.js";


export const getUsersForSideBar = async(req,res) => {
    try{
        const loggedUserId = req.user._id;
        const filteredUsers = await User.find({_id:{$ne:loggedUserId}}).select("-password");
        res.status(200).json(filteredUsers);
    }catch(error){
        console.log("error in getting users for sidebar",error.message);
        res.status(500).json({message: error.message});
    }

};

export const getMessages = async (req,res)=>{
    try{
    const { id: userToChatId } = req.params;
     const senderId = req.user._id;

     const messages = await Message.find({
        $or:[
            {senderId:senderId,receiverId:userToChatId},
            {senderId:userToChatId,receiverId:senderId}
        ]
     })
     res.status(201).json(messages);
    }catch(error){
        console.log("error in getting messages",error.message);
        res.status(500).send(error.message);

    }
     
}

export const sendMessage = async(req,res)=>{
    try{
        const {text,image} = req.body;
        const {id:receiverId} = req.params;
        const senderId = req.user._id;
        
        // console.log("Sending message:", { text, hasImage: !!image, receiverId, senderId });

        let imageUrl;
        if(image){
            try {
                //upload image to cloudinary and get the url
                console.log("Uploading image to Cloudinary...");
                const uploadResponse = await cloudinary.uploader.upload(image);
                imageUrl = uploadResponse.secure_url;
                console.log("Image uploaded successfully:", imageUrl);
            } catch (uploadError) {
                console.log("Cloudinary upload error:", uploadError.message);
                return res.status(400).json({error: "Failed to upload image"});
            }
        }
        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image:imageUrl,
        })
        await newMessage.save();
        
        // Real-time message functionality with socket.io
        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverSocketId){
            console.log("Emitting newMessage via socket to receiver:", receiverSocketId);
            io.to(receiverSocketId).emit('newMessage', newMessage);
        } else {
            console.log("Receiver not connected:", receiverId);
        }
        res.status(201).json(newMessage);

    }catch(error){
        console.log("error in sending message",error.message);
        res.status(500).json({error:'internal server error'})

    }
};