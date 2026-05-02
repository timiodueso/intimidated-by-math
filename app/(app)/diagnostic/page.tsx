"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { T } from "@/lib/tokens";

// ─── Questions ───────────────────────────────────────────────────────────────

const QUESTIONS = [
  {
    domain:  "Arithmetic",
    text:    "A market trader buys 60 oranges for $12 and sells each for $0.30. What is her profit in dollars?",
    answer:  "6",
    hint:    "Revenue = 60 × $0.30 = $18. Profit = Revenue − Cost.",
  },
  {
    domain:  "Arithmetic",
    text:    "What is 35% of 180?",
    answer:  "63",
    hint:    "35% = 0.35. Multiply: 0.35 × 180.",
  },
  {
    domain:  "Algebra",
    text:    "If 4x + 3 = 19, what is x?",
    answer:  "4",
    hint:    "Subtract 3 from both sides, then divide by 4.",
  },
  {
    domain:  "Algebra",
    text:    "If 2x − y = 8 and x = 5, what is y?",
    answer:  "2",
    hint:    "Substitute x = 5: 10 − y = 8, so y = 2.",
  },
  {
    domain:  "Geometry",
    text:    "A rectangle is 9 m long and 4 m wide. What is its area in m²?",
    answer:  "36",
    hint:    "Area of a rectangle = length × width.",
  },
  {
    domain:  "Geometry",
    text:    "A triangle has base 8 and height 5. What is its area?",
    answer:  "20",
    hint:    "Area of a triangle = ½ × base × height.",
  },
  {
    domain:  "Data",
    text:    "The values 5, 8, 3, 7, 7 — what is the mean, rounded to the nearest whole number?",
    answer:  "6",
    hint:    "Sum = 30. Mean = 30 ÷ 5.",
  },
  {
    domain:  "Data",
    text:    "In a class of 40 students, 24 passed. What percentage passed?",
    answer:  "60",
    hint:    "Percentage = (24 ÷ 40) × 100.",
  },
] as const;

const DOMAINS = ["Arithmetic", "Algebra", "Geometry", "Data"] as const;
type Domain = (typeof DOMAINS)[number];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function checkAnswer(input: string, correct: string): boolean {
  return parseFloat(input.trim()) === parseFloat(correct);
}

function masteryFor(domain: Domain, results: boolean[]): 0 | 50 | 100 {
  const indices = QUESTIONS.reduce<number[]>(
    (acc, q, i) => (q.domain === domain ? [...acc, i] : acc),
    []
  );
  const correct = indices.filter((i) => results[i]).length;
  return (correct === 2 ? 100 : correct === 1 ? 50 : 0) as 0 | 50 | 100;
}

function timiMessage(total: number): string {
  if (total <= 2)
    return "Right. So we're starting from scratch. That's fine — at least we're being honest about it. Most people aren't.";
  if (total <= 4)
    return "Some of this you know. Some of it you're guessing at. We'll fix the guessing parts first.";
  if (total <= 6)
    return "Decent foundation. A few weak spots we both noticed. Those come first.";
  return "Strong start. Don't let it fool you — the GRE will find the cracks. We'll get there before it does.";
}

// ─── Quiz ─────────────────────────────────────────────────────────────────────

