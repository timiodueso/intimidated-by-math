"use client";

import { useState, useEffect, useCallback } from "react";
import { T } from "@/lib/tokens";

type Question = {
  topic: string;
  domain: string;
  city: string;
  prompt: string;
  options: { k: string; text: string; correct: boolean }[];
  hint: string;
  trap: { k: string; note: string };
  steps: { line: string; v: string }[];
};

// Shown immediately while the first API call is in flight
const SEED: Question = {
  topic: "Percentages", domain: "Arithmetic", city: "Lagos",
  prompt: "A fabric stall in Balogun Market buys ankara for ₦3,200 per yard and sells it for ₦4,000. What is the percent markup?",
  options: [
    { k: "A", text: "20%",  correct: false },
    { k: "B", text: "25%",  correct: true  },
    { k: "C", text: "80%",  correct: false },
    { k: "D", text: "125%", correct: false },
  ],
  hint: "Markup = (selling − cost) ÷ cost. The denominator is the cost, not the selling price.",
  trap: { k: "A", note: "20% is the discount, not the markup. Mixing up the denominator is the classic slip." },
  steps: [
    { line: "Cost:",        v: "₦3,200" },
    { line: "Selling:",     v: "₦4,000" },
    { line: "Markup in ₦:", v: "₦4,000 − ₦3,200 = ₦800" },
    { line: "As %:",        v: "₦800 ÷ ₦3,200 = 0.25 = 25%" },
  ],
};

const TOTAL = 5;

