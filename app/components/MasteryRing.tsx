import { T } from "@/lib/tokens";

interface MasteryRingProps {
  value?: number;
  size?: number;
  stroke?: number;
  label?: string;
  sub?: string;
  color?: string;
}

export default function MasteryRing({
  value = 0,
  size = 56,
  stroke = 4,
  label,
  sub,
  color,
}: MasteryRingProps) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = c * (value / 100);
  const col = color || T.terracotta;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <div style={{ position: "relative", width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={T.hairline} strokeWidth={stroke} />
          <circle
            cx={size / 2} cy={size / 2} r={r}
            fill="none" stroke={col} strokeWidth={stroke}
            strokeDasharray={`${dash} ${c - dash}`}
            strokeLinecap="round"
          />
        </svg>
        <div
          style={{
            position: "absolute", inset: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: T.mono, fontSize: size * 0.28, color: T.ink, fontWeight: 500,
          }}
        >
          {value}
        </div>
      </div>
      {label && (
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: T.sans, fontSize: 11, color: T.ink, fontWeight: 500, letterSpacing: 0.2 }}>
            {label}
          </div>
          {sub && (
            <div style={{ fontFamily: T.mono, fontSize: 9, color: T.ash, marginTop: 1 }}>{sub}</div>
          )}
        </div>
      )}
    </div>
  );
}
