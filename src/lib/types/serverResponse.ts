interface Participant {
  _id: string;
  username: string;
}

export interface LastMessage {
  _id: string;
  sender: Sender;
  content: string;
  createdAt: string;
  status: "sent" | "delivered" | "read";
}

interface Sender {
  _id: string;
  username: string;
}

export interface ConversationResponse {
  _id: string;
  participants: Participant[];
  chatName: string;
}

export interface ConversationListResponse extends ConversationResponse {
  _id: string;
  type: "one_to_one";
  createdAt: string;
  lastMessage: LastMessage;
}

export interface SearchUserResponse {
  _id: string;
  username: string;
  email: string;
  status?: "accepted" | "pending";
}

export interface FriendRequestListResponse {
  _id: string;
  username: string;
  email: string;
  userId: string;
}

export interface MessageListResponse extends LastMessage {
  conversationId: string;
}
