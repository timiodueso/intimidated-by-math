"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { T } from "@/lib/tokens";

const NAV_ITEMS = [
  { k: "home",     label: "Home",     href: "/home",      icon: "⌂" },
  { k: "practice", label: "Practice", href: "/session",   icon: "▶" },
  { k: "learn",    label: "Learn",    href: "/deep-dive", icon: "◎" },
  { k: "progress", label: "Progress", href: "/progress",  icon: "◈" },
  { k: "memes",    label: "Memes",    href: "/memes",     icon: "◉" },
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
        padding: "8px 12px 28px",
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
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
              padding: "6px 4px",
              textDecoration: "none",
              borderTop: active ? `1px solid ${T.terracotta}` : "1px solid transparent",
            }}
          >
            <span
              style={{
                fontFamily: T.mono,
                fontSize: 16,
                color: active ? T.ink : T.mist,
                lineHeight: 1,
              }}
            >
              {item.icon}
            </span>
            <span
              style={{
                fontFamily: T.mono,
                fontSize: 8,
                color: active ? T.ink : T.mist,
                textTransform: "uppercase",
                letterSpacing: 1.1,
              }}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
