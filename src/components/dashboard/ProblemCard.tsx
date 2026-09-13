import { useState } from "react";
import type { Problem } from "../../types/problem";
import { formatDate, getDaysUntil } from "../../utils/dates";
import DiffBadge from "../common/DiffBadge";

type Props = {
  problem: Problem;
  onToggle: (url: string) => void;
  onDelete: (url: string) => void;
  onSnooze: (url: string, days: number) => void;
};

const difficultyBorder: Record<string, string> = {
  Easy: "border-l-green-400",
  Medium: "border-l-amber-400",
  Hard: "border-l-red-400",
};

export default function ProblemCard({ problem, onToggle, onDelete, onSnooze }: Props) {
  const [hovered, setHovered] = useState(false);
  const [deleteHovered, setDeleteHovered] = useState(false);
  const daysUntil = problem.nextReviewDate ? getDaysUntil(problem.nextReviewDate) : null;
  const overdue = daysUntil !== null && daysUntil < 0;
  const borderClass = difficultyBorder[problem.difficulty] ?? "border-l-slate-400";

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`flex items-center justify-between gap-3.5 rounded-lg border border-l-[3px] p-3 px-4 transition-all duration-150 ${borderClass} ${hovered ? "border-[#2a2a4a] bg-[#202020]" : "border-[#1a1a2e] bg-releet-card"} ${problem.revised ? "opacity-40" : "opacity-100"}`}
    >
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex flex-wrap items-center gap-2">
          <a href={problem.url} target="_blank" rel="noreferrer" className="block max-w-[340px] truncate text-sm font-medium text-slate-300 no-underline hover:text-white">
            {problem.title ?? "Untitled"}
          </a>
          <DiffBadge difficulty={problem.difficulty ?? "Unknown"} />
        </div>
        <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1">
          <span className="font-mono text-[11px] text-[#6b7280]">saved {formatDate(problem.savedAt)}</span>
          {problem.nextReviewDate && <span className={`font-mono text-[11px] ${overdue ? "text-red-400" : "text-[#6b7280]"}`}>
            {overdue ? `${Math.abs(daysUntil!)}d overdue` : daysUntil === 0 ? "due today" : `review ${formatDate(problem.nextReviewDate)}`}
          </span>}
          {problem.revised && <span className="font-mono text-[11px] text-green-400">✓ revised</span>}
        </div>
      </div>
      <div className="flex shrink-0 gap-1">
        <button onClick={() => onToggle(problem.url)} className={`cursor-pointer rounded-md px-3 py-1.5 font-mono text-[11px] ${problem.revised ? "border border-green-400/20 bg-gradient-to-br from-[#081a0e] to-[#0d2015] text-green-400" : "border border-[#1a1a30] bg-transparent text-[#6b7280] hover:text-slate-300"}`}>
          {problem.revised ? "✓ done" : "mark done"}
        </button>
        {!problem.revised && [1, 3, 7].map((days) => <button key={days} onClick={() => onSnooze(problem.url, days)} className="cursor-pointer rounded-md border border-[#1a1a2e] bg-transparent px-2 py-1.5 font-mono text-[11px] text-[#6b7280] hover:text-slate-300">+{days}d</button>)}
        <button onClick={() => onDelete(problem.url)} onMouseEnter={() => setDeleteHovered(true)} onMouseLeave={() => setDeleteHovered(false)} className={`cursor-pointer rounded-md px-2.5 py-1.5 text-xs ${deleteHovered ? "border border-red-400/25 bg-gradient-to-br from-[#1a0808] to-[#200d0d] text-red-400" : "border border-[#1a1a2e] bg-transparent text-[#6b7280]"}`}>
          ✕
        </button>
      </div>
    </div>
  );
}
