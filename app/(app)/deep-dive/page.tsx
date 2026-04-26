"use client";

import { useState } from "react";
import { T } from "@/lib/tokens";

const TOPICS: Record<string, Array<{ n: string; mastery: number; status: string; flag?: string }>> = {
  algebra: [
    { n: "Algebraic Expressions",             mastery: 55, status: "progress" },
    { n: "Linear Equations — one variable",   mastery: 70, status: "progress" },
    { n: "Linear Equations — simultaneous",   mastery: 0,  status: "locked",  flag: "weak" },
    { n: "Inequalities",                       mastery: 0,  status: "locked",  flag: "weak" },
    { n: "Quadratic Equations",                mastery: 0,  status: "locked",  flag: "weak" },
    { n: "Functions & Notation",               mastery: 0,  status: "locked" },
    { n: "Coordinate Geometry",                mastery: 0,  status: "locked" },
    { n: "Word Problems — Rate/Work/Mixture",  mastery: 0,  status: "locked" },
    { n: "Polynomials",                        mastery: 0,  status: "locked" },
    { n: "Arithmetic & Geometric Sequences",   mastery: 0,  status: "locked" },
  ],
  arithmetic: [
    { n: "Integers & Number Types",          mastery: 100, status: "done" },
    { n: "Prime Numbers & Factorisation",    mastery: 100, status: "done" },
    { n: "Divisibility & Remainders",        mastery: 80,  status: "done" },
    { n: "Fractions & Mixed Numbers",        mastery: 60,  status: "progress" },
    { n: "Decimals",                         mastery: 0,   status: "recommended" },
    { n: "Percentages",                      mastery: 40,  status: "progress" },
    { n: "Ratios & Proportions",             mastery: 0,   status: "locked" },
    { n: "Exponents & Roots",                mastery: 0,   status: "locked" },
    { n: "Absolute Value",                   mastery: 0,   status: "locked" },
    { n: "Number Sequences",                 mastery: 0,   status: "locked" },
    { n: "Estimation & Rounding",            mastery: 0,   status: "locked" },
    { n: "Number Lines",                     mastery: 0,   status: "locked" },
  ],
  data: [
    { n: "Mean, Median, Mode & Range",         mastery: 100, status: "done" },
    { n: "Standard Deviation & Normal Dist.",  mastery: 0,   status: "locked" },
    { n: "Frequency & Histograms",             mastery: 100, status: "done" },
    { n: "Probability",                        mastery: 60,  status: "progress" },
    { n: "Permutations & Combinations",        mastery: 0,   status: "locked" },
    { n: "Data Interpretation",                mastery: 0,   status: "locked" },
  ],
  geometry: [
    { n: "Lines, Angles & Parallel Lines",  mastery: 100, status: "done" },
    { n: "Triangles",                       mastery: 60,  status: "progress" },
    { n: "Pythagorean Theorem",             mastery: 100, status: "done" },
    { n: "Quadrilaterals & Polygons",       mastery: 0,   status: "locked" },
    { n: "Circles",                         mastery: 30,  status: "progress" },
    { n: "3D Figures & Volume",             mastery: 0,   status: "locked" },
    { n: "Coordinate Geometry — Slopes",    mastery: 0,   status: "locked" },
    { n: "Perimeter & Area",                mastery: 0,   status: "locked" },
  ],
};

const DOMAINS = [
  { k: "algebra",    title: "Algebra",       sub: "weakest — sorted first", count: "2/10", weak: true  },
  { k: "arithmetic", title: "Arithmetic",    sub: "steady progress",        count: "7/12", weak: false },
  { k: "data",       title: "Data Analysis", sub: "moderate",               count: "3/6",  weak: false },
  { k: "geometry",   title: "Geometry",      sub: "moderate",               count: "3/8",  weak: false },
];

type Topic = { n: string; mastery: number; status: string; flag?: string; domain?: string };

function sym(status: string) {
  return status === "done" ? "●" : status === "progress" ? "◐" : status === "recommended" ? "◉" : "○";
}

function TopicRow({ topic, index }: { topic: Topic; index: number }) {
  const isRec    = topic.status === "recommended";
  const isLocked = topic.status === "locked";
  return (
    <div style={{
      padding: "16px 22px", borderBottom: `1px solid ${T.hairline}`,
      background: isRec ? T.terracottaTint : T.paper,
      display: "flex", alignItems: "center", gap: 14,
      opacity: isLocked ? 0.55 : 1,
    }}>
      <div style={{ fontFamily: T.mono, fontSize: 10, color: T.mist, width: 20, letterSpacing: 0.5 }}>
        {String(index).padStart(2, "0")}
      </div>
      <div style={{ fontFamily: T.mono, fontSize: 14, color: isRec ? T.terracotta : T.ink }}>{sym(topic.status)}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: T.serif, fontSize: 17, color: T.ink, letterSpacing: -0.2, lineHeight: 1.2 }}>{topic.n}</div>
        {isRec && (
          <div style={{ fontFamily: T.mono, fontSize: 9, color: T.terracotta, textTransform: "uppercase", letterSpacing: 1.2, marginTop: 4 }}>
            ◉ recommended · nudge triggered
          </div>
        )}
        {topic.flag === "weak" && !isRec && (
          <div style={{ fontFamily: T.mono, fontSize: 9, color: T.ash, textTransform: "uppercase", letterSpacing: 1.2, marginTop: 4 }}>
            from diagnostic · priority
          </div>
        )}
      </div>
      <div style={{ fontFamily: T.mono, fontSize: 10, color: T.ash }}>
        {topic.mastery > 0 ? `${topic.mastery}%` : "—"}
      </div>
    </div>
  );
}

