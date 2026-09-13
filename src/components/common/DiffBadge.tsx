const DIFF: Record<string, string> = {
  Easy: "text-green-400 bg-green-400/5 border-green-400/20",
  Medium: "text-amber-400 bg-amber-400/5 border-amber-400/20",
  Hard: "text-red-400 bg-red-400/5 border-red-400/20",
};

export function getDifficultyColor(difficulty: string) {
  const classes = DIFF[difficulty] ?? "text-slate-400 bg-slate-400/5 border-slate-400/20";
  return {
    text: difficulty === "Easy" ? "#4ade80" : difficulty === "Medium" ? "#fbbf24" : difficulty === "Hard" ? "#f87171" : "#94a3b8",
    bg: classes,
    border: classes,
  };
}

export default function DiffBadge({ difficulty }: { difficulty: string }) {
  return (
    <span className={`shrink-0 rounded border px-2 py-0.5 font-mono text-[11px] font-bold uppercase tracking-[0.06em] ${DIFF[difficulty] ?? "text-slate-400 bg-slate-400/5 border-slate-400/20"}`}>
      {difficulty}
    </span>
  );
}
