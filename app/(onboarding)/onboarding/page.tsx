"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { T } from "@/lib/tokens";

const DISCLAIMER = `InTIMIdated by Math is not affiliated with, endorsed by, or approved by ETS or the GRE programme. It is an independent study tool created by Timi for personal GRE preparation. No score improvement is guaranteed. The creator is not liable for any exam outcome. Some content is AI-generated. Please use this alongside official ETS materials.`;

// ─── Layout shell ────────────────────────────────────────────────────────────

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        minHeight: "100dvh",
        background: T.cream,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          background: T.paper,
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {children}
      </div>
    </div>
  );
}

function Wordmark() {
  return (
    <div style={{ padding: "32px 22px 0" }}>
      <div
        style={{
          fontFamily: T.serif,
          fontSize: 22,
          color: T.ink,
          letterSpacing: -0.6,
          lineHeight: 1,
        }}
      >
        In
        <span
          style={{ fontStyle: "italic", fontWeight: 700, color: T.terracotta }}
        >
          TIMI
        </span>
        dated
      </div>
      <div
        style={{
          fontFamily: T.mono,
          fontSize: 9,
          color: T.ash,
          textTransform: "uppercase",
          letterSpacing: 2,
          marginTop: 5,
        }}
      >
        by&nbsp;math.
      </div>
    </div>
  );
}

function BackButton({ onBack }: { onBack: () => void }) {
  return (
    <button
      onClick={onBack}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        fontFamily: T.mono,
        fontSize: 18,
        color: T.ash,
        padding: "32px 22px 0",
        alignSelf: "flex-start",
        lineHeight: 1,
      }}
      aria-label="Go back"
    >
      ←
    </button>
  );
}

// ─── Step 1: Disclaimer ──────────────────────────────────────────────────────

function StepDisclaimer({ onAccept }: { onAccept: () => void }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [atBottom, setAtBottom] = useState(false);

  function handleScroll() {
    const el = scrollRef.current;
    if (!el) return;
    const reached = el.scrollHeight - el.scrollTop - el.clientHeight < 12;
    if (reached) setAtBottom(true);
  }

  const active = atBottom;

  return (
    <Shell>
      <Wordmark />

      <div style={{ padding: "28px 22px 0" }}>
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
          Before you begin
        </div>
        <div
          style={{
            fontFamily: T.serif,
            fontSize: 28,
            color: T.ink,
            letterSpacing: -0.6,
            lineHeight: 1.05,
          }}
        >
          A quick{" "}
          <span style={{ fontStyle: "italic", color: T.terracotta }}>
            disclaimer
          </span>
          .
        </div>
      </div>

      {/* Scrollable disclaimer box */}
      <div
        style={{
          margin: "20px 22px 0",
          border: `1px solid ${T.hairline}`,
          flex: 1,
          minHeight: 0,
          maxHeight: 260,
          overflowY: "scroll",
          padding: "16px",
          background: T.cream,
        }}
        ref={scrollRef}
        onScroll={handleScroll}
      >
        {DISCLAIMER.split(". ").map((sentence, i, arr) => (
          <p
            key={i}
            style={{
              fontFamily: T.serif,
              fontSize: 16,
              color: T.ink,
              lineHeight: 1.55,
              letterSpacing: -0.1,
              marginBottom: i < arr.length - 1 ? 14 : 0,
            }}
          >
            {sentence.endsWith(".") ? sentence : sentence + "."}
          </p>
        ))}

        {/* Sentinel — reaching this means user has scrolled to bottom */}
        <div style={{ height: 1 }} aria-hidden />
      </div>

      {!atBottom && (
        <div
          style={{
            margin: "8px 22px 0",
            fontFamily: T.mono,
            fontSize: 9,
            color: T.mist,
            textTransform: "uppercase",
            letterSpacing: 1.2,
            textAlign: "center",
          }}
        >
          scroll to read all ↓
        </div>
      )}

      {/* Accept button */}
      <div style={{ padding: "16px 22px 0" }}>
        <button
          onClick={onAccept}
          disabled={!active}
          style={{
            width: "100%",
            padding: "16px",
            background: active ? T.ink : T.hairline,
            color: active ? T.paper : T.mist,
            border: "none",
            fontFamily: T.serif,
            fontSize: 17,
            letterSpacing: -0.2,
            cursor: active ? "pointer" : "default",
            transition: "background 200ms, color 200ms",
          }}
        >
          I Accept
        </button>
      </div>

      {/* Fallback */}
      <div style={{ padding: "12px 22px 32px", textAlign: "center" }}>
        <button
          onClick={onAccept}
          style={{
            background: "none",
            border: "none",
            fontFamily: T.mono,
            fontSize: 9,
            color: T.mist,
            textTransform: "uppercase",
            letterSpacing: 1.2,
            cursor: "pointer",
            textDecoration: "underline",
          }}
        >
          I&rsquo;ve read it — let me through
        </button>
      </div>
    </Shell>
  );
}

// ─── Step 2: Name ─────────────────────────────────────────────────────────────