function QuizPhase({
  onDone,
}: {
  onDone: (results: boolean[]) => void;
}) {
  const [current,   setCurrent]   = useState(0);
  const [answer,    setAnswer]    = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [results,   setResults]   = useState<boolean[]>([]);

  const q       = QUESTIONS[current];
  const isLast  = current === QUESTIONS.length - 1;
  const correct = submitted ? checkAnswer(answer, q.answer) : false;

  function submit() {
    if (!answer.trim() || submitted) return;
    setSubmitted(true);
    setResults((r) => [...r, checkAnswer(answer, q.answer)]);
  }

  function next() {
    if (isLast) {
      onDone([...results]);
    } else {
      setCurrent((c) => c + 1);
      setAnswer("");
      setSubmitted(false);
    }
  }

  return (
    <div
      style={{
        background: T.paper,
        minHeight: "100%",
        paddingBottom: 110,
        position: "relative",
      }}
    >
      {/* Top bar */}
      <div
        style={{
          padding: "56px 18px 14px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          borderBottom: `1px solid ${T.hairline}`,
        }}
      >
        <div style={{ fontFamily: T.mono, fontSize: 10, color: T.ash, letterSpacing: 1, textTransform: "uppercase", flexShrink: 0 }}>
          diagnostic
        </div>
        <div style={{ flex: 1, display: "flex", gap: 3 }}>
          {QUESTIONS.map((_, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: 3,
                background:
                  i < current
                    ? T.ink
                    : i === current
                    ? T.terracotta
                    : T.hairline,
              }}
            />
          ))}
        </div>
        <div
          style={{
            fontFamily: T.mono,
            fontSize: 10,
            color: T.ash,
            letterSpacing: 1,
            textTransform: "uppercase",
            flexShrink: 0,
          }}
        >
          {current + 1}/{QUESTIONS.length}
        </div>
      </div>

      {/* Domain label */}
      <div style={{ padding: "16px 22px 0" }}>
        <div
          style={{
            fontFamily: T.mono,
            fontSize: 9,
            color: T.terracotta,
            textTransform: "uppercase",
            letterSpacing: 1.4,
          }}
        >
          {q.domain}
        </div>
      </div>

      {/* Question */}
      <div style={{ padding: "12px 22px 0" }}>
        <div
          style={{
            fontFamily: T.serif,
            fontSize: 22,
            color: T.ink,
            letterSpacing: -0.3,
            lineHeight: 1.35,
          }}
        >
          {q.text}
        </div>
      </div>

      {/* Answer input */}
      {!submitted && (
        <div style={{ padding: "20px 22px 0" }}>
          <input
            type="text"
            inputMode="decimal"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="Your answer"
            autoFocus
            style={{
              width: "100%",
              padding: "14px 16px",
              border: `1px solid ${T.line}`,
              background: T.paper,
              fontFamily: T.serif,
              fontSize: 24,
              color: T.ink,
              letterSpacing: -0.3,
              outline: "none",
            }}
          />
        </div>
      )}

      {/* Feedback */}
      {submitted && (
        <div style={{ padding: "20px 22px 0", display: "flex", flexDirection: "column", gap: 10 }}>
          {/* Answer reveal */}
          <div
            style={{
              padding: "14px 16px",
              background: correct ? "#E8F0E3" : T.terracottaTint,
              border: `1px solid ${correct ? T.sage : T.terracotta}`,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <span
              style={{
                fontFamily: T.mono,
                fontSize: 10,
                color: correct ? T.sage : T.terracotta,
                textTransform: "uppercase",
                letterSpacing: 1.2,
                flexShrink: 0,
              }}
            >
              {correct ? "✓ correct" : "✕ wrong"}
            </span>
            {!correct && (
              <span
                style={{
                  fontFamily: T.serif,
                  fontSize: 15,
                  color: T.ink,
                  letterSpacing: -0.1,
                }}
              >
                Answer: <strong>{q.answer}</strong>
              </span>
            )}
          </div>

          {/* Hint */}
          <div
            style={{
              padding: "12px 14px",
              background: T.cream,
              border: `1px solid ${T.hairline}`,
              fontFamily: T.serif,
              fontSize: 15,
              color: T.ash,
              fontStyle: "italic",
              lineHeight: 1.45,
            }}
          >
            {q.hint}
          </div>
        </div>
      )}

      {/* Fixed bottom bar */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: T.paper,
          borderTop: `1px solid ${T.hairline}`,
          padding: "14px 18px 32px",
          zIndex: 60,
        }}
      >
        {!submitted ? (
          <button
            onClick={submit}
            disabled={!answer.trim()}
            style={{
              width: "100%",
              padding: "16px",
              background: answer.trim() ? T.ink : T.hairline,
              color: answer.trim() ? T.paper : T.mist,
              border: "none",
              fontFamily: T.serif,
              fontSize: 17,
              letterSpacing: -0.2,
              cursor: answer.trim() ? "pointer" : "default",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              transition: "background 150ms, color 150ms",
            }}
          >
            <span>Go</span>
            {answer.trim() && (
              <span style={{ fontStyle: "italic", color: T.terracotta }}>→</span>
            )}
          </button>
        ) : (
          <button
            onClick={next}
            style={{
              width: "100%",
              padding: "16px",
              background: T.ink,
              color: T.paper,
              border: "none",
              fontFamily: T.serif,
              fontSize: 17,
              letterSpacing: -0.2,
              cursor: "pointer",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>{isLast ? "See results" : "Next question"}</span>
            <span style={{ fontStyle: "italic", color: T.terracotta }}>→</span>
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Results ──────────────────────────────────────────────────────────────────

function ResultsPhase({ results }: { results: boolean[] }) {
  const router  = useRouter();
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState<string | null>(null);
  const [saved,  setSaved]  = useState(false);

  const totalCorrect = results.filter(Boolean).length;

  const domainMastery = DOMAINS.map((domain) => ({
    domain,
    mastery: masteryFor(domain, results),
  }));

  const weak   = domainMastery.filter((d) => d.mastery < 100);
  const strong = domainMastery.filter((d) => d.mastery === 100);

  async function saveAndProceed() {
    setSaving(true);
    setError(null);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Save domain mastery to topic_progress
      const rows = domainMastery.map(({ domain, mastery }) => ({
        user_id:    user.id,
        domain,
        mastery,
        source:     "diagnostic",
        updated_at: new Date().toISOString(),
      }));

      const { error: progressError } = await supabase
        .from("topic_progress")
        .upsert(rows, { onConflict: "user_id,domain" });
      if (progressError) throw progressError;

      // Mark diagnostic complete on profile
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ diagnostic_complete: true, updated_at: new Date().toISOString() })
        .eq("id", user.id);
      if (profileError) throw profileError;

      // Update user metadata + set cookie for proxy fast-path
      await supabase.auth.updateUser({ data: { diagnostic_complete: true } });
      document.cookie = "itbm_diagnosed=1; path=/; max-age=31536000; SameSite=Lax";

      setSaved(true);
      window.location.href = "/home";
    } catch (e) {
      const msg =
        e instanceof Error
          ? e.message
          : (e as { message?: string })?.message ?? "Something went wrong";
      setError(msg);
      setSaving(false);
    }
  }

  return (
    <div
      style={{
        background: T.paper,
        minHeight: "100%",
        paddingBottom: 110,
      }}
    >
      {/* Header */}
      <div style={{ padding: "56px 22px 0" }}>
        <div
          style={{
            fontFamily: T.mono,
            fontSize: 9,
            color: T.ash,
            textTransform: "uppercase",
            letterSpacing: 1.6,
            marginBottom: 10,
          }}
        >
          Diagnostic complete · {totalCorrect}/{QUESTIONS.length} correct
        </div>
        <div
          style={{
            fontFamily: T.serif,
            fontSize: 30,
            color: T.ink,
            letterSpacing: -0.6,
            lineHeight: 1.05,
          }}
        >
          Here&rsquo;s where{" "}
          <span style={{ fontStyle: "italic", color: T.terracotta }}>
            you stand
          </span>
          .
        </div>
      </div>

      {/* Domain mastery grid */}
      <div
        style={{
          margin: "24px 22px 0",
          border: `1px solid ${T.hairline}`,
        }}
      >
        {domainMastery.map(({ domain, mastery }, i) => (
          <div
            key={domain}
            style={{
              padding: "14px 16px",
              borderBottom:
                i < domainMastery.length - 1
                  ? `1px solid ${T.hairline}`
                  : "none",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            {/* Domain */}
            <div
              style={{
                fontFamily: T.serif,
                fontSize: 16,
                color: T.ink,
                letterSpacing: -0.2,
                width: 90,
                flexShrink: 0,
              }}
            >
              {domain}
            </div>

            {/* Bar */}
            <div
              style={{
                flex: 1,
                height: 4,
                background: T.hairline,
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  height: "100%",
                  width: `${mastery}%`,
                  background:
                    mastery === 100
                      ? T.sage
                      : mastery === 50
                      ? T.terracotta
                      : T.mist,
                  transition: "width 600ms ease",
                }}
              />
            </div>

            {/* Label */}
            <div
              style={{
                fontFamily: T.mono,
                fontSize: 9,
                textTransform: "uppercase",
                letterSpacing: 1.2,
                width: 52,
                textAlign: "right",
                flexShrink: 0,
                color:
                  mastery === 100
                    ? T.sage
                    : mastery === 50
                    ? T.terracotta
                    : T.mist,
              }}
            >
              {mastery === 100 ? "strong" : mastery === 50 ? "shaky" : "weak"}
            </div>
          </div>
        ))}
      </div>

      {/* Weak / strong summary */}
      {(weak.length > 0 || strong.length > 0) && (
        <div
          style={{
            margin: "16px 22px 0",
            display: "grid",
            gridTemplateColumns: strong.length > 0 && weak.length > 0 ? "1fr 1fr" : "1fr",
            gap: 8,
          }}
        >
          {weak.length > 0 && (
            <div
              style={{
                padding: "12px 14px",
                background: T.terracottaTint,
                border: `1px solid ${T.terracotta}`,
              }}
            >
              <div
                style={{
                  fontFamily: T.mono,
                  fontSize: 8,
                  color: T.terracotta,
                  textTransform: "uppercase",
                  letterSpacing: 1.4,
                  marginBottom: 6,
                }}
              >
                Focus here
              </div>
              {weak.map(({ domain }) => (
                <div
                  key={domain}
                  style={{
                    fontFamily: T.serif,
                    fontSize: 14,
                    color: T.ink,
                    letterSpacing: -0.1,
                    lineHeight: 1.5,
                  }}
                >
                  {domain}
                </div>
              ))}
            </div>
          )}
          {strong.length > 0 && (
            <div
              style={{
                padding: "12px 14px",
                background: "#E8F0E3",
                border: `1px solid ${T.sage}`,
              }}
            >
              <div
                style={{
                  fontFamily: T.mono,
                  fontSize: 8,
                  color: T.sage,
                  textTransform: "uppercase",
                  letterSpacing: 1.4,
                  marginBottom: 6,
                }}
              >
                Solid
              </div>
              {strong.map(({ domain }) => (
                <div
                  key={domain}
                  style={{
                    fontFamily: T.serif,
                    fontSize: 14,
                    color: T.ink,
                    letterSpacing: -0.1,
                    lineHeight: 1.5,
                  }}
                >
                  {domain}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Timi says */}
      <div
        style={{
          margin: "16px 22px 0",
          padding: "14px 16px",
          background: T.ink,
          color: T.paper,
        }}
      >
        <div
          style={{
            fontFamily: T.mono,
            fontSize: 9,
            color: "rgba(250,250,248,0.45)",
            textTransform: "uppercase",
            letterSpacing: 1.4,
            marginBottom: 6,
          }}
        >
          timi says
        </div>
        <div
          style={{
            fontFamily: T.serif,
            fontSize: 16,
            fontStyle: "italic",
            lineHeight: 1.45,
          }}
        >
          {timiMessage(totalCorrect)}
        </div>
      </div>

      {error && (
        <div
          style={{
            margin: "12px 22px 0",
            padding: "10px 14px",
            background: T.terracottaTint,
            border: `1px solid ${T.terracotta}`,
            fontFamily: T.mono,
            fontSize: 9,
            color: T.terracotta,
            textTransform: "uppercase",
            letterSpacing: 1.2,
          }}
        >
          {error}
        </div>
      )}

      {/* CTA */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: T.paper,
          borderTop: `1px solid ${T.hairline}`,
          padding: "14px 18px 32px",
          zIndex: 60,
        }}
      >
        <button
          onClick={saveAndProceed}
          disabled={saving || saved}
          style={{
            width: "100%",
            padding: "16px",
            background: saving || saved ? T.hairline : T.ink,
            color: saving || saved ? T.mist : T.paper,
            border: "none",
            fontFamily: T.serif,
            fontSize: 17,
            letterSpacing: -0.2,
            cursor: saving || saved ? "default" : "pointer",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>{saving ? "Saving…" : "Let's get to work"}</span>
          {!saving && !saved && (
            <span style={{ fontStyle: "italic", color: T.terracotta }}>→</span>
          )}
        </button>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DiagnosticPage() {
  const [phase,   setPhase]   = useState<"quiz" | "results">("quiz");
  const [results, setResults] = useState<boolean[]>([]);

  function handleDone(r: boolean[]) {
    setResults(r);
    setPhase("results");
  }

  if (phase === "results") {
    return <ResultsPhase results={results} />;
  }

  return <QuizPhase onDone={handleDone} />;
}
