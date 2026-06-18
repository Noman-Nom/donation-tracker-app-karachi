"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CreditCard, Users } from "lucide-react";
import { cn } from "@/lib/utils";

// Icons are defined inside this client component so they never cross the
// server/client boundary as props.
const LINKS = [
  { href: "/", label: "Members", icon: Users },
  { href: "/payments", label: "Payments", icon: CreditCard },
];

export function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="ml-2 flex items-center gap-1">
      {LINKS.map(({ href, label, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-indigo-300/40",
              active
                ? "bg-white/10 text-fg shadow-sm"
                : "text-muted hover:bg-white/5 hover:text-fg",
            )}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
