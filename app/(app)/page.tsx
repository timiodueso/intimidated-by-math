import Link from "next/link";
import MasteryRing from "@/app/components/MasteryRing";
import { T } from "@/lib/tokens";

const RINGS = [
  { label: "Arithmetic", value: 62, sub: "7/12" },
  { label: "Algebra",    value: 28, sub: "2/10" },
  { label: "Geometry",   value: 45, sub: "3/8"  },
  { label: "Data",       value: 50, sub: "3/6"  },
];

const STATS = [
  { k: "streak", v: "14",    u: "days"  },
  { k: "xp",     v: "2,840", u: "total" },
  { k: "gre in", v: "47",    u: "days"  },
];

export default function HomePage() {
  return (
    <div style={{ background: T.paper, minHeight: "100%", paddingBottom: 100 }}>
      <div style={{ padding: "72px 22px 0" }}>
        <div style={{ fontFamily: T.mono, fontSize: 10, color: T.ash, letterSpacing: 1.4, textTransform: "uppercase" }}>
          Mon · 18 Apr · 07:41
        </div>
        <div style={{ fontFamily: T.serif, fontSize: 36, fontWeight: 400, color: T.ink, letterSpacing: -0.9, lineHeight: 1.05, marginTop: 12 }}>
          You&rsquo;re back. Good.
        </div>
        <div style={{ fontFamily: T.serif, fontSize: 36, fontWeight: 400, color: T.ash, letterSpacing: -0.9, lineHeight: 1.05, fontStyle: "italic" }}>
          Algebra is still 28%. We both know.
        </div>
      </div>

      <div style={{ margin: "28px 22px 0", border: `1px solid ${T.hairline}`, display: "grid", gridTemplateColumns: "repeat(3, 1fr)" }}>
        {STATS.map((s, i) => (
          <div key={s.k} style={{ padding: "14px 14px 16px", borderLeft: i === 0 ? "none" : `1px solid ${T.hairline}` }}>
            <div style={{ fontFamily: T.mono, fontSize: 9, color: T.ash, textTransform: "uppercase", letterSpacing: 1.4 }}>{s.k}</div>
            <div style={{ fontFamily: T.serif, fontSize: 30, color: T.ink, letterSpacing: -0.6, marginTop: 4, lineHeight: 1 }}>{s.v}</div>
            <div style={{ fontFamily: T.mono, fontSize: 10, color: T.ash, marginTop: 2 }}>{s.u}</div>
          </div>
        ))}
      </div>

      <Link href="/session" style={{ textDecoration: "none" }}>
        <div style={{ margin: "16px 22px 0", background: T.ink, color: T.paper, padding: "18px 20px" }}>
          <div style={{ fontFamily: T.mono, fontSize: 9, color: "rgba(250,250,248,0.5)", textTransform: "uppercase", letterSpacing: 1.4 }}>
            Today · 10 min
          </div>
          <div style={{ fontFamily: T.serif, fontSize: 22, letterSpacing: -0.3, marginTop: 4 }}>
            Begin daily session <span style={{ fontStyle: "italic", color: T.terracotta }}>→</span>
          </div>
          <div style={{ fontFamily: T.mono, fontSize: 10, color: "rgba(250,250,248,0.5)", marginTop: 4, textTransform: "uppercase", letterSpacing: 1 }}>
            Today from Lagos
          </div>
        </div>
      </Link>

      <div style={{ padding: "28px 22px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <div style={{ fontFamily: T.mono, fontSize: 10, color: T.ash, textTransform: "uppercase", letterSpacing: 1.4 }}>Mastery — 4 domains</div>
          <div style={{ fontFamily: T.mono, fontSize: 10, color: T.ash }}>15/36 topics</div>
        </div>
        <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", padding: "18px 4px", border: `1px solid ${T.hairline}`, background: T.cream }}>
          {RINGS.map((r) => (
            <MasteryRing key={r.label} value={r.value} label={r.label} sub={r.sub} size={54} />
          ))}
        </div>
      </div>

      <div style={{ marginTop: 24 }}>
        {[
          { k: "deep dive",  sub: "structured concepts · sorted by weakness", detail: "15/36", href: "/deep-dive" },
          { k: "simulation", sub: "20q · 35min · full quant section",         detail: "mock",   href: "/simulation" },
          { k: "memes",      sub: "nollywood reactions · 8 unlocked",         detail: "8/24",   href: "/memes" },
        ].map((row) => (
          <Link key={row.k} href={row.href} style={{ textDecoration: "none" }}>
            <div style={{ padding: "16px 22px", borderBottom: `1px solid ${T.hairline}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontFamily: T.serif, fontSize: 18, color: T.ink, letterSpacing: -0.2 }}>{row.k}</div>
                <div style={{ fontFamily: T.mono, fontSize: 10, color: T.ash, marginTop: 2 }}>{row.sub}</div>
              </div>
              <div style={{ fontFamily: T.mono, fontSize: 10, color: T.ash, textTransform: "uppercase", letterSpacing: 1 }}>{row.detail}</div>
            </div>
          </Link>
        ))}
      </div>

      <div style={{ padding: "24px 22px 0" }}>
        <div style={{ fontFamily: T.mono, fontSize: 10, color: T.ash, textTransform: "uppercase", letterSpacing: 1.4, marginBottom: 10 }}>
          Featured meme · last unlocked
        </div>
        <div style={{ height: 136, width: "100%", position: "relative", background: `repeating-linear-gradient(45deg, ${T.cream} 0 8px, ${T.hairline} 8px 9px)`, border: `1px solid ${T.hairline}` }}>
          <div style={{ position: "absolute", inset: 10, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div style={{ fontFamily: T.mono, fontSize: 9, color: T.ash, textTransform: "uppercase", letterSpacing: 1.2 }}>◉ genevieve nnaji side-eye</div>
            <div style={{ fontFamily: T.mono, fontSize: 9, color: T.ash, textTransform: "uppercase", letterSpacing: 1, alignSelf: "flex-end" }}>linear equations · yesterday</div>
          </div>
        </div>
      </div>
    </div>
  );
}
