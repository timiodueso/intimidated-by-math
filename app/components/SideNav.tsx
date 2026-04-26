"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useVoice } from "./VoiceContext";
import { T } from "@/lib/tokens";

const NAV = [
  { label: "Home",     href: "/home",      icon: "⌂" },
  { label: "Practice", href: "/session",   icon: "▶" },
  { label: "Learn",    href: "/deep-dive", icon: "◎" },
  { label: "Progress", href: "/progress",  icon: "◈" },
  { label: "Memes",    href: "/memes",     icon: "◉" },
];

export default function SideNav() {
  const pathname = usePathname();
  const { voice } = useVoice();

  return (
    <aside
      style={{
        flexShrink: 0,
        background: T.paper,
        borderRight: `1px solid ${T.hairline}`,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
      }}
      /* 240px on lg+, 64px on md–lg (icon rail), hidden on mobile */
      className="hidden md:flex w-16 lg:w-60"
    >
      {/* Wordmark */}
      <div
        style={{ padding: "28px 22px 20px", borderBottom: `1px solid ${T.hairline}` }}
        className="hidden lg:block"
      >
        <div style={{ fontFamily: T.serif, fontSize: 22, color: T.ink, letterSpacing: -0.6, lineHeight: 1 }}>
          In<span style={{ fontStyle: "italic", fontWeight: 700, color: T.terracotta }}>TIMI</span>dated
        </div>
        <div style={{ fontFamily: T.mono, fontSize: 9, color: T.ash, textTransform: "uppercase", letterSpacing: 2, marginTop: 5 }}>
          by&nbsp;math.
        </div>
      </div>

      {/* Icon-only wordmark on tablet */}
      <div
        style={{ padding: "20px 0", borderBottom: `1px solid ${T.hairline}`, textAlign: "center" }}
        className="lg:hidden"
      >
        <span style={{ fontFamily: T.mono, fontSize: 16, color: T.terracotta }}>∑</span>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "12px 0", overflowY: "auto" }}>
        {NAV.map(({ label, href, icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                cursor: "pointer",
                background: active ? T.cream : "transparent",
                borderLeft: `2px solid ${active ? T.terracotta : "transparent"}`,
                textDecoration: "none",
                transition: "background 120ms",
              }}
              className="px-0 lg:px-[22px] py-[11px] justify-center lg:justify-start"
            >
              <span
                style={{
                  fontFamily: T.mono,
                  fontSize: 14,
                  color: active ? T.ink : T.ash,
                  width: 20,
                  textAlign: "center",
                  flexShrink: 0,
                }}
              >
                {icon}
              </span>
              <span
                className="hidden lg:block"
                style={{
                  fontFamily: T.serif,
                  fontSize: 16,
                  letterSpacing: -0.2,
                  color: active ? T.ink : T.ash,
                }}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom stats strip — full sidebar only */}
      <div
        className="hidden lg:block"
        style={{ padding: "16px 22px", borderTop: `1px solid ${T.hairline}` }}
      >
        <div style={{ display: "flex", gap: 16 }}>
          {[
            { k: "streak", v: "14d"  },
            { k: "xp",     v: "2.8k" },
            { k: "gre",    v: "d-47" },
          ].map((s) => (
            <div key={s.k}>
              <div style={{ fontFamily: T.mono, fontSize: 8, color: T.mist, textTransform: "uppercase", letterSpacing: 1.2 }}>{s.k}</div>
              <div style={{ fontFamily: T.serif, fontSize: 16, color: T.ink, letterSpacing: -0.3, marginTop: 1 }}>{s.v}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12, fontFamily: T.mono, fontSize: 9, color: T.ash, textTransform: "uppercase", letterSpacing: 1.2 }}>
          timi&rsquo;s voice · <span style={{ color: T.terracotta }}>{voice}</span>
        </div>
      </div>
    </aside>
  );
}
