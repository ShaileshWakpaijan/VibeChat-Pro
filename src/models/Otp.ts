import { Document, model, models, Schema } from "mongoose";

export interface IOtp extends Document {
  username: string;
  otp: string;
  expiresAt: Date;
}

const OtpSchema: Schema = new Schema<IOtp>(
  {
    username: {
      type: String,
      maxLength: 20,
      unique: true,
      lowercase: true,
      trim: true,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

export default models?.Otp || model<IOtp>("Otp", OtpSchema);