function StepName({
  initial,
  onBack,
  onContinue,
}: {
  initial: string;
  onBack: () => void;
  onContinue: (name: string) => void;
}) {
  const [name, setName] = useState(initial);

  return (
    <Shell>
      <BackButton onBack={onBack} />

      <div style={{ padding: "24px 22px 0" }}>
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
          Step 2 of 3
        </div>
        <div
          style={{
            fontFamily: T.serif,
            fontSize: 32,
            color: T.ink,
            letterSpacing: -0.7,
            lineHeight: 1.05,
          }}
        >
          What should we{" "}
          <span style={{ fontStyle: "italic", color: T.terracotta }}>
            call you?
          </span>
        </div>
      </div>

      <div style={{ padding: "28px 22px 0" }}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          autoFocus
          style={{
            width: "100%",
            padding: "14px 16px",
            border: `1px solid ${T.line}`,
            background: T.paper,
            fontFamily: T.serif,
            fontSize: 22,
            color: T.ink,
            letterSpacing: -0.3,
            outline: "none",
          }}
        />
      </div>

      <div style={{ padding: "16px 22px 0" }}>
        <button
          onClick={() => onContinue(name.trim())}
          disabled={!name.trim()}
          style={{
            width: "100%",
            padding: "16px",
            background: name.trim() ? T.ink : T.hairline,
            color: name.trim() ? T.paper : T.mist,
            border: "none",
            fontFamily: T.serif,
            fontSize: 17,
            letterSpacing: -0.2,
            cursor: name.trim() ? "pointer" : "default",
            transition: "background 200ms, color 200ms",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>Continue</span>
          {name.trim() && (
            <span style={{ fontStyle: "italic", color: T.terracotta }}>→</span>
          )}
        </button>
      </div>
    </Shell>
  );
}

// ─── Step 3: Exam date ────────────────────────────────────────────────────────

function StepDate({
  onBack,
  onFinish,
  saving,
}: {
  onBack: () => void;
  onFinish: (date: string | null) => void;
  saving: boolean;
}) {
  const [date, setDate] = useState("");

  // Min = today, max = 2 years from now
  const today = new Date().toISOString().slice(0, 10);
  const maxDate = new Date(Date.now() + 2 * 365 * 86400000)
    .toISOString()
    .slice(0, 10);

  return (
    <Shell>
      <BackButton onBack={onBack} />

      <div style={{ padding: "24px 22px 0" }}>
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
          Step 3 of 3
        </div>
        <div
          style={{
            fontFamily: T.serif,
            fontSize: 32,
            color: T.ink,
            letterSpacing: -0.7,
            lineHeight: 1.05,
          }}
        >
          When is your{" "}
          <span style={{ fontStyle: "italic", color: T.terracotta }}>GRE?</span>
        </div>
      </div>

      <div style={{ padding: "28px 22px 0" }}>
        <input
          type="date"
          value={date}
          min={today}
          max={maxDate}
          onChange={(e) => setDate(e.target.value)}
          style={{
            width: "100%",
            padding: "14px 16px",
            border: `1px solid ${T.line}`,
            background: T.paper,
            fontFamily: T.serif,
            fontSize: 22,
            color: date ? T.ink : T.ash,
            letterSpacing: -0.3,
            outline: "none",
          }}
        />
      </div>

      <div style={{ padding: "16px 22px 0" }}>
        <button
          onClick={() => onFinish(date || null)}
          disabled={saving || !date}
          style={{
            width: "100%",
            padding: "16px",
            background: date && !saving ? T.ink : T.hairline,
            color: date && !saving ? T.paper : T.mist,
            border: "none",
            fontFamily: T.serif,
            fontSize: 17,
            letterSpacing: -0.2,
            cursor: date && !saving ? "pointer" : "default",
            transition: "background 200ms, color 200ms",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>{saving ? "Saving…" : "Finish"}</span>
          {date && !saving && (
            <span style={{ fontStyle: "italic", color: T.terracotta }}>→</span>
          )}
        </button>
      </div>

      <div style={{ padding: "14px 22px 0", textAlign: "center" }}>
        <button
          onClick={() => !saving && onFinish(null)}
          disabled={saving}
          style={{
            background: "none",
            border: "none",
            fontFamily: T.mono,
            fontSize: 9,
            color: T.mist,
            textTransform: "uppercase",
            letterSpacing: 1.2,
            cursor: saving ? "default" : "pointer",
            textDecoration: "underline",
          }}
        >
          Skip for now
        </button>
      </div>
    </Shell>
  );
}

// ─── Orchestrator ─────────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const [step, setStep]     = useState<1 | 2 | 3>(1);
  const [name, setName]     = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState<string | null>(null);

  async function finish(greDate: string | null) {
    setSaving(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Save to profiles table
      const { error: dbError } = await supabase.from("profiles").upsert({
        id:                  user.id,
        name:                name || null,
        gre_date:            greDate || null,
        onboarding_complete: true,
        updated_at:          new Date().toISOString(),
      });
      if (dbError) throw dbError;

      // Mark onboarding complete in user metadata
      await supabase.auth.updateUser({
        data: { onboarding_complete: true },
      });

      // Set cookie so middleware lets this request through immediately
      // (user_metadata JWT refresh can lag one request behind)
      document.cookie =
        "itbm_onboarded=1; path=/; max-age=31536000; SameSite=Lax";

      window.location.href = "/diagnostic";
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setSaving(false);
    }
  }

  if (step === 1) {
    return <StepDisclaimer onAccept={() => setStep(2)} />;
  }

  if (step === 2) {
    return (
      <StepName
        initial={name}
        onBack={() => setStep(1)}
        onContinue={(n) => { setName(n); setStep(3); }}
      />
    );
  }

  return (
    <>
      <StepDate
        onBack={() => setStep(2)}
        onFinish={finish}
        saving={saving}
      />
      {error && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            left: "50%",
            transform: "translateX(-50%)",
            background: T.terracottaTint,
            border: `1px solid ${T.terracotta}`,
            padding: "12px 18px",
            fontFamily: T.mono,
            fontSize: 10,
            color: T.terracotta,
            textTransform: "uppercase",
            letterSpacing: 1.2,
            whiteSpace: "nowrap",
          }}
        >
          {error}
        </div>
      )}
    </>
  );
}
