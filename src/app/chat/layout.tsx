
// import React from "react";
// import ChatList from "@/components/chat/ChatList";
// import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

// export default function ChatLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <div className="flex h-screen md:not-only-of-type:p-5">
//       <div className="w-full md:w-[25%] lg:w-[30%] border rounded-2xl overflow-hidden">
//         <div className="w-full h-20 bg-black"></div>
//         <ScrollArea className="w-full h-full">
//           <ChatList />
//         </ScrollArea>
//       </div>

//       {/* Main Chat Window */}
//       <div className="hidden md:block flex-1">{children}</div>
//     </div>
    
//   );
// }

"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatList from "@/components/chat/ChatList";

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isChatListPage = pathname === "/chat";

  // Manage screen size (optional for SSR-safe handling)
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768); // md = 768px
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Mobile: Show either chat list or chat window
  if (isMobile) {
    if (isChatListPage) {
      return (
        <div className="h-screen border md:rounded-2xl overflow-hidden">
          <div className="w-full h-20 bg-black" />
          <ScrollArea className="h-[calc(100vh-5rem)] w-full">
            <ChatList />
          </ScrollArea>
        </div>
      );
    } else {
      return <div className="h-screen">{children}</div>;
    }
  }

  // Desktop: Show both chat list and chat window side-by-side
  return (
    <div className="grid grid-cols-12 h-screen p-5">
      <div className="hidden md:block md:col-span-5 lg:col-span-4 border rounded-2xl overflow-hidden mb-4">
        <div className="w-full h-20 bg-black" />
        <ScrollArea className="h-full w-full">
          <ChatList />
        </ScrollArea>
      </div>
      <div className="col-span-12 md:col-span-7 lg:col-span-8">{children}</div>
    </div>
  );
}
