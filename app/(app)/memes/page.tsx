"use client";

import { useState } from "react";
import { T } from "@/lib/tokens";

type Meme = { id: number; label: string; topic: string; date: string; tag: string; count: number };

const SUCCESS: Meme[] = [
  { id:1, label:"Mr Ibu Triumphant",       topic:"Pythagorean Theorem",  date:"14 apr", tag:"success", count:3 },
  { id:2, label:"Genevieve Nnaji Side-eye", topic:"Linear Equations",     date:"11 apr", tag:"success", count:5 },
  { id:3, label:"RMD Nodding",              topic:"Prime Numbers",         date:"8 apr",  tag:"success", count:2 },
  { id:4, label:"Funke Akindele Points",    topic:"Mean & Median",         date:"5 apr",  tag:"success", count:4 },
  { id:5, label:"Patience Ozokwor Shocked", topic:"Fractions",             date:"1 apr",  tag:"success", count:1 },
  { id:6, label:"Falz Head-shake",          topic:"Probability",           date:"29 mar", tag:"success", count:2 },
];

const FAILURE: Meme[] = [
  { id:7, label:"Patience Ozokwor Restarted", topic:"Decimals",              date:"18 apr", tag:"failure", count:4 },
  { id:8, label:"Mr Ibu Confused",            topic:"Algebra Expressions",   date:"16 apr", tag:"failure", count:2 },
];

const LOCKED = { success: 12, failure: 8 };

function MemeCard({ meme, wide }: { meme: Meme; wide?: boolean }) {
  return (
    <div style={{ overflow: "hidden", border: `1px solid ${T.hairline}`, background: T.paper }}>
      <div style={{
        width: "100%", aspectRatio: wide ? "3/2" : "1/1",
        background: `repeating-linear-gradient(45deg, ${T.cream} 0 8px, ${T.hairline} 8px 9px)`,
        position: "relative", display: "flex", alignItems: "flex-end", padding: 8,
      }}>
        <div style={{ fontFamily: T.mono, fontSize: 8, color: T.ash, textTransform: "uppercase", letterSpacing: 1.2, background: T.paper, padding: "3px 5px", border: `1px solid ${T.hairline}` }}>
          ◉ {meme.label}
        </div>
      </div>
      <div style={{ padding: "8px 10px 10px" }}>
        <div style={{ fontFamily: T.serif, fontSize: 13, color: T.ink, letterSpacing: -0.1, lineHeight: 1.2 }}>{meme.label}</div>
        <div style={{ fontFamily: T.mono, fontSize: 9, color: T.ash, marginTop: 4, letterSpacing: 1 }}>{meme.topic}</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
          <div style={{ fontFamily: T.mono, fontSize: 8, color: T.mist, textTransform: "uppercase", letterSpacing: 1 }}>{meme.date}</div>
          <div style={{ fontFamily: T.mono, fontSize: 8, letterSpacing: 1, textTransform: "uppercase", padding: "2px 5px", border: `1px solid ${meme.tag === "success" ? T.sage : T.terracotta}`, color: meme.tag === "success" ? T.sage : T.terracotta }}>
            ×{meme.count}
          </div>
        </div>
      </div>
    </div>
  );
}

function LockedMeme() {
  return (
    <div style={{ width: "100%", aspectRatio: "1/1", background: T.ink, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid rgba(250,250,248,0.06)` }}>
      <div style={{ fontFamily: T.mono, fontSize: 28, color: "rgba(250,250,248,0.2)" }}>?</div>
    </div>
  );
}

export default function MemesPage() {
  const [tab, setTab] = useState<"success" | "failure">("success");
  const memes      = tab === "success" ? SUCCESS : FAILURE;
  const locked     = tab === "success" ? LOCKED.success : LOCKED.failure;
  const featured   = memes[0];
  const rest       = memes.slice(1);

  return (
    <div style={{ background: T.paper, minHeight: "100%", paddingBottom: 100 }}>
      {/* Ink header */}
      <div style={{ background: T.ink, color: T.paper, padding: "60px 18px 20px", borderBottom: `1px solid rgba(250,250,248,0.12)` }}>
        <div style={{ fontFamily: T.mono, fontSize: 10, color: "rgba(250,250,248,0.5)", textTransform: "uppercase", letterSpacing: 1.4 }}>
          memes · {SUCCESS.length + FAILURE.length} unlocked / {SUCCESS.length + FAILURE.length + LOCKED.success + LOCKED.failure} total
        </div>
        <div style={{ fontFamily: T.serif, fontSize: 34, letterSpacing: -0.8, lineHeight: 1.05, marginTop: 8 }}>
          The <span style={{ fontStyle: "italic", color: T.terracotta }}>reactions</span>.
        </div>
        {/* Tabs */}
        <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
          {([
            { k: "success", l: `success pool · ${SUCCESS.length}` },
            { k: "failure", l: `failure pool · ${FAILURE.length}` },
          ] as const).map(t => (
            <button key={t.k} onClick={() => setTab(t.k)} style={{
              padding: "6px 12px",
              background: tab === t.k ? T.paper : "transparent",
              color:      tab === t.k ? T.ink   : "rgba(250,250,248,0.6)",
              border:     `1px solid ${tab === t.k ? T.paper : "rgba(250,250,248,0.25)"}`,
              fontFamily: T.mono, fontSize: 9, textTransform: "uppercase", letterSpacing: 1.4, cursor: "pointer",
            }}>{t.l}</button>
          ))}
        </div>
      </div>

      {/* Featured wide card */}
      {featured && (
        <div style={{ padding: "16px 18px 0" }}>
          <div style={{ fontFamily: T.mono, fontSize: 9, color: T.ash, textTransform: "uppercase", letterSpacing: 1.4, marginBottom: 8 }}>
            ◉ most shown · {featured.count}×
          </div>
          <MemeCard meme={featured} wide />
        </div>
      )}

      {/* Grid */}
      <div style={{ padding: "14px 18px 0", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {rest.map(m => <MemeCard key={m.id} meme={m} />)}
        {Array.from({ length: locked }).map((_, i) => <LockedMeme key={`lock-${i}`} />)}
      </div>

      <div style={{ padding: "14px 18px 0" }}>
        <div style={{ fontFamily: T.mono, fontSize: 9, color: T.mist, textTransform: "uppercase", letterSpacing: 1.4, textAlign: "center" }}>
          {locked} locked · finish topics to unlock
        </div>
      </div>
    </div>
  );
}
