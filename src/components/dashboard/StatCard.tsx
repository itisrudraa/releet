type Props = {
  label: string;
  value: number;
  accent: string;
  bg: string;
  topBorder: string;
};

export default function StatCard({ label, value, accent, bg, topBorder }: Props) {
  return (
    <div style={{
      flex: 1, background: bg, border: `1px solid ${topBorder}22`,
      borderTop: `2px solid ${topBorder}CC`, borderRadius: "10px",
      padding: "16px 18px 14px", display: "flex", flexDirection: "column", gap: "5px",
    }}>
      <span style={{ fontSize: "26px", fontWeight: 700, color: accent,
        fontFamily: "'JetBrains Mono', monospace", letterSpacing: "-0.04em", lineHeight: 1 }}>
        {value}
      </span>
      <span style={{ fontSize: "11px", color: accent + "70", letterSpacing: "0.09em",
        textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace" }}>
        {label}
      </span>
    </div>
  );
}
