"use client";

import { Navbar_LG, Navbar_SM } from "@/components/Navbar";
import { useEffect, useState } from "react";

export default function ProfileUpdateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (isMobile) {
    return (
      <>
        <Navbar_SM />
        <div className="w-full">{children}</div>
      </>
    );
  }

  return (
    <>
      <Navbar_LG />
      <div className="w-full">{children}</div>
    </>
  );
}
