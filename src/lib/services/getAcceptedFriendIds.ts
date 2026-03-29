import Friend from "@/models/Friend";

export async function getAcceptedFriendIds(userId: string): Promise<string[]> {
  const friendsList = await Friend.find({
    $or: [
      { receiver: userId, status: "accepted" },
      { sender: userId, status: "accepted" },
    ],
  }).select("sender receiver");

  const friendIds = friendsList.map((friend) => {
    const senderId = friend.sender.toString();
    const receiverId = friend.receiver.toString();

    return senderId === userId ? receiverId : senderId;
  });

  return friendIds;
}
