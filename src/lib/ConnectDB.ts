import mongoose from "mongoose";
import "@/models/User";
import "@/models/Friend";
import "@/models/Conversation";
import "@/models/Message";
import "@/models/Otp";

let isConnected: boolean = false;

export const ConnectDB = async () => {
  if (isConnected) {
    console.log("MongoDB already connected.");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI || "");
    isConnected = true;
    console.log("MongoDB connected ✅");
  } catch (error) {
    console.error("MongoDB connection error: ", error);
    throw error;
  }
};