import { T } from "@/lib/tokens";

interface WordmarkProps {
  size?: number;
  color?: string;
  byMath?: boolean;
  align?: "left" | "center";
}

export default function Wordmark({
  size = 28,
  color,
  byMath = true,
  align = "left",
}: WordmarkProps) {
  const c = color || T.ink;
  return (
    <div
      style={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: align === "center" ? "center" : "flex-start",
        lineHeight: 1,
      }}
    >
      <div
        style={{
          fontFamily: T.serif,
          fontWeight: 400,
          fontSize: size,
          color: c,
          letterSpacing: -0.02 * size,
        }}
      >
        In
        <span
          style={{
            fontStyle: "italic",
            fontWeight: 700,
            color: T.terracotta,
            letterSpacing: 0,
          }}
        >
          TIMI
        </span>
        dated
        <span style={{ opacity: 0.6 }}>,</span>
      </div>
      {byMath && (
        <div
          style={{
            fontFamily: T.mono,
            fontSize: size * 0.32,
            color: c,
            opacity: 0.55,
            textTransform: "uppercase",
            letterSpacing: size * 0.02,
            marginTop: size * 0.12,
          }}
        >
          by&nbsp;math.
        </div>
      )}
    </div>
  );
}
