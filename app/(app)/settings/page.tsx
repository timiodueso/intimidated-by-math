"use client";

import { useState } from "react";
import { T } from "@/lib/tokens";

export default function SettingsPage() {
  const [name, setName]           = useState("Timi");
  const [date, setDate]           = useState("2026-06-04");
  const [city, setCity]           = useState("Lagos");
  const [voice, setVoice]         = useState("sarcastic");
  const [confirmReset, setConfirm] = useState(false);

  const daysLeft = Math.max(0, Math.round((new Date(date).getTime() - Date.now()) / 86400000));

  return (
    <div style={{ background: T.paper, minHeight: "100%", paddingBottom: 100 }}>
      {/* Header */}
      <div style={{ padding: "64px 22px 18px", borderBottom: `1px solid ${T.hairline}` }}>
        <div style={{ fontFamily: T.mono, fontSize: 10, color: T.ash, textTransform: "uppercase", letterSpacing: 1.4 }}>settings</div>
        <div style={{ fontFamily: T.serif, fontSize: 36, color: T.ink, letterSpacing: -0.9, lineHeight: 1.02, marginTop: 8 }}>
          Your <span style={{ fontStyle: "italic" }}>setup</span>.
        </div>
      </div>

      {/* Identity */}
      <Section label="identity">
        <Row label="name" last={false}>
          <input value={name} onChange={e => setName(e.target.value)} style={{ border: "none", background: "transparent", textAlign: "right", fontFamily: T.serif, fontSize: 17, color: T.ink, letterSpacing: -0.2, outline: "none", width: 120 }} />
        </Row>
        <Row label="gre date" last={false}>
          <div style={{ textAlign: "right" }}>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{ border: "none", background: "transparent", textAlign: "right", fontFamily: T.serif, fontSize: 15, color: T.ink, outline: "none" }} />
            <div style={{ fontFamily: T.mono, fontSize: 9, color: T.ash, textTransform: "uppercase", letterSpacing: 1, marginTop: 2 }}>d-{daysLeft}</div>
          </div>
        </Row>
        <Row label="problem context" last={true}>
          <div style={{ display: "flex", gap: 6 }}>
            {["Lagos","Nairobi","Rotate"].map(c => (
              <button key={c} onClick={() => setCity(c)} style={{ padding: "4px 8px", background: city === c ? T.ink : "transparent", color: city === c ? T.paper : T.ash, border: `1px solid ${city === c ? T.ink : T.hairline}`, fontFamily: T.mono, fontSize: 9, textTransform: "uppercase", letterSpacing: 1.2, cursor: "pointer" }}>
                {c}
              </button>
            ))}
          </div>
        </Row>
      </Section>

      {/* Voice */}
      <Section label="timi's voice">
        {([
          { k: "mild",      s: '"Welcome back, Timi."' },
          { k: "neutral",   s: '"Welcome back."' },
          { k: "sarcastic", s: `"You're back. Good."` },
        ]).map((v, i, arr) => (
          <Row key={v.k} label={v.k} last={i === arr.length - 1}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ fontFamily: T.serif, fontSize: 13, fontStyle: "italic", color: T.ash }}>{v.s}</div>
              <button onClick={() => setVoice(v.k)} style={{ width: 18, height: 18, border: `1px solid ${T.ink}`, background: voice === v.k ? T.ink : T.paper, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
                {voice === v.k && <div style={{ width: 8, height: 8, background: T.paper }} />}
              </button>
            </div>
          </Row>
        ))}
      </Section>

      {/* Data */}
      <Section label="data">
        <Row label="export progress" last={false}>
          <div style={{ fontFamily: T.mono, fontSize: 10, color: T.ash, textTransform: "uppercase", letterSpacing: 1.2 }}>.json ↗</div>
        </Row>
        <Row label="total sessions" last={false}>
          <div style={{ fontFamily: T.serif, fontSize: 17, color: T.ink }}>38</div>
        </Row>
        <Row label="topics completed" last={true}>
          <div style={{ fontFamily: T.serif, fontSize: 17, color: T.ink }}>15 / 36</div>
        </Row>
      </Section>

      {/* Danger zone */}
      <Section label="danger zone">
        {!confirmReset ? (
          <Row label="reset all progress" last={true}>
            <button onClick={() => setConfirm(true)} style={{ fontFamily: T.mono, fontSize: 10, color: T.terracotta, textTransform: "uppercase", letterSpacing: 1.2, background: "none", border: "none", cursor: "pointer" }}>
              reset ✕
            </button>
          </Row>
        ) : (
          <div style={{ padding: "16px 18px", background: T.terracottaTint, border: `1px solid ${T.terracotta}` }}>
            <div style={{ fontFamily: T.serif, fontSize: 15, color: T.ink, fontStyle: "italic", lineHeight: 1.35 }}>
              This deletes your streak, XP, all topic progress and memes. It cannot be undone. Timi will not be sympathetic.
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <button onClick={() => setConfirm(false)} style={{ flex: 1, padding: "10px", background: "transparent", border: `1px solid ${T.line}`, fontFamily: T.mono, fontSize: 10, color: T.ash, textTransform: "uppercase", letterSpacing: 1.4, cursor: "pointer" }}>cancel</button>
              <button style={{ flex: 1, padding: "10px", background: T.terracotta, border: "none", fontFamily: T.mono, fontSize: 10, color: T.paper, textTransform: "uppercase", letterSpacing: 1.4, cursor: "pointer" }}>yes, reset</button>
            </div>
          </div>
        )}
      </Section>

      <div style={{ padding: "22px 22px 0" }}>
        <div style={{ fontFamily: T.mono, fontSize: 9, color: T.mist, textTransform: "uppercase", letterSpacing: 1.4, lineHeight: 1.8 }}>
          intimidated by math · v0.1.0<br/>
          not affiliated with ets<br/>
          built by timi · free forever<br/>
          <span style={{ color: T.terracotta }}>intimidated.app</span>
        </div>
      </div>
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginTop: 28 }}>
      <div style={{ padding: "0 22px 8px", fontFamily: T.mono, fontSize: 9, color: T.ash, textTransform: "uppercase", letterSpacing: 1.4 }}>{label}</div>
      <div style={{ borderTop: `1px solid ${T.hairline}`, borderBottom: `1px solid ${T.hairline}` }}>{children}</div>
    </div>
  );
}

function Row({ label, children, last }: { label: string; children: React.ReactNode; last: boolean }) {
  return (
    <div style={{ padding: "14px 22px", borderBottom: last ? "none" : `1px solid ${T.hairline}`, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
      <div style={{ fontFamily: T.serif, fontSize: 17, color: T.ink, letterSpacing: -0.2 }}>{label}</div>
      <div>{children}</div>
    </div>
  );
}