export default function DeepDivePage() {
  const [filter, setFilter] = useState("all");

  const flatAll: Topic[] = [];
  Object.entries(TOPICS).forEach(([domain, items]) =>
    items.forEach(t => flatAll.push({ ...t, domain }))
  );

  const filteredFlat =
    filter === "rec"  ? flatAll.filter(t => t.status === "recommended" || t.flag === "weak" || t.status === "progress") :
    filter === "weak" ? flatAll.filter(t => t.status === "locked" || (t.mastery > 0 && t.mastery < 50)) :
    filter === "done" ? flatAll.filter(t => t.status === "done") : null;

  return (
    <div style={{ background: T.paper, minHeight: "100%", paddingBottom: 100 }}>
      {/* Header */}
      <div style={{ padding: "64px 22px 0" }}>
        <div style={{ fontFamily: T.mono, fontSize: 10, color: T.ash, textTransform: "uppercase", letterSpacing: 1.4 }}>
          learn · 36 topics · ETS syllabus
        </div>
        <div style={{ fontFamily: T.serif, fontSize: 40, color: T.ink, letterSpacing: -1, lineHeight: 1.02, marginTop: 10 }}>
          Deep <span style={{ fontStyle: "italic" }}>Dive</span>.
        </div>
        <div style={{ fontFamily: T.serif, fontSize: 17, color: T.ash, letterSpacing: -0.2, marginTop: 8, fontStyle: "italic", lineHeight: 1.4 }}>
          Sorted by where you bleed most. Fix the foundation, then climb.
        </div>
      </div>

      {/* Legend */}
      <div style={{ padding: "22px 22px 14px", display: "flex", gap: 16, flexWrap: "wrap" }}>
        {[
          { s: "●", l: "mastered",    c: T.ink       },
          { s: "◐", l: "in progress", c: T.ink       },
          { s: "○", l: "locked",      c: T.mist      },
          { s: "◉", l: "recommended", c: T.terracotta },
        ].map(x => (
          <div key={x.l} style={{ display: "flex", gap: 5, alignItems: "center" }}>
            <span style={{ fontFamily: T.mono, fontSize: 12, color: x.c }}>{x.s}</span>
            <span style={{ fontFamily: T.mono, fontSize: 9, color: T.ash, textTransform: "uppercase", letterSpacing: 1 }}>{x.l}</span>
          </div>
        ))}
      </div>

      {/* Filter pills */}
      <div style={{ display: "flex", padding: "0 22px 16px", gap: 6, borderBottom: `1px solid ${T.hairline}`, flexWrap: "wrap" }}>
        {[
          { k: "all",  l: "all · 36"     },
          { k: "rec",  l: "recommended"  },
          { k: "weak", l: "weak · 28"    },
          { k: "done", l: "mastered · 6" },
        ].map(f => (
          <button key={f.k} onClick={() => setFilter(f.k)} style={{
            fontFamily: T.mono, fontSize: 9.5, letterSpacing: 1.2, textTransform: "uppercase",
            padding: "6px 10px",
            background: filter === f.k ? T.ink : "transparent",
            color:      filter === f.k ? T.paper : T.ash,
            border:     `1px solid ${filter === f.k ? T.ink : T.hairline}`,
            cursor: "pointer",
          }}>{f.l}</button>
        ))}
      </div>

      {/* Content */}
      {filter === "all" ? (
        <div style={{ marginTop: 24 }}>
          {DOMAINS.map(d => (
            <div key={d.k} style={{ marginBottom: 36 }}>
              <div style={{
                padding: "14px 22px",
                background: d.weak ? T.ink : T.cream,
                color: d.weak ? T.paper : T.ink,
                borderTop: `1px solid ${d.weak ? T.ink : T.hairline}`,
                borderBottom: `1px solid ${d.weak ? T.ink : T.hairline}`,
                display: "flex", justifyContent: "space-between", alignItems: "baseline",
              }}>
                <div>
                  <div style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: 1.4, textTransform: "uppercase", color: d.weak ? "rgba(250,250,248,0.55)" : T.ash }}>{d.sub}</div>
                  <div style={{ fontFamily: T.serif, fontSize: 26, letterSpacing: -0.4, marginTop: 2, lineHeight: 1 }}>
                    {d.weak && <span style={{ color: T.terracotta, fontStyle: "italic" }}>↳ </span>}
                    {d.title}
                  </div>
                </div>
                <div style={{ fontFamily: T.mono, fontSize: 11, letterSpacing: 0.5 }}>{d.count}</div>
              </div>
              {TOPICS[d.k].map((t, i) => (
                <TopicRow key={t.n} topic={t} index={i + 1} />
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div>
          <div style={{ padding: "14px 22px", fontFamily: T.mono, fontSize: 9, color: T.ash, textTransform: "uppercase", letterSpacing: 1.4, borderBottom: `1px solid ${T.hairline}` }}>
            {filteredFlat!.length} {filter === "rec" ? "recommended" : filter === "weak" ? "weak" : "mastered"} topics
          </div>
          {filteredFlat!.map((t, i) => (
            <TopicRow key={`${t.domain}-${t.n}`} topic={t} index={i + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
