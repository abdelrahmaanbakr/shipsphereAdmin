"use client";

import { Sidebar } from "./Sidebar";
import { ChatWidget } from "./ChatWidget";
import { usePathname } from "next/navigation";

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === "/login";

  if (isLogin) return <>{children}</>;

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
      <ChatWidget />
    </div>
  );
}
