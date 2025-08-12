"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatList from "@/components/chat/ChatList";
import { Navbar_LG, Navbar_SM } from "@/components/Navbar";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isChatListPage = pathname === "/chat";

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (isMobile) {
    if (isChatListPage) {
      return (
        <>
          <Navbar_SM />
          <div className="h-screen border md:rounded-2xl overflow-hidden">
            <div className="w-full h-20" />
            <ScrollArea className="h-[calc(100vh-5rem)] w-full">
              <ChatList />
            </ScrollArea>
          </div>
        </>
      );
    } else {
      return <div className="h-screen">{children}</div>;
    }
  }

  return (
    <>
      <Navbar_LG />
      <div className="grid grid-cols-12 h-[calc(100vh-4rem)] p-3">
        <div className="hidden md:block md:col-span-5 lg:col-span-4 border rounded-2xl overflow-hidden mb-4 h-[calc(100vh-5.4rem)]">
          <div className="w-full h-20" />
          <ScrollArea className="h-full w-full">
            <ChatList />
          </ScrollArea>
        </div>
        <div className="col-span-12 md:col-span-7 lg:col-span-8">
          {children}
        </div>
      </div>
    </>
  );
}
