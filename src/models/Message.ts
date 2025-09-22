import { Document, model, models, Schema, Types } from "mongoose";

export interface IMessage extends Document {
  conversationId: Types.ObjectId;
  sender: Types.ObjectId;
  status: "sent" | "delivered" | "read";
  content: string;
}

const MessageSchema: Schema = new Schema<IMessage>(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["sent", "delivered", "read"],
      default: "sent",
    },
    content: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

MessageSchema.index({ conversationId: 1, createdAt: -1 }); 

export default models?.Message || model<IMessage>("Message", MessageSchema);
