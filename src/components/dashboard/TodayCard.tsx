import { useState } from "react";
import type { Problem } from "../../types/problem";
import { getDaysUntil } from "../../utils/dates";
import DiffBadge from "../common/DiffBadge";

type Props = { problem: Problem; onToggle: (url: string) => void; onSnooze: (url: string, days: number) => void };

const difficultyBorder: Record<string, string> = {
  Easy: "border-l-green-400",
  Medium: "border-l-amber-400",
  Hard: "border-l-red-400",
};

export default function TodayCard({ problem, onToggle, onSnooze }: Props) {
  const [hovered, setHovered] = useState(false);
  const daysUntil = problem.nextReviewDate ? getDaysUntil(problem.nextReviewDate) : null;
  const overdue = daysUntil !== null && daysUntil < 0;
  const borderClass = difficultyBorder[problem.difficulty] ?? "border-l-slate-400";

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`flex items-center justify-between gap-3.5 rounded-lg border border-l-[3px] p-[13px_16px] transition-all duration-150 ${borderClass} ${hovered ? "border-[#2a2a4a] bg-[#202020]" : "border-[#1a1a30] bg-releet-card"}`}
    >
      <div className="min-w-0 flex-1">
        <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
          {overdue && <span className="rounded border border-red-400/20 bg-red-400/10 px-1.5 py-px font-mono text-[11px] font-bold text-red-400">{Math.abs(daysUntil!)}d overdue</span>}
          {!overdue && daysUntil === 0 && <span className="rounded border border-amber-400/20 bg-amber-400/10 px-1.5 py-px font-mono text-[11px] font-bold text-amber-400">today</span>}
          <DiffBadge difficulty={problem.difficulty ?? "Unknown"} />
        </div>
        <a href={problem.url} target="_blank" rel="noreferrer" className="block max-w-[360px] truncate text-[15px] font-medium text-slate-200 no-underline hover:text-white">{problem.title ?? "Untitled"}</a>
      </div>
      <div className="flex shrink-0 gap-1">
        <button onClick={() => onToggle(problem.url)} className="cursor-pointer rounded-md border border-green-400/25 bg-gradient-to-br from-[#081a0e] to-[#0d2015] px-3.5 py-1.5 font-mono text-xs font-bold text-green-400">✓ done</button>
        {[1, 3, 7].map((days) => <button key={days} onClick={() => onSnooze(problem.url, days)} className="cursor-pointer rounded-md border border-[#1a1a30] bg-transparent px-2 py-1.5 font-mono text-[11px] text-[#6b7280] hover:text-slate-300">+{days}d</button>)}
      </div>
    </div>
  );
}
