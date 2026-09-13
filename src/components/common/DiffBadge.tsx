const DIFF: Record<string, { text: string; bg: string; border: string }> = {
  Easy: { text: "#4ade80", bg: "#4ade8010", border: "#4ade8035" },
  Medium: { text: "#fbbf24", bg: "#fbbf2410", border: "#fbbf2435" },
  Hard: { text: "#f87171", bg: "#f8717110", border: "#f8717135" },
};

const DIFF_CLASSES: Record<string, string> = {
  Easy: "text-green-400 bg-green-400/5 border-green-400/20",
  Medium: "text-amber-400 bg-amber-400/5 border-amber-400/20",
  Hard: "text-red-400 bg-red-400/5 border-red-400/20",
};

export function getDifficultyColor(difficulty: string) {
  return DIFF[difficulty] ?? { text: "#94a3b8", bg: "#94a3b810", border: "#94a3b830" };
}

export default function DiffBadge({ difficulty }: { difficulty: string }) {
  return (
    <span className={`shrink-0 rounded border px-2 py-0.5 font-mono text-[11px] font-bold uppercase tracking-[0.06em] ${DIFF_CLASSES[difficulty] ?? "text-slate-400 bg-slate-400/5 border-slate-400/20"}`}>
      {difficulty}
    </span>
  );
}
