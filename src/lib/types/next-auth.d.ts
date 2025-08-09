import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      _id: string;
      username: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    username: string;
  }
}

declare module "next-auth" {
  interface JWT {
    token: {
      username: string;
    } & DefaultJWT["token"];
  }
}
