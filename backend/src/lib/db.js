import mongoose from 'mongoose';

export const ConnectDB = async()=>{
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`Connected to mongodb ${conn.connection.host}`);
    }catch(error){
        console.log("mongodb connection error",error);

    }
};