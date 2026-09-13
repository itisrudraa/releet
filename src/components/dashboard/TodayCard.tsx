import { useState } from "react";
import type { Problem } from "../../types/problem";
import { getDaysUntil } from "../../utils/dates";
import DiffBadge, { getDifficultyColor } from "../common/DiffBadge";

type Props = { problem: Problem; onToggle: (url: string) => void; onSnooze: (url: string, days: number) => void };

export default function TodayCard({ problem, onToggle, onSnooze }: Props) {
  const [hovered, setHovered] = useState(false);
  const daysUntil = problem.nextReviewDate ? getDaysUntil(problem.nextReviewDate) : null;
  const overdue = daysUntil !== null && daysUntil < 0;
  const color = getDifficultyColor(problem.difficulty);

  return <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{
    background: hovered ? "#202020" : "#1a1a1a", border: `1px solid ${hovered ? "#2a2a4a" : "#1a1a30"}`,
    borderLeft: `3px solid ${color.text}`, borderRadius: "8px", padding: "13px 16px", display: "flex",
    alignItems: "center", justifyContent: "space-between", gap: "14px", transition: "all 0.15s ease",
  }}>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "6px", flexWrap: "wrap" }}>
        {overdue && <span style={{ fontSize: "11px", fontWeight: 700, color: "#f87171", background: "#f8717118", border: "1px solid #f8717135", padding: "1px 7px", borderRadius: "4px", fontFamily: "'JetBrains Mono', monospace" }}>{Math.abs(daysUntil!)}d overdue</span>}
        {!overdue && daysUntil === 0 && <span style={{ fontSize: "11px", fontWeight: 700, color: "#fbbf24", background: "#fbbf2418", border: "1px solid #fbbf2435", padding: "1px 7px", borderRadius: "4px", fontFamily: "'JetBrains Mono', monospace" }}>today</span>}
        <DiffBadge difficulty={problem.difficulty ?? "Unknown"} />
      </div>
      <a href={problem.url} target="_blank" rel="noreferrer" style={{ color: "#e2e8f0", fontWeight: 500, fontSize: "15px", textDecoration: "none", display: "block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "360px" }}>{problem.title ?? "Untitled"}</a>
    </div>
    <div style={{ display: "flex", gap: "5px", flexShrink: 0 }}>
      <button onClick={() => onToggle(problem.url)} style={{ padding: "6px 14px", borderRadius: "6px", border: "1px solid #4ade8040", background: "linear-gradient(135deg, #081a0e, #0d2015)", color: "#4ade80", cursor: "pointer", fontSize: "12px", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>✓ done</button>
      {[1, 3, 7].map((days) => <button key={days} onClick={() => onSnooze(problem.url, days)} style={{ padding: "6px 9px", borderRadius: "6px", border: "1px solid #1a1a30", background: "transparent", color: "#4a4a6a", cursor: "pointer", fontSize: "11px", fontFamily: "'JetBrains Mono', monospace" }}>+{days}d</button>)}
    </div>
  </div>;
}
