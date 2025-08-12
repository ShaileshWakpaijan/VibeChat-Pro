"use client";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const Dashboard = () => {
  const router = useRouter();
  const session = useSession();

  useEffect(() => {
    if (session.status === "unauthenticated") {
      router.push("/login");
      return;
    }
  }, [session, router]);

  if (session.status === "loading") return <h1>Loading...</h1>;
  return (
    <div>
      <div>Welcome</div>
      <Button onClick={() => signOut({ callbackUrl: "/login" })}>
        Log Out
      </Button>
    </div>
  );
};

export default Dashboard;
