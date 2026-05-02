import { T } from "@/lib/tokens";

export default function DiagnosticPage() {
  return (
    <div style={{ background: T.paper, minHeight: "100%", padding: "64px 22px 100px" }}>
      <div style={{ fontFamily: T.mono, fontSize: 9, color: T.ash, textTransform: "uppercase", letterSpacing: 1.6, marginBottom: 10 }}>
        Diagnostic
      </div>
      <div style={{ fontFamily: T.serif, fontSize: 32, color: T.ink, letterSpacing: -0.7, lineHeight: 1.05 }}>
        Let&rsquo;s see where{" "}
        <span style={{ fontStyle: "italic", color: T.terracotta }}>you&rsquo;re at</span>.
      </div>
      <div style={{ marginTop: 16, fontFamily: T.serif, fontSize: 16, color: T.ash, lineHeight: 1.5 }}>
        Diagnostic coming soon.
      </div>
    </div>
  );
}
