import { getServerSession } from "next-auth";
import { authOptions } from "./authOptions";

export const getSessionOrRedirect = async () => {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("UNAUTHORIZED");
  }
  return session;
};
