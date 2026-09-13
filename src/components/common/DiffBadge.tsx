const DIFF: Record<string, { text: string; bg: string; border: string }> = {
  Easy: { text: "#4ade80", bg: "#4ade8010", border: "#4ade8035" },
  Medium: { text: "#fbbf24", bg: "#fbbf2410", border: "#fbbf2435" },
  Hard: { text: "#f87171", bg: "#f8717110", border: "#f8717135" },
};

export function getDifficultyColor(difficulty: string) {
  return DIFF[difficulty] ?? { text: "#94a3b8", bg: "#94a3b810", border: "#94a3b830" };
}

export default function DiffBadge({ difficulty }: { difficulty: string }) {
  const color = getDifficultyColor(difficulty);
  return (
    <span style={{
      color: color.text, fontSize: "11px", fontWeight: 700,
      background: color.bg, border: `1px solid ${color.border}`,
      padding: "2px 8px", borderRadius: "4px", letterSpacing: "0.06em",
      textTransform: "uppercase", fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      flexShrink: 0,
    }}>
      {difficulty}
    </span>
  );
}
