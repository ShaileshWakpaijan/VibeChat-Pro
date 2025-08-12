import mongoose from "mongoose";

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