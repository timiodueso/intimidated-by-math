"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Wordmark from "./Wordmark";
import { T } from "@/lib/tokens";

const NAV = [
  { label: "Home",       href: "/"           },
  { label: "Session",    href: "/session"     },
  { label: "Deep Dive",  href: "/deep-dive"   },
  { label: "Progress",   href: "/progress"    },
  { label: "Memes",      href: "/memes"       },
  { label: "Simulation", href: "/simulation"  },
  { label: "Settings",   href: "/settings"    },
];

export default function SideNav() {
  const pathname = usePathname();

  return (
    <aside
      className="hidden md:flex flex-col"
      style={{
        position: "fixed", top: 0, left: 0, height: "100%", width: 224,
        borderRight: `1px solid ${T.hairline}`,
        background: T.paper,
        zIndex: 50,
      }}
    >
      <div style={{ padding: "24px 20px 20px", borderBottom: `1px solid ${T.hairline}` }}>
        <Wordmark size={18} byMath={true} />
      </div>

      <nav style={{ display: "flex", flexDirection: "column", gap: 2, padding: 12, flex: 1 }}>
        {NAV.map(({ label, href }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href} style={{
              display: "flex", alignItems: "center",
              padding: "9px 12px",
              fontFamily: T.mono, fontSize: 11,
              textTransform: "uppercase", letterSpacing: 1.3,
              textDecoration: "none",
              color: active ? T.ink : T.ash,
              background: active ? T.cream : "transparent",
              borderLeft: active ? `2px solid ${T.terracotta}` : "2px solid transparent",
            }}>
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
