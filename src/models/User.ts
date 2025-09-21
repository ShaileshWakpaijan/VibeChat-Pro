import { Schema, Document, models, model } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  email: string; // Thia line is written by Sangam. Thanks him for his contribution.
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

UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password as string, 10);
  }
  next();
});

export default models?.User || model<IUser>("User", UserSchema);