export default function SessionPage() {
  const [question,     setQuestion]  = useState<Question>(SEED);
  const [loading,      setLoading]   = useState(false);
  const [fetchError,   setFetchError] = useState<string | null>(null);
  const [qNum,         setQNum]      = useState(1);
  const [picked,       setPicked]    = useState<string | null>(null);
  const [submitted,    setSubmitted] = useState(false);
  const [hinted,       setHinted]    = useState(false);
  const [explainOpen,  setExplain]   = useState(false);

  const isCorrect = submitted && question.options.find(o => o.k === picked)?.correct;
  const isWrong   = submitted && !isCorrect;

  const fetchQuestion = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const res = await fetch("/api/question", { method: "POST" });
      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.error ?? "Failed to load question");
      setQuestion(json as Question);
    } catch (e) {
      setFetchError(e instanceof Error ? e.message : "Failed to load question");
    } finally {
      setLoading(false);
    }
  }, []);

  // Load first question from API on mount
  useEffect(() => { fetchQuestion(); }, [fetchQuestion]);

  const resetAnswer = () => {
    setPicked(null);
    setSubmitted(false);
    setHinted(false);
    setExplain(false);
  };

  const nextQuestion = () => {
    resetAnswer();
    setQNum(n => Math.min(n + 1, TOTAL));
    fetchQuestion();
  };

  return (
    <div style={{ background: T.paper, minHeight: "100%", paddingBottom: 110, position: "relative" }}>

      {/* Top bar */}
      <div style={{ padding: "56px 18px 14px", display: "flex", alignItems: "center", gap: 12, borderBottom: `1px solid ${T.hairline}` }}>
        <div style={{ fontFamily: T.mono, fontSize: 14, color: T.ash }}>×</div>
        <div style={{ flex: 1, display: "flex", gap: 3 }}>
          {Array.from({ length: TOTAL }, (_, i) => i + 1).map(n => (
            <div key={n} style={{ flex: 1, height: 3, background: n < qNum ? T.ink : n === qNum ? T.terracotta : T.hairline }} />
          ))}
        </div>
        <div style={{ fontFamily: T.mono, fontSize: 10, color: T.ash, letterSpacing: 1, textTransform: "uppercase" }}>
          q{qNum}/{TOTAL}
        </div>
      </div>

      {/* Loading overlay */}
      {loading && (
        <div style={{ padding: "40px 22px", textAlign: "center" }}>
          <div style={{ fontFamily: T.mono, fontSize: 10, color: T.ash, textTransform: "uppercase", letterSpacing: 1.4 }}>
            loading question...
          </div>
        </div>
      )}

      {/* Fetch error */}
      {!loading && fetchError && (
        <div style={{ margin: "24px 22px 0", padding: "16px", border: `1px solid ${T.terracotta}`, background: T.terracottaTint }}>
          <div style={{ fontFamily: T.mono, fontSize: 9, color: T.terracotta, textTransform: "uppercase", letterSpacing: 1.4 }}>error</div>
          <div style={{ fontFamily: T.serif, fontSize: 15, color: T.ink, fontStyle: "italic", marginTop: 4 }}>{fetchError}</div>
          <button
            onClick={fetchQuestion}
            style={{ marginTop: 12, padding: "10px 16px", background: "transparent", border: `1px solid ${T.line}`, fontFamily: T.mono, fontSize: 10, color: T.ash, textTransform: "uppercase", letterSpacing: 1.4, cursor: "pointer" }}
          >
            retry
          </button>
        </div>
      )}

      {/* Question content — shown when not loading */}
      {!loading && !fetchError && (
        <>
          {/* Meta */}
          <div style={{ padding: "16px 22px 0" }}>
            <div style={{ fontFamily: T.mono, fontSize: 10, color: T.ash, textTransform: "uppercase", letterSpacing: 1.4 }}>
              {question.domain} · {question.topic}
            </div>
            <div style={{ fontFamily: T.mono, fontSize: 9, color: T.terracotta, textTransform: "uppercase", letterSpacing: 1.4, marginTop: 3 }}>
              context · {question.city.toLowerCase()}
            </div>
          </div>

          {/* Prompt */}
          <div style={{ padding: "18px 22px 6px" }}>
            <div style={{ fontFamily: T.serif, fontSize: 22, color: T.ink, letterSpacing: -0.3, lineHeight: 1.3 }}>
              {question.prompt}
            </div>
          </div>

          {/* Hint */}
          {hinted && (
            <div style={{ margin: "12px 22px 0", padding: "12px 14px", background: T.terracottaTint, border: `1px solid ${T.terracotta}` }}>
              <div style={{ fontFamily: T.mono, fontSize: 9, color: T.terracotta, textTransform: "uppercase", letterSpacing: 1.4 }}>◉ hint · −10 xp</div>
              <div style={{ fontFamily: T.serif, fontSize: 15, color: T.ink, fontStyle: "italic", lineHeight: 1.35, marginTop: 6 }}>{question.hint}</div>
            </div>
          )}

          {/* Options */}
          <div style={{ padding: "18px 22px 0", display: "flex", flexDirection: "column", gap: 8 }}>
            {question.options.map(o => {
              const isPicked  = picked === o.k;
              const showGreen = submitted && o.correct;
              const showRed   = submitted && isPicked && !o.correct;
              const bg     = showGreen ? "#E8F0E3" : showRed ? T.terracottaTint : isPicked ? T.cream : T.paper;
              const border = showGreen ? T.sage     : showRed ? T.terracotta    : isPicked ? T.ink   : T.hairline;
              return (
                <div
                  key={o.k}
                  onClick={() => { if (!submitted) { setPicked(o.k); setSubmitted(true); } }}
                  style={{ padding: "16px", background: bg, border: `1px solid ${border}`, cursor: submitted ? "default" : "pointer", display: "flex", alignItems: "center", gap: 14 }}
                >
                  <div style={{ fontFamily: T.mono, fontSize: 11, width: 18, color: isPicked || showGreen ? T.ink : T.ash, letterSpacing: 1 }}>{o.k}</div>
                  <div style={{ fontFamily: T.serif, fontSize: 17, color: T.ink, flex: 1, letterSpacing: -0.2 }}>{o.text}</div>
                  {showGreen && <div style={{ fontFamily: T.mono, fontSize: 10, color: T.sage,       textTransform: "uppercase", letterSpacing: 1.2 }}>✓ correct</div>}
                  {showRed   && <div style={{ fontFamily: T.mono, fontSize: 10, color: T.terracotta, textTransform: "uppercase", letterSpacing: 1.2 }}>✕ trap</div>}
                </div>
              );
            })}
          </div>

          {/* Trap callout */}
          {isWrong && picked === question.trap.k && (
            <div style={{ margin: "14px 22px 0", padding: "12px 14px", border: `1px solid ${T.hairline}`, background: T.cream }}>
              <div style={{ fontFamily: T.mono, fontSize: 9, color: T.ash, textTransform: "uppercase", letterSpacing: 1.4 }}>trap · option {question.trap.k}</div>
              <div style={{ fontFamily: T.serif, fontSize: 13, color: T.ink, fontStyle: "italic", lineHeight: 1.35, marginTop: 4 }}>{question.trap.note}</div>
            </div>
          )}

          {/* Timi feedback */}
          {submitted && (
            <div style={{ margin: "14px 22px 0", padding: "14px 16px", background: isCorrect ? T.ink : T.paper, border: `1px solid ${isCorrect ? T.ink : T.hairline}`, color: isCorrect ? T.paper : T.ink }}>
              <div style={{ fontFamily: T.mono, fontSize: 9, color: isCorrect ? "rgba(250,250,248,0.55)" : T.terracotta, textTransform: "uppercase", letterSpacing: 1.4 }}>timi says</div>
              <div style={{ fontFamily: T.serif, fontSize: 16, fontStyle: "italic", marginTop: 4, lineHeight: 1.35 }}>
                {isCorrect ? "Correct. Keep that energy." : "Not quite. Check the worked solution below."}
              </div>
            </div>
          )}

          {/* Step-by-step accordion */}
          {submitted && (
            <div style={{ margin: "10px 22px 0", border: `1px solid ${T.hairline}` }}>
              <div onClick={() => setExplain(!explainOpen)} style={{ padding: "12px 14px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontFamily: T.mono, fontSize: 10, color: T.ash, textTransform: "uppercase", letterSpacing: 1.4 }}>step-by-step</span>
                <span style={{ fontFamily: T.mono, fontSize: 14, color: T.ink }}>{explainOpen ? "−" : "+"}</span>
              </div>
              {explainOpen && (
                <div style={{ padding: "0 14px 14px" }}>
                  {question.steps.map((s, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, padding: "8px 0", borderTop: `1px solid ${T.hairline}` }}>
                      <div style={{ fontFamily: T.mono, fontSize: 10, color: T.mist, width: 20 }}>0{i + 1}</div>
                      <div style={{ flex: 1, fontFamily: T.serif, fontSize: 14, color: T.ink }}>
                        {s.line} <span style={{ fontFamily: T.mono, fontSize: 13, color: T.terracotta }}>{s.v}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Bottom action bar */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: T.paper, borderTop: `1px solid ${T.hairline}`, padding: "14px 18px 32px", zIndex: 60 }}>
        {!submitted ? (
          <button
            onClick={() => setHinted(true)}
            disabled={hinted || loading}
            style={{ width: "100%", padding: "16px", background: "transparent", border: `1px solid ${T.line}`, fontFamily: T.mono, fontSize: 10, color: hinted || loading ? T.mist : T.ash, textTransform: "uppercase", letterSpacing: 1.4, cursor: hinted || loading ? "default" : "pointer" }}
          >
            {hinted ? "✓ hint shown" : "◉ hint"}
          </button>
        ) : (
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={resetAnswer}
              style={{ padding: "16px 20px", background: "transparent", border: `1px solid ${T.line}`, fontFamily: T.mono, fontSize: 10, color: T.ash, textTransform: "uppercase", letterSpacing: 1.4, cursor: "pointer", flexShrink: 0 }}
            >
              ↺ retry
            </button>
            <button
              onClick={nextQuestion}
              style={{ flex: 1, padding: "16px", background: T.ink, color: T.paper, border: "none", fontFamily: T.serif, fontSize: 17, letterSpacing: -0.2, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}
            >
              <span>{qNum < TOTAL ? "Next question" : "Finish session"}</span>
              <span style={{ fontStyle: "italic", color: T.terracotta }}>→ +{isCorrect ? (hinted ? 20 : 30) : 5} xp</span>
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
