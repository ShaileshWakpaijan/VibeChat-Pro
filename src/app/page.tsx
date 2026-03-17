"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const session = useSession();

  useEffect(() => {
    if (session.status === "authenticated") {
      router.push("/chat");
    } else {
      router.push("/login");
    }
  }, [session, router]);

  if (session.status === "loading") return <h1>Loading...</h1>;
  return (
    <div>
      <h1>Hi my name is Shailesh.</h1>
    </div>
  );
}
