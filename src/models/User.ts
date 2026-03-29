import { Schema, Document, models, model, Types } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  email: string; // Thia line is written by Sangam. Thanks him for his contribution.
  username: string;
  password: string;
  isVerified: boolean;
  moodVisibility: {
    mode: "everyone" | "nobody" | "custom";
    customFriends: Types.ObjectId[];
  };
  whoseMoodICanSee: {
    mode: "everyone" | "nobody" | "custom";
    customFriends: Types.ObjectId[];
  };
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
      default: false,
    },
    password: { type: String, required: true, trim: true },
    moodVisibility: {
      mode: {
        type: String,
        enum: ["everyone", "nobody", "custom"],
        default: "everyone",
      },
      customFriends: [{ type: Types.ObjectId, ref: "User" }],
    },
    whoseMoodICanSee: {
      mode: {
        type: String,
        enum: ["everyone", "nobody", "custom"],
        default: "everyone",
      },
      customFriends: [{ type: Types.ObjectId, ref: "User" }],
    },
  },
  { timestamps: true },
);

UserSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password as string, 10);
  }
});

UserSchema.methods.isPasswordCorrect = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

export default models?.User || model<IUser>("User", UserSchema);
