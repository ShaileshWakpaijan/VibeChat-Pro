import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log("Database connected to socket server");
  } catch (error) {
    console.error("DB connection failed", error);
    throw error;
  }
};
