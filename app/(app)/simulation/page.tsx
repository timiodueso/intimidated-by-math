"use client";

import { useState, useEffect, useRef } from "react";
import { T } from "@/lib/tokens";

type Phase = "pre" | "active" | "done";

const SIM_Q = [
  { id:1,  domain:"arithmetic", topic:"Percentages",       prompt:"A trader buys fabric at ₦3,200 and sells at ₦4,000. What is the percent markup?",              opts:["20%","25%","80%","125%"],             ans:"B" },
  { id:2,  domain:"algebra",    topic:"Linear Equations",  prompt:"If 3x − 7 = 14, what is the value of x?",                                                       opts:["3","5","7","9"],                      ans:"C" },
  { id:3,  domain:"geometry",   topic:"Pythagorean Theorem",prompt:"A right triangle has legs of 9 and 12. What is its hypotenuse?",                               opts:["13","15","17","21"],                   ans:"B" },
  { id:4,  domain:"data",       topic:"Mean & Median",     prompt:"The mean of five numbers is 18. Four are 14, 16, 22, and 24. What is the fifth?",               opts:["12","14","14","16"],                   ans:"B" },
  { id:5,  domain:"arithmetic", topic:"Ratios",            prompt:"A matatu route has a driver-to-conductor ratio of 3∶2. With 60 drivers, how many conductors?",  opts:["30","36","40","45"],                   ans:"C" },
  { id:6,  domain:"algebra",    topic:"Inequalities",      prompt:"Which values of y satisfy 2y + 3 < 11?",                                                         opts:["y < 4","y < 7","y ≤ 4","y > 4"],      ans:"A" },
  { id:7,  domain:"geometry",   topic:"Circles",           prompt:"A circle has radius 7. What is the area? (π ≈ 22/7)",                                           opts:["44","154","308","616"],                ans:"B" },
  { id:8,  domain:"data",       topic:"Probability",       prompt:"A bag has 4 red, 3 blue, 5 green balls. What is P(blue)?",                                       opts:["1/4","1/3","1/2","3/12"],              ans:"A" },
  { id:9,  domain:"arithmetic", topic:"Exponents",         prompt:"What is the value of 2⁵ × 2⁻²?",                                                                opts:["4","6","8","16"],                      ans:"C" },
  { id:10, domain:"algebra",    topic:"Functions",         prompt:"If f(x) = 3x² − 2, what is f(−3)?",                                                             opts:["−29","25","29","−25"],                  ans:"B" },
  { id:11, domain:"geometry",   topic:"Triangles",         prompt:"A triangle has angles in ratio 2∶3∶5. What is the largest angle?",                              opts:["72°","90°","108°","120°"],             ans:"B" },
  { id:12, domain:"data",       topic:"Standard Deviation",prompt:"Which has larger SD: A = {10,10,10} or B = {8,10,12}?",                                         opts:["Dataset A","Dataset B","Equal","Cannot determine"], ans:"B" },
  { id:13, domain:"arithmetic", topic:"Fractions",         prompt:"What is ⅗ + ¾?",                                                                                opts:["8/20","27/20","17/20","9/20"],         ans:"B" },
  { id:14, domain:"algebra",    topic:"Quadratics",        prompt:"What are the roots of x² − 5x + 6 = 0?",                                                        opts:["2 and 3","1 and 6","−2 and −3","3 and 5"], ans:"A" },
  { id:15, domain:"geometry",   topic:"Perimeter & Area",  prompt:"A rectangle is 14 cm wide and 9 cm tall. What is its perimeter?",                               opts:["23 cm","46 cm","126 cm","94 cm"],      ans:"B" },
  { id:16, domain:"data",       topic:"Combinations",      prompt:"In how many ways can a committee of 3 be chosen from 7 people?",                                opts:["21","35","42","210"],                   ans:"B" },
  { id:17, domain:"arithmetic", topic:"Decimals",          prompt:"0.6 × 0.04 = ?",                                                                                opts:["0.024","0.24","2.4","0.0024"],          ans:"A" },
  { id:18, domain:"algebra",    topic:"Word Problems",     prompt:"Amara paints a wall in 4 hours; Chidi in 6 hours. Working together, how long?",                 opts:["2h 24m","3h","2h","5h"],               ans:"A" },
  { id:19, domain:"geometry",   topic:"Volume",            prompt:"A cylinder with radius 5 and height 10 has volume (π ≈ 3.14):",                                opts:["157","314","785","1570"],               ans:"C" },
  { id:20, domain:"data",       topic:"Data Interpretation",prompt:"Monthly sales: Jan 120k, Feb 95k, Mar 140k, Apr 110k. What is the average (₦k)?",             opts:["105","111.25","115","120"],             ans:"B" },
];

