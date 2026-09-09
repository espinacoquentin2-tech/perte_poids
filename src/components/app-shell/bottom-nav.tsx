"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, Dumbbell, House, ShoppingBasket, TrendingDown } from "lucide-react";

const items = [
  { href: "/", label: "Aujourd’hui", icon: House },
  { href: "/meals", label: "Repas", icon: CalendarDays },
  { href: "/shopping", label: "Courses", icon: ShoppingBasket },
  { href: "/sport", label: "Sport", icon: Dumbbell },
  { href: "/progress", label: "Progression", icon: TrendingDown },
];

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Navigation principale" className="safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto grid h-16 max-w-lg grid-cols-5">
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return <Link key={href} href={href} aria-current={active ? "page" : undefined} className={`flex min-w-0 flex-col items-center justify-center gap-1 text-[10px] font-semibold ${active ? "text-brand" : "text-slate-400"}`}><Icon size={22} strokeWidth={active ? 2.5 : 2} /><span className="truncate px-0.5">{label}</span></Link>;
        })}
      </div>
    </nav>
  );
}
