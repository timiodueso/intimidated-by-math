"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useVoice } from "./VoiceContext";
import { T } from "@/lib/tokens";

const ROUTE_LABELS: Record<string, string> = {
  "/home":       "Home",
  "/session":    "Practice",
  "/deep-dive":  "Learn",
  "/simulation": "Simulation",
  "/progress":   "Progress",
  "/memes":      "Memes",
  "/settings":   "Settings",
};

export default function TopBar() {
  const pathname = usePathname();
  const { voice, setVoice } = useVoice();
  const [open, setOpen] = useState(false);

  const label = ROUTE_LABELS[pathname] ?? "";

  return (
    <div
      className="hidden md:flex"
      style={{
        height: 48,
        flexShrink: 0,
        borderBottom: `1px solid ${T.hairline}`,
        alignItems: "center",
        padding: "0 24px",
        justifyContent: "space-between",
        background: T.paper,
      }}
    >
      <div style={{ fontFamily: T.mono, fontSize: 10, color: T.ash, textTransform: "uppercase", letterSpacing: 1.6 }}>
        {label}
      </div>

      {/* Right side: voice selector + gear */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>

      {/* Voice selector */}
      <div style={{ position: "relative" }}>
        <button
          onClick={() => setOpen(!open)}
          style={{
            display: "flex", gap: 8, alignItems: "center", cursor: "pointer",
            padding: "4px 10px", border: `1px solid ${T.hairline}`,
            background: "transparent",
          }}
        >
          <span style={{ fontFamily: T.mono, fontSize: 9, color: T.ash, textTransform: "uppercase", letterSpacing: 1.2 }}>
            timi&rsquo;s voice
          </span>
          <span style={{ fontFamily: T.serif, fontSize: 13, fontStyle: "italic", color: T.ink }}>{voice}</span>
          <span style={{ fontFamily: T.mono, fontSize: 10, color: T.ash }}>▾</span>
        </button>

        {open && (
          <div style={{
            position: "absolute", right: 0, top: "100%", marginTop: 4,
            background: T.paper, border: `1px solid ${T.ink}`,
            width: 180, zIndex: 100,
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          }}>
            {(["mild", "neutral", "sarcastic"] as const).map((v) => (
              <div
                key={v}
                onClick={() => { setVoice(v); setOpen(false); }}
                style={{
                  padding: "10px 14px", cursor: "pointer",
                  background: voice === v ? T.ink : T.paper,
                  color: voice === v ? T.paper : T.ink,
                  borderBottom: `1px solid ${T.hairline}`,
                  fontFamily: T.serif, fontSize: 15, letterSpacing: -0.2,
                }}
              >
                {v}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Gear icon → /settings */}
      <Link
        href="/settings"
        style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          width: 32, height: 32,
          border: `1px solid ${T.hairline}`,
          color: T.ash,
          fontFamily: T.mono, fontSize: 14,
          textDecoration: "none",
          flexShrink: 0,
        }}
      >
        ⚙
      </Link>

      </div>
    </div>
  );
}
