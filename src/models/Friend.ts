import { Document, model, models, Schema, Types } from "mongoose";

export interface IFriend extends Document {
  sender: Types.ObjectId;
  receiver: Types.ObjectId;
  status: "pending" | "accepted";
}

const FriendSchema: Schema = new Schema<IFriend>(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default models?.Friend || model<IFriend>("Friend", FriendSchema);
