import { Schema, Document, model } from "mongoose";

export interface IUser extends Document {
  email: string;
  username: string;
  password: string;
  isVerified: boolean;
}

const UserSchema: Schema = new Schema<IUser>(
  {
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    username: {
      type: String,
      maxLength: 20,
      lowercase: true,
      unique: true,
      trim: true,
      required: true,
      index: true,
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    password: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

export const User = model<IUser>("User", UserSchema);
