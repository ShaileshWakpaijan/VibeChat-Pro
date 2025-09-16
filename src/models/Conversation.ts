import { Document, model, models, Schema, Types } from "mongoose";

export interface IConversation extends Document {
  participants: Types.ObjectId[];
  lastMessage: Types.ObjectId;
  lastMessageAt: Date;
}

const ConversationSchema: Schema = new Schema<IConversation>(
  {
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    lastMessage: {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },
    lastMessageAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default models?.Conversation ||
  model<IConversation>("Conversation", ConversationSchema);
