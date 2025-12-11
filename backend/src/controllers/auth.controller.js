import { genrateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from 'bcryptjs';
import cloudinary from "../lib/cloudinary.js";
import upload from '../middleware/upload.js';


//sign up
export const signup = async (req, res) => {
    const {fullName,email,password} = req.body;
    try{

        if(!fullName || !email || !password){
            return res.status(400).json({message: "All fields are required"});
        }
        if(password.length < 6){
            return res.status(401).json({message: "Password must be at least 6 characters long",});
        }
        const user =await User.findOne({email});
        if(user){return res.status(409).json({message: "User already exists"})};
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);
        const newUser = new User({
            fullName,
            email,
            password:hashedPassword
        })
        if(newUser){
            //Genrating token
            genrateToken(newUser._id,res);
            await newUser .save();
            res.status(200).json({
                _id:newUser._id,
                fullName:newUser.fullName,
                email:newUser.email,
                profilepic:newUser.profilepic,
            });
        }else{
            res.status(404).json({message:"Invalid user data"});
        }
    }catch(error){
        console.log('error in signup controller',error.message);
        return res.status(500).json({message:'internal server error'});
    }
};

//login 
export const login = async (req, res) => {
    const {email,password} = req.body;
    try{
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({message:"Invaild Creditinals"});
        }

        const isPasswordCorrect   = await bcrypt.compare(password,user.password);
        if(!isPasswordCorrect){
            return res.status(403).json({message:"Invaild Creditionals"});
        }
        genrateToken(user._id,res);
        res.status(200).json({
            _id:user._id,
            fullName:user.fullName,
            email:user.email,
            profilepic:user.profilepic,
        })

    }catch(error){
        console.log('error in login controller',error.message);
        res.status(500).json({message:'Internal Server Error'});

    }
};

//logout
export const logout = (req, res) => {
    try{
        res.cookie('jwt','',{maxAge:0});
        res.status(200).json({message:"Logout Successfully"});
    }catch(error){
        console.log("Error in logout");
        res.status(500).json({message:'Internal Server Error'});
    }
};

export const updateProfile = async (req, res) => {
  try {
    const userid = req.user._id;

    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    // Upload image file to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(req.file.path, {
      folder: "profile_pics",
    });

    const updatedUser = await User.findByIdAndUpdate(
      userid,
      { profilepic: uploadResponse.secure_url },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("Error updating profile:", error.message);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

//check auth
export const checkAuth = (req,res)=>{
    try{
        res.status(200).json(req.user);

    }catch{
        console.log("Error in checking Auth");
        res.status(500).json({message:'Internal Server Error'})
    }

}