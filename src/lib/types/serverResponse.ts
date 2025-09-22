interface Participant {
  _id: string;
  username: string;
}

export interface LastMessage {
  _id: string;
  sender: {
    _id: string;
    username: string;
  };
  content: string;
  createdAt: string;
}

export interface ConversationListResponse {
  _id: string;
  type: "one_to_one";
  participants: Participant[];
  createdAt: string;
  __v: number;
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