const TOTAL_SEC = 35 * 60;
const LETTERS = ["A","B","C","D"];

function fmt(s: number) {
  return `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;
}

export default function SimulationPage() {
  const [phase, setPhase]     = useState<Phase>("pre");
  const [idx, setIdx]         = useState(0);
  const [answers, setAnswers] = useState<Record<number,string>>({});
  const [picked, setPicked]   = useState<string|null>(null);
  const [timeLeft, setTime]   = useState(TOTAL_SEC);
  const timer = useRef<ReturnType<typeof setInterval>|null>(null);

  const startSim = () => {
    setPhase("active"); setIdx(0); setAnswers({}); setPicked(null); setTime(TOTAL_SEC);
    timer.current = setInterval(() => {
      setTime(t => { if (t <= 1) { clearInterval(timer.current!); setPhase("done"); return 0; } return t - 1; });
    }, 1000);
  };

  const advance = (ans: Record<number,string>) => {
    if (idx === SIM_Q.length - 1) { clearInterval(timer.current!); setPhase("done"); }
    else { setIdx(idx + 1); setPicked(null); }
    setAnswers(ans);
  };

  useEffect(() => () => { if (timer.current) clearInterval(timer.current); }, []);

  const q        = SIM_Q[idx];
  const urgency  = timeLeft < 300;
  const pct      = ((TOTAL_SEC - timeLeft) / TOTAL_SEC) * 100;
  const correct  = SIM_Q.filter((q, i) => answers[i] === q.ans).length;
  const scorePct = Math.round((correct / SIM_Q.length) * 100);

  const domainScores: Record<string, { c: number; t: number }> = {};
  SIM_Q.forEach((q, i) => {
    if (!domainScores[q.domain]) domainScores[q.domain] = { c: 0, t: 0 };
    domainScores[q.domain].t++;
    if (answers[i] === q.ans) domainScores[q.domain].c++;
  });

  /* PRE */
  if (phase === "pre") return (
    <div style={{ background: T.ink, minHeight: "100%", padding: "64px 22px 100px", color: T.paper, position: "relative" }}>
      <div style={{ fontFamily: T.mono, fontSize: 10, color: "rgba(250,250,248,0.5)", textTransform: "uppercase", letterSpacing: 1.4 }}>gre simulation · full section</div>
      <div style={{ fontFamily: T.serif, fontSize: 44, letterSpacing: -1.2, lineHeight: 0.95, marginTop: 14 }}>
        20 questions.<br/><span style={{ fontStyle: "italic", color: T.terracotta }}>35 minutes.</span><br/>No hints.
      </div>
      <div style={{ fontFamily: T.serif, fontSize: 15, fontStyle: "italic", color: "rgba(250,250,248,0.75)", lineHeight: 1.45, marginTop: 24 }}>
        This replicates the actual GRE Quantitative section. No Timi. No explanations mid-section. The clock starts when you tap.
      </div>
      <div style={{ marginTop: 30, display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 10 }}>
        {[{ k:"20",l:"questions"},{k:"35m",l:"timed"},{k:"4",l:"domains"},{k:"no",l:"hints"}].map(s => (
          <div key={s.l} style={{ padding: "12px 14px", border: "1px solid rgba(250,250,248,0.18)" }}>
            <div style={{ fontFamily: T.serif, fontSize: 28, letterSpacing: -0.6, lineHeight: 1 }}>{s.k}</div>
            <div style={{ fontFamily: T.mono, fontSize: 9, color: "rgba(250,250,248,0.5)", marginTop: 4, textTransform: "uppercase", letterSpacing: 1.4 }}>{s.l}</div>
          </div>
        ))}
      </div>
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, padding: "12px 22px 28px", borderTop: "1px solid rgba(250,250,248,0.12)", background: T.ink, zIndex: 10 }}>
        <button onClick={startSim} style={{ width: "100%", padding: "16px", background: T.terracotta, color: T.paper, border: "none", fontFamily: T.serif, fontSize: 20, letterSpacing: -0.3, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>Start simulation</span>
          <span style={{ fontFamily: T.mono, fontSize: 11, letterSpacing: 1.2, textTransform: "uppercase" }}>clock starts →</span>
        </button>
      </div>
    </div>
  );

  /* RESULTS */
  if (phase === "done") {
    const grade = scorePct >= 80 ? "strong" : scorePct >= 60 ? "developing" : "needs work";
    const gradeColor = scorePct >= 80 ? T.sage : scorePct >= 60 ? T.ink : T.terracotta;
    return (
      <div style={{ background: T.paper, minHeight: "100%", paddingBottom: 100 }}>
        <div style={{ padding: "60px 22px 22px", background: T.ink, color: T.paper }}>
          <div style={{ fontFamily: T.mono, fontSize: 10, color: "rgba(250,250,248,0.5)", textTransform: "uppercase", letterSpacing: 1.4 }}>simulation complete</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginTop: 10 }}>
            <div style={{ fontFamily: T.serif, fontSize: 80, letterSpacing: -3, lineHeight: 0.9, color: gradeColor }}>{scorePct}</div>
            <div style={{ fontFamily: T.serif, fontSize: 24, color: "rgba(250,250,248,0.7)" }}>%</div>
          </div>
          <div style={{ fontFamily: T.mono, fontSize: 10, color: gradeColor, textTransform: "uppercase", letterSpacing: 1.4, marginTop: 6 }}>
            {grade} · {correct}/{SIM_Q.length} correct
          </div>
          <div style={{ fontFamily: T.serif, fontSize: 14, fontStyle: "italic", color: "rgba(250,250,248,0.8)", marginTop: 10, lineHeight: 1.35 }}>
            {scorePct >= 80 ? "This is what we practised for. Keep the consistency." : scorePct >= 60 ? "Solid foundation. The domain breakdown shows where to push next." : "The data is useful. We know exactly where to focus now."}
          </div>
        </div>

        <div style={{ padding: "22px 22px 0" }}>
          <div style={{ fontFamily: T.mono, fontSize: 10, color: T.ash, textTransform: "uppercase", letterSpacing: 1.4, marginBottom: 12 }}>by domain</div>
          {Object.entries(domainScores).map(([dom, s]) => {
            const dp = Math.round((s.c / s.t) * 100);
            return (
              <div key={dom} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <div style={{ fontFamily: T.serif, fontSize: 16, color: T.ink, letterSpacing: -0.2 }}>{dom}</div>
                  <div style={{ fontFamily: T.mono, fontSize: 11, color: T.ash }}>{s.c}/{s.t} · {dp}%</div>
                </div>
                <div style={{ height: 4, background: T.hairline }}>
                  <div style={{ height: "100%", width: `${dp}%`, background: dp < 50 ? T.terracotta : T.ink }} />
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ padding: "22px 22px 0", display: "flex", flexDirection: "column", gap: 8 }}>
          <button onClick={() => { setPhase("pre"); setAnswers({}); setPicked(null); setTime(TOTAL_SEC); }} style={{ padding: "13px", background: "transparent", border: `1px solid ${T.line}`, fontFamily: T.mono, fontSize: 10, color: T.ash, textTransform: "uppercase", letterSpacing: 1.4, cursor: "pointer" }}>
            ↺ run another simulation
          </button>
        </div>
      </div>
    );
  }

  /* ACTIVE */
  return (
    <div style={{ background: T.paper, minHeight: "100%", paddingBottom: 110, position: "relative" }}>
      {/* Progress bar */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 3, background: T.hairline, zIndex: 20 }}>
        <div style={{ height: "100%", width: `${pct}%`, background: urgency ? T.terracotta : T.ink, transition: "width 1s linear" }} />
      </div>

      {/* Chrome */}
      <div style={{ padding: "56px 18px 12px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${T.hairline}` }}>
        <div style={{ fontFamily: T.mono, fontSize: 10, color: T.ash, textTransform: "uppercase", letterSpacing: 1.4 }}>sim · q{idx+1}/{SIM_Q.length}</div>
        <div style={{ fontFamily: T.mono, fontSize: 14, color: urgency ? T.terracotta : T.ink, letterSpacing: 1, fontWeight: 500 }}>{fmt(timeLeft)}</div>
        <div style={{ fontFamily: T.mono, fontSize: 10, color: T.ash, textTransform: "uppercase", letterSpacing: 1.4 }}>{q.domain}</div>
      </div>

      {/* Dot progress */}
      <div style={{ padding: "10px 18px", display: "flex", flexWrap: "wrap", gap: 4 }}>
        {SIM_Q.map((_, i) => (
          <div key={i} style={{ width: 10, height: 10, background: i === idx ? T.terracotta : answers[i] ? T.ink : T.hairline }} />
        ))}
      </div>

      {/* Question */}
      <div style={{ padding: "12px 18px 0" }}>
        <div style={{ fontFamily: T.mono, fontSize: 9, color: T.terracotta, textTransform: "uppercase", letterSpacing: 1.4, marginBottom: 6 }}>{q.topic}</div>
        <div style={{ fontFamily: T.serif, fontSize: 20, color: T.ink, letterSpacing: -0.3, lineHeight: 1.35 }}>{q.prompt}</div>
      </div>

      {/* Options */}
      <div style={{ padding: "16px 18px 0", display: "flex", flexDirection: "column", gap: 8 }}>
        {q.opts.map((o, i) => {
          const letter = LETTERS[i];
          const sel = picked === letter;
          return (
            <div key={letter} onClick={() => setPicked(letter)} style={{ padding: "13px 16px", cursor: "pointer", display: "flex", gap: 14, alignItems: "center", background: sel ? T.ink : T.paper, color: sel ? T.paper : T.ink, border: `1px solid ${sel ? T.ink : T.hairline}` }}>
              <span style={{ fontFamily: T.mono, fontSize: 10, opacity: 0.7, letterSpacing: 1 }}>{letter}</span>
              <span style={{ fontFamily: T.serif, fontSize: 17, letterSpacing: -0.1 }}>{o}</span>
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, padding: "12px 18px 28px", background: T.paper, borderTop: `1px solid ${T.hairline}`, display: "flex", gap: 8, zIndex: 10 }}>
        <button onClick={() => advance(answers)} style={{ padding: "13px 16px", background: "transparent", border: `1px solid ${T.line}`, fontFamily: T.mono, fontSize: 10, color: T.ash, textTransform: "uppercase", letterSpacing: 1.4, cursor: "pointer" }}>skip</button>
        <button onClick={() => picked && advance({ ...answers, [idx]: picked })} disabled={!picked} style={{ flex: 1, padding: "13px", border: "none", background: picked ? T.ink : T.hairline, color: picked ? T.paper : T.mist, fontFamily: T.serif, fontSize: 17, letterSpacing: -0.2, cursor: picked ? "pointer" : "default", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>{idx === SIM_Q.length - 1 ? "Submit all" : "Next"}</span>
          <span style={{ fontStyle: "italic", color: T.terracotta }}>→</span>
        </button>
      </div>
    </div>
  );
}
