import { BottomNav } from "@/components/app-shell/bottom-nav";
import type { ReactNode } from "react";

export default function AppLayout({ children }: { children: ReactNode }) {
  return <><main className="mx-auto min-h-dvh max-w-lg px-4 pb-24 pt-5">{children}</main><BottomNav /></>;
}
