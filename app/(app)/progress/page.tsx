import MasteryRing from "@/app/components/MasteryRing";
import { T } from "@/lib/tokens";

const D = {
  streak: 14, bestStreak: 22, xp: 2840, sessions: 38, daysToGRE: 47,
  mastery: [
    { k: "AR", label: "arithmetic",    pct: 62, topics: "7/12" },
    { k: "AL", label: "algebra",       pct: 28, topics: "2/10" },
    { k: "GE", label: "geometry",      pct: 45, topics: "3/8"  },
    { k: "DA", label: "data analysis", pct: 50, topics: "3/6"  },
  ],
  calendar: [
    [0,0,0,1,2,2,1],
    [2,1,2,3,2,1,0],
    [1,2,2,2,3,2,2],
    [2,3,2,1,2,2,1],
    [1,2,2,2,3,3,2],
    [3,2,1,2,0,0,0],
  ],
  xpHistory: [120,80,190,140,210,180,240,160,220,270,150,310,200,240],
};

export default function ProgressPage() {
  const max = 320;
  const pts = D.xpHistory
    .map((v, i) => `${(i / (D.xpHistory.length - 1)) * 280},${100 - (v / max) * 96 - 2}`)
    .join(" ");
  const peakXp = Math.max(...D.xpHistory);

  return (
    <div style={{ background: T.paper, minHeight: "100%", paddingBottom: 100 }}>
      {/* Countdown hero */}
      <div style={{ padding: "60px 22px 22px", borderBottom: `1px solid ${T.hairline}` }}>
        <div style={{ fontFamily: T.mono, fontSize: 10, color: T.ash, textTransform: "uppercase", letterSpacing: 1.4 }}>
          gre · mon 4 jun 2026
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginTop: 6 }}>
          <div style={{ fontFamily: T.serif, fontSize: 84, color: T.ink, letterSpacing: -3.5, lineHeight: 0.9, fontStyle: "italic" }}>
            {D.daysToGRE}
          </div>
          <div>
            <div style={{ fontFamily: T.serif, fontSize: 22, color: T.ink, letterSpacing: -0.4 }}>days</div>
            <div style={{ fontFamily: T.mono, fontSize: 10, color: T.terracotta, textTransform: "uppercase", letterSpacing: 1.4, marginTop: 2 }}>
              ◉ 6 wks 5 days
            </div>
          </div>
        </div>
        {/* Timeline bar */}
        <div style={{ marginTop: 16, height: 8, background: T.hairline, position: "relative" }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "34%", background: T.ink }} />
          <div style={{ position: "absolute", left: "34%", top: -4, width: 2, height: 16, background: T.terracotta }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: T.mono, fontSize: 9, color: T.mist, textTransform: "uppercase", letterSpacing: 1, marginTop: 6 }}>
          <span>started · feb 26</span>
          <span>today</span>
          <span>exam · jun 4</span>
        </div>
      </div>

      {/* KPI row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", borderBottom: `1px solid ${T.hairline}` }}>
        {[
          { k: "streak",   v: D.streak,  sub: `best ${D.bestStreak}` },
          { k: "total xp", v: "2.8k",    sub: `${D.sessions} sessions` },
          { k: "topics",   v: "15/36",   sub: "42%" },
        ].map((s, i) => (
          <div key={s.k} style={{ padding: "14px 12px", borderRight: i < 2 ? `1px solid ${T.hairline}` : "none" }}>
            <div style={{ fontFamily: T.mono, fontSize: 9, color: T.ash, textTransform: "uppercase", letterSpacing: 1.4 }}>{s.k}</div>
            <div style={{ fontFamily: T.serif, fontSize: 30, color: T.ink, letterSpacing: -0.6, lineHeight: 1, marginTop: 4 }}>{s.v}</div>
            <div style={{ fontFamily: T.mono, fontSize: 9, color: T.mist, marginTop: 3, letterSpacing: 0.5 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Mastery rings */}
      <div style={{ padding: "22px 22px", borderBottom: `1px solid ${T.hairline}` }}>
        <div style={{ fontFamily: T.mono, fontSize: 10, color: T.ash, textTransform: "uppercase", letterSpacing: 1.4, marginBottom: 14 }}>
          mastery across domains
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)" }}>
          {D.mastery.map(m => (
            <MasteryRing key={m.k} value={m.pct} label={m.label} sub={m.topics} size={56}
              color={m.k === "AL" ? T.terracotta : T.ink} />
          ))}
        </div>
      </div>

      {/* Streak heatmap */}
      <div style={{ padding: "22px 22px", borderBottom: `1px solid ${T.hairline}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <div style={{ fontFamily: T.mono, fontSize: 10, color: T.ash, textTransform: "uppercase", letterSpacing: 1.4 }}>last 6 weeks</div>
          <div style={{ fontFamily: T.mono, fontSize: 10, color: T.terracotta }}>◉ {D.streak} streak</div>
        </div>
        <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 3 }}>
          {D.calendar.map((week, wi) => (
            <div key={wi} style={{ display: "flex", gap: 3 }}>
              {week.map((day, di) => (
                <div key={di} style={{
                  flex: 1, height: 16,
                  background: day === 0 ? T.hairline : day === 1 ? "#F1D9CF" : day === 2 ? "#E18A76" : T.terracotta,
                }} />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* XP line chart */}
      <div style={{ padding: "22px 22px" }}>
        <div style={{ fontFamily: T.mono, fontSize: 10, color: T.ash, textTransform: "uppercase", letterSpacing: 1.4 }}>
          xp per session · last 14
        </div>
        <svg viewBox="0 0 280 100" style={{ width: "100%", height: 100, marginTop: 12 }} preserveAspectRatio="none">
          <polyline points={pts} fill="none" stroke={T.ink} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
          {D.xpHistory.map((v, i) => (
            <circle key={i}
              cx={(i / (D.xpHistory.length - 1)) * 280}
              cy={100 - (v / max) * 96 - 2}
              r={v === peakXp ? 3.5 : 2}
              fill={v === peakXp ? T.terracotta : T.ink}
            />
          ))}
        </svg>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: T.mono, fontSize: 9, color: T.mist, marginTop: 4 }}>
          <span>−14d</span><span>peak 310</span><span>today</span>
        </div>
      </div>
    </div>
  );
}
