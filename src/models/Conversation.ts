import { Document, model, models, Schema, Types } from "mongoose";

export interface IConversation extends Document {
  type: "one_to_one" | "group";
  participants: Types.ObjectId[];
  lastMessage?: Types.ObjectId;
  groupName?: string;
  groupAdmin?: Types.ObjectId;
}

const ConversationSchema: Schema = new Schema<IConversation>(
  {
    type: {
      type: String,
      enum: ["one_to_one", "group"],
      required: true,
      default: "one_to_one",
    },
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    groupName: {
      type: String,
      required: function () {
        return this.type === "group";
      },
    },
    groupAdmin: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: function () {
        return this.type === "group";
      },
    },
    lastMessage: {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },
  },
  { timestamps: true }
);

ConversationSchema.index({ participants: 1 });

export default models?.Conversation ||
  model<IConversation>("Conversation", ConversationSchema);
