"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { T } from "@/lib/tokens";

const NAV_ITEMS = [
  { k: "home",      label: "home",      href: "/" },
  { k: "session",   label: "session",   href: "/session" },
  { k: "learn",     label: "deep dive", href: "/deep-dive" },
  { k: "stats",     label: "progress",  href: "/progress" },
  { k: "memes",     label: "memes",     href: "/memes" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="md:hidden"
      style={{
        position: "fixed",
        bottom: 0, left: 0, right: 0,
        background: T.paper,
        borderTop: `1px solid ${T.hairline}`,
        padding: "10px 12px 30px",
        display: "grid",
        gridTemplateColumns: `repeat(${NAV_ITEMS.length}, 1fr)`,
        gap: 4,
        zIndex: 50,
      }}
    >
      {NAV_ITEMS.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.k}
            href={item.href}
            style={{
              textAlign: "center",
              padding: "8px 4px",
              fontFamily: T.mono,
              fontSize: 9,
              color: active ? T.ink : T.mist,
              textTransform: "uppercase",
              letterSpacing: 1.2,
              textDecoration: "none",
              borderTop: active
                ? `1px solid ${T.terracotta}`
                : "1px solid transparent",
            }}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
