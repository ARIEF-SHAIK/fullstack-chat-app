import express from 'express';
import { ConnectDB } from './lib/db.js';
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { app, server, io } from "./lib/socket.js";

import authRoutes from './routes/auth.route.js';
import messageRoutes from "./routes/message.route.js";

import path from "path";

dotenv.config();

const PORT = process.env.PORT;
const __dirname = path.resolve();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: 'https://vercel.com/ariefs-projects-9b375403/fullstack-chat-app-yo4x',
  credentials: true,
}));

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "../frontend/dist");

  app.use(express.static(frontendPath));
  app.get("/*", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

server.listen(PORT, () => {
  console.log("Server is running on:" + PORT);
  ConnectDB();
});
