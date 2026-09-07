import { useState } from "react";
import type { Problem } from "../../types/problem";
import { formatDate, getDaysUntil } from "../../utils/dates";
import DiffBadge, { getDifficultyColor } from "../common/DiffBadge";

type Props = {
  problem: Problem;
  onToggle: (url: string) => void;
  onDelete: (url: string) => void;
  onSnooze: (url: string, days: number) => void;
};

export default function ProblemCard({ problem, onToggle, onDelete, onSnooze }: Props) {
  const [hovered, setHovered] = useState(false);
  const [deleteHovered, setDeleteHovered] = useState(false);
  const daysUntil = problem.nextReviewDate ? getDaysUntil(problem.nextReviewDate) : null;
  const overdue = daysUntil !== null && daysUntil < 0;
  const color = getDifficultyColor(problem.difficulty);

  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{
      background: hovered ? "#202020" : "#1a1a1a", border: `1px solid ${hovered ? "#2a2a4a" : "#1a1a2e"}`,
      borderLeft: `3px solid ${color.text}`, borderRadius: "8px", padding: "12px 16px",
      display: "flex", alignItems: "center", justifyContent: "space-between", gap: "14px",
      opacity: problem.revised ? 0.4 : 1, transition: "all 0.15s ease",
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "5px", flexWrap: "wrap" }}>
          <a href={problem.url} target="_blank" rel="noreferrer" style={{ color: "#cbd5e1", fontWeight: 500,
            fontSize: "14px", textDecoration: "none", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "340px" }}>
            {problem.title ?? "Untitled"}
          </a>
          <DiffBadge difficulty={problem.difficulty ?? "Unknown"} />
        </div>
        <div style={{ display: "flex", gap: "14px", alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ color: "#6b7280", fontSize: "11px", fontFamily: "'JetBrains Mono', monospace" }}>saved {formatDate(problem.savedAt)}</span>
          {problem.nextReviewDate && <span style={{ fontSize: "11px", fontFamily: "'JetBrains Mono', monospace", color: overdue ? "#f87171" : "#6b7280" }}>
            {overdue ? `${Math.abs(daysUntil!)}d overdue` : daysUntil === 0 ? "due today" : `review ${formatDate(problem.nextReviewDate)}`}
          </span>}
          {problem.revised && <span style={{ color: "#4ade80", fontSize: "11px", fontFamily: "'JetBrains Mono', monospace" }}>✓ revised</span>}
        </div>
      </div>
      <div style={{ display: "flex", gap: "5px", flexShrink: 0 }}>
        <button onClick={() => onToggle(problem.url)} style={{ padding: "5px 12px", borderRadius: "6px",
          border: `1px solid ${problem.revised ? "#4ade8035" : "#1a1a30"}`, background: problem.revised ? "linear-gradient(135deg, #081a0e, #0d2015)" : "transparent",
          color: problem.revised ? "#4ade80" : "#6b7280", cursor: "pointer", fontSize: "11px", fontFamily: "'JetBrains Mono', monospace" }}>
          {problem.revised ? "✓ done" : "mark done"}
        </button>
        {!problem.revised && [1, 3, 7].map((days) => <button key={days} onClick={() => onSnooze(problem.url, days)} style={{
          padding: "5px 9px", borderRadius: "6px", border: "1px solid #1a1a2e", background: "transparent", color: "#6b7280", cursor: "pointer", fontSize: "11px", fontFamily: "'JetBrains Mono', monospace" }}>
          +{days}d
        </button>)}
        <button onClick={() => onDelete(problem.url)} onMouseEnter={() => setDeleteHovered(true)} onMouseLeave={() => setDeleteHovered(false)} style={{
          padding: "5px 10px", borderRadius: "6px", border: `1px solid ${deleteHovered ? "#f8717140" : "#1a1a2e"}`,
          background: deleteHovered ? "linear-gradient(135deg, #1a0808, #200d0d)" : "transparent", color: deleteHovered ? "#f87171" : "#6b7280", cursor: "pointer", fontSize: "12px" }}>
          ✕
        </button>
      </div>
    </div>
  );
}
