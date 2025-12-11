import { Server } from "socket.io";
import http from "http"
import express from 'express'

const app = express()

const server = http.createServer(app)

const io = new Server(server,{
    cors:{
        origin:["https://fullstack-chat-app-2ird.vercel.app"],
        credentials: true
    }
});
//http://localhost:5173
export function getReceiverSocketId(userId){
    return userSocketMap[userId]
}

// Store online users
const userSocketMap = {}; // userId -> socketId

io.on('connection',(socket)=>{
    console.log("user connected",socket.id);
    
    const userId = socket.handshake.query.userId;
    console.log("userId from query:", userId);
    if (userId) userSocketMap[userId] = socket.id;
    console.log("Current userSocketMap:", userSocketMap);

    // Broadcast online users
    const onlineUserIds = Object.keys(userSocketMap);
    console.log("Broadcasting online users:", onlineUserIds);
    io.emit("getOnlineUsers", onlineUserIds);

    socket.on("disconnect",()=>{
        console.log("user disconnected",socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    })
})

export { app, server, io }
