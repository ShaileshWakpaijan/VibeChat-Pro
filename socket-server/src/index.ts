import express from "express";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import { socketAuth } from "./middlewares/socketAuth.js";
import { handleConversationEvents } from "./controllers/conversation.controllers.js";
import { handleMessageEvents } from "./controllers/message.controllers.js";

dotenv.config();

const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:3000";
const PORT = process.env.PORT || 3001;

const app = express();

app.use(
  cors({
    origin: CLIENT_ORIGIN,
  }),
);
app.use(express.json());

const server = http.createServer(app);

const io = new SocketIOServer(server, {
  cors: {
    origin: CLIENT_ORIGIN,
    methods: ["GET", "POST"],
  },
});

await connectDB();

io.use(socketAuth);

io.on("connection", (socket) => {
  console.log("User connected with id", socket.id);
  console.log("Authenticated user id:", socket.data.userId);

  socket.on("join", () => {
    try {
      socket.join(`user:${socket.data.userId}`);
      console.log(`User ${socket.data.userId} joined personal room`);
    } catch (e) {
      console.error("[index] join personal room error:", e);
      socket.emit("errorMsg", "Failed to join personal room");
    }
  });

  try {
    handleConversationEvents(socket);
    handleMessageEvents(io, socket);
  } catch (e) {
    console.error("[index] controller registration error:", e);
  }

  socket.on("disconnect", () => {
    console.log("User disconnected with id", socket.id);
  });
});

server.listen(PORT, () => {
  console.log("Socket server running on port: ", PORT);
});
