/// <reference types="chrome" />

import { useEffect, useState } from "react";

type Problem = {
  title: string;
  difficulty: string;
  url: string;
  savedAt: string;
  revised?: boolean;
  reviseAfterDays?: number;
  nextReviewDate?: string;
};

type DifficultyFilter = "All" | "Easy" | "Medium" | "Hard";
type SortOption = "due" | "saved" | "difficulty";

const DIFF: Record<string, { text: string; bg: string; border: string; dot: string }> = {
  Easy:   { text: "#4ade80", bg: "#4ade8010", border: "#4ade8035", dot: "#4ade80" },
  Medium: { text: "#fbbf24", bg: "#fbbf2410", border: "#fbbf2435", dot: "#fbbf24" },
  Hard:   { text: "#f87171", bg: "#f8717110", border: "#f8717135", dot: "#f87171" },
};

// Gradient palette
const G = {
  pageBg: "#0f0f0f",
  headerBg: "#111111",
  cardBase: "#1a1a1a",
  cardHover: "#202020",
  todayBg: "#151515",
  statRed: "#181212",
  statOrange: "#181511",
  statGreen: "#111613",
  statBlue: "#141414",
  allClear: "#101612",
  footerBg: "#111111",
};

function DiffBadge({ difficulty }: { difficulty: string }) {
  const c = DIFF[difficulty] ?? { text: "#94a3b8", bg: "#94a3b810", border: "#94a3b830", dot: "#94a3b8" };
  return (
    <span style={{
      color: c.text,
      fontSize: "11px",
      fontWeight: 700,
      background: c.bg,
      border: `1px solid ${c.border}`,
      padding: "2px 8px",
      borderRadius: "4px",
      letterSpacing: "0.06em",
      textTransform: "uppercase" as const,
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      flexShrink: 0,
    }}>
      {difficulty}
    </span>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function getDaysUntil(iso: string) {
  return Math.ceil((new Date(iso).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

// ─── STAT CARD ────────────────────────────────────────────────────────────────

function StatCard({
  label, value, accent, bg, topBorder,
}: {
  label: string; value: number; accent: string; bg: string; topBorder: string;
}) {
  return (
    <div style={{
      flex: 1,
      background: bg,
      border: `1px solid ${topBorder}22`,
      borderTop: `2px solid ${topBorder}CC`,
      borderRadius: "10px",
      padding: "16px 18px 14px",
      display: "flex",
      flexDirection: "column" as const,
      gap: "5px",
    }}>
      <span style={{
        fontSize: "26px", fontWeight: 700, color: accent,
        fontFamily: "'JetBrains Mono', monospace", letterSpacing: "-0.04em", lineHeight: 1,
      }}>
        {value}
      </span>
      <span style={{
        fontSize: "11px", color: accent + "70",
        letterSpacing: "0.09em", textTransform: "uppercase" as const,
        fontFamily: "'JetBrains Mono', monospace",
      }}>
        {label}
      </span>
    </div>
  );
}

// ─── TODAY CARD ───────────────────────────────────────────────────────────────

function TodayCard({
  problem, onToggle, onSnooze,
}: {
  problem: Problem;
  onToggle: (url: string) => void;
  onSnooze: (url: string, days: number) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const daysUntil = problem.nextReviewDate ? getDaysUntil(problem.nextReviewDate) : null;
  const isOverdue = daysUntil !== null && daysUntil < 0;
  const dc = DIFF[problem.difficulty] ?? DIFF["Easy"];

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? G.cardHover : G.cardBase,
        border: `1px solid ${hovered ? "#2a2a4a" : "#1a1a30"}`,
        borderLeft: `3px solid ${dc.dot}`,
        borderRadius: "8px",
        padding: "13px 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "14px",
        transition: "all 0.15s ease",
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "6px", flexWrap: "wrap" as const }}>
          {isOverdue && (
            <span style={{
              fontSize: "11px", fontWeight: 700, color: "#f87171",
              background: "#f8717118", border: "1px solid #f8717135",
              padding: "1px 7px", borderRadius: "4px",
              letterSpacing: "0.06em", textTransform: "uppercase" as const,
              fontFamily: "'JetBrains Mono', monospace",
            }}>
              {Math.abs(daysUntil!)}d overdue
            </span>
          )}
          {!isOverdue && daysUntil === 0 && (
            <span style={{
              fontSize: "11px", fontWeight: 700, color: "#fbbf24",
              background: "#fbbf2418", border: "1px solid #fbbf2435",
              padding: "1px 7px", borderRadius: "4px",
              letterSpacing: "0.06em", textTransform: "uppercase" as const,
              fontFamily: "'JetBrains Mono', monospace",
            }}>
              today
            </span>
          )}
          <DiffBadge difficulty={problem.difficulty ?? "Unknown"} />
        </div>
        <a
          href={problem.url}
          target="_blank"
          rel="noreferrer"
          style={{
            color: "#e2e8f0",
            fontWeight: 500,
            fontSize: "15px",
            textDecoration: "none",
            display: "block",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "360px",
            letterSpacing: "-0.01em",
          }}
        >
          {problem.title ?? "Untitled"}
        </a>
      </div>

      <div style={{ display: "flex", gap: "5px", flexShrink: 0 }}>
        <button
          onClick={() => onToggle(problem.url)}
          style={{
            padding: "6px 14px", borderRadius: "6px",
            border: "1px solid #4ade8040",
            background: "linear-gradient(135deg, #081a0e 0%, #0d2015 100%)",
            color: "#4ade80", cursor: "pointer",
            fontSize: "12px", fontWeight: 700,
            fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: "0.02em", transition: "all 0.12s",
          }}
        >
          ✓ done
        </button>
        {[1, 3, 7].map((d) => (
          <button
            key={d}
            onClick={() => onSnooze(problem.url, d)}
            style={{
              padding: "6px 9px", borderRadius: "6px",
              border: "1px solid #1a1a30",
              background: "transparent", color: "#4a4a6a",
              cursor: "pointer", fontSize: "11px",
              fontFamily: "'JetBrains Mono', monospace",
              transition: "all 0.12s",
            }}
          >
            +{d}d
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── PROBLEM CARD ─────────────────────────────────────────────────────────────

function ProblemCard({
  problem, onToggle, onDelete, onSnooze,
}: {
  problem: Problem;
  onToggle: (url: string) => void;
  onDelete: (url: string) => void;
  onSnooze: (url: string, days: number) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const [delHovered, setDelHovered] = useState(false);
  const daysUntil = problem.nextReviewDate ? getDaysUntil(problem.nextReviewDate) : null;
  const isOverdue = daysUntil !== null && daysUntil < 0;
  const dc = DIFF[problem.difficulty] ?? DIFF["Easy"];

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? G.cardHover : G.cardBase,
        border: `1px solid ${hovered ? "#2a2a4a" : "#1a1a2e"}`,
        borderLeft: `3px solid ${dc.dot}`,
        borderRadius: "8px",
        padding: "12px 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "14px",
        opacity: problem.revised ? 0.4 : 1,
        transition: "all 0.15s ease",
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "5px", flexWrap: "wrap" as const }}>
          <a
            href={problem.url}
            target="_blank"
            rel="noreferrer"
            style={{
              color: "#cbd5e1", fontWeight: 500, fontSize: "14px",
              textDecoration: "none", whiteSpace: "nowrap",
              overflow: "hidden", textOverflow: "ellipsis",
              maxWidth: "340px", display: "block", letterSpacing: "-0.01em",
            }}
          >
            {problem.title ?? "Untitled"}
          </a>
          <DiffBadge difficulty={problem.difficulty ?? "Unknown"} />
        </div>
        <div style={{ display: "flex", gap: "14px", alignItems: "center", flexWrap: "wrap" as const }}>
          <span style={{ color: "#6b7280", fontSize: "11px", fontFamily: "'JetBrains Mono', monospace" }}>
            saved {formatDate(problem.savedAt)}
          </span>
          {problem.nextReviewDate && (
            <span style={{ fontSize: "11px", fontFamily: "'JetBrains Mono', monospace", color: isOverdue ? "#f87171" : "#6b7280" }}>
              {isOverdue
                ? `${Math.abs(daysUntil!)}d overdue`
                : daysUntil === 0
                ? "due today"
                : `review ${formatDate(problem.nextReviewDate)}`}
            </span>
          )}
          {problem.revised && (
            <span style={{ color: "#4ade80", fontSize: "11px", fontFamily: "'JetBrains Mono', monospace" }}>✓ revised</span>
          )}
        </div>
      </div>

      <div style={{ display: "flex", gap: "5px", flexShrink: 0 }}>
        <button
          onClick={() => onToggle(problem.url)}
          style={{
            padding: "5px 12px", borderRadius: "6px",
            border: `1px solid ${problem.revised ? "#4ade8035" : "#1a1a30"}`,
            background: problem.revised ? "linear-gradient(135deg, #081a0e, #0d2015)" : "transparent",
            color: problem.revised ? "#4ade80" : "#6b7280",
            cursor: "pointer", fontSize: "11px",
            fontFamily: "'JetBrains Mono', monospace",
            transition: "all 0.12s",
          }}
        >
          {problem.revised ? "✓ done" : "mark done"}
        </button>

        {!problem.revised && [1, 3, 7].map((d) => (
          <button
            key={d}
            onClick={() => onSnooze(problem.url, d)}
            style={{
              padding: "5px 9px", borderRadius: "6px",
              border: "1px solid #1a1a2e",
              background: "transparent", color: "#6b7280",
              cursor: "pointer", fontSize: "11px",
              fontFamily: "'JetBrains Mono', monospace",
              transition: "all 0.12s",
            }}
          >
            +{d}d
          </button>
        ))}

        <button
          onClick={() => onDelete(problem.url)}
          onMouseEnter={() => setDelHovered(true)}
          onMouseLeave={() => setDelHovered(false)}
          style={{
            padding: "5px 10px", borderRadius: "6px",
            border: `1px solid ${delHovered ? "#f8717140" : "#1a1a2e"}`,
            background: delHovered ? "linear-gradient(135deg, #1a0808, #200d0d)" : "transparent",
            color: delHovered ? "#f87171" : "#6b7280",
            cursor: "pointer", fontSize: "12px",
            transition: "all 0.12s",
          }}
        >
          ✕
        </button>
      </div>
    </div>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────

function Footer() {
  const links: { label: string; url: string; icon: string }[] = [
    { label: "GitHub",   url: "https://github.com/itisrudraa",                    icon: "⌥" },
    { label: "LinkedIn", url: "https://www.linkedin.com/in/itisrudra/",           icon: "in" },
  ];

  return (
    <div style={{
      background: G.footerBg,
      borderTop: "1px solid #1a1a2e",
      padding: "28px 0 24px",
      marginTop: "auto",
    }}>
      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "0 36px" }}>
        {/* top row */}
        <div style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "24px",
          flexWrap: "wrap" as const,
          marginBottom: "20px",
        }}>
          {/* branding */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <span style={{
                width: "7px", height: "7px", borderRadius: "50%",
                background: "#fbbf24",
                display: "inline-block",
                boxShadow: "0 0 8px #fbbf2460",
              }} />
              <span style={{
                fontWeight: 700, fontSize: "14px", color: "#e2e8f0",
                fontFamily: "'JetBrains Mono', monospace", letterSpacing: "-0.02em",
              }}>
                ReLeet
              </span>
            </div>
            <p style={{
              fontSize: "12px", color: "#6b7280", margin: 0,
              fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.6,
            }}>
              Track, review, and retain coding interview problems.<br />
              Built for long-term mastery.
            </p>
          </div>

          {/* links */}
          <div style={{ display: "flex", flexDirection: "column" as const, gap: "8px" }}>
            <span style={{
              fontSize: "11px", color: "#6b7280",
              fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: "0.08em", textTransform: "uppercase" as const,
              marginBottom: "2px",
            }}>
              Connect
            </span>
            {links.map((l) => (
              <a
                key={l.label}
                href={l.url}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "flex", alignItems: "center", gap: "8px",
                  color: "#6b7280", fontSize: "12px",
                  fontFamily: "'JetBrains Mono', monospace",
                  textDecoration: "none",
                  transition: "color 0.12s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#ffa116")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#6b7280")}
              >
                <span style={{
                  width: "20px", height: "20px", borderRadius: "4px",
                  background: "#1a1a2e", border: "1px solid #2a2a40",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "9px", fontWeight: 700, color: "#ffa116",
                  flexShrink: 0,
                }}>
                  {l.icon}
                </span>
                {l.label}
              </a>
            ))}
          </div>

          {/* tips */}
          <div style={{ display: "flex", flexDirection: "column" as const, gap: "6px" }}>
            <span style={{
              fontSize: "11px", color: "#6b7280",
              fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: "0.08em", textTransform: "uppercase" as const,
              marginBottom: "2px",
            }}>
              Pro tips
            </span>
            {[
              "Review within 24h of solving",
              "Snooze hard problems by +3d",
              "Aim for 0 due by end of day",
            ].map((tip) => (
              <div key={tip} style={{ display: "flex", alignItems: "flex-start", gap: "6px" }}>
                <span style={{ color: "#fbbf24", fontSize: "11px", marginTop: "1px", flexShrink: 0 }}>›</span>
                <span style={{ fontSize: "11px", color: "#6b7280", fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.5 }}>
                  {tip}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* divider */}
        <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, #1a1a2e 30%, #1a1a2e 70%, transparent)", marginBottom: "16px" }} />

        {/* bottom */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap" as const, gap: "8px",
        }}>
          <span style={{
            fontSize: "11px", color: "#6b7280",
            fontFamily: "'JetBrains Mono', monospace",
          }}>
            Made with{" "}
            <span style={{ color: "#f87171" }}>♥</span>
            {" "}by{" "}
            <a
              href="https://github.com/itisrudraa"
              target="_blank"
              rel="noreferrer"
              style={{ color: "#ffa116", textDecoration: "none", fontWeight: 700 }}
            >
              Rudra
            </a>
          </span>
          <span style={{
            fontSize: "11px", color: "#6b7280",
            fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.04em",
          }}>
            ReLeet v1.0 · Chrome Extension
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<DifficultyFilter>("All");
  const [sort, setSort] = useState<SortOption>("due");
  const [activeTab, setActiveTab] = useState<"due" | "upcoming" | "revised">("due");

  useEffect(() => {
    function load() {
      chrome.storage.local.get("savedProblems", (result) => {
        const cleaned = ((result["savedProblems"] as Problem[]) || []).filter(
          (p) => p.title && p.difficulty
        );
        setProblems(cleaned);
      });
    }
    load();
    chrome.storage.onChanged.addListener(load);
    return () => chrome.storage.onChanged.removeListener(load);
  }, []);

  async function deleteProblem(url: string) {
    const updated = problems.filter((p) => p.url !== url);
    setProblems(updated);
    await chrome.storage.local.set({ savedProblems: updated });
  }

  async function toggleRevised(url: string) {
    const updated = problems.map((p) =>
      p.url === url ? { ...p, revised: !p.revised } : p
    );
    setProblems(updated);
    await chrome.storage.local.set({ savedProblems: updated });
  }

  async function snoozeProblem(url: string, days: number) {
    const updated = problems.map((p) => {
      if (p.url !== url) return p;
      return {
        ...p,
        revised: false,
        nextReviewDate: new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString(),
      };
    });
    setProblems(updated);
    await chrome.storage.local.set({ savedProblems: updated });
  }

  const now = new Date();

  const todayProblems = problems.filter(
    (p) => !p.revised && p.nextReviewDate && new Date(p.nextReviewDate) <= now
  );

  function matchesFilters(p: Problem) {
    return (
      (p.title || "").toLowerCase().includes(search.toLowerCase()) &&
      (filter === "All" || p.difficulty === filter)
    );
  }

  const filtered = problems.filter(matchesFilters);
  const dueProblems      = filtered.filter((p) => !p.revised && p.nextReviewDate && new Date(p.nextReviewDate) <= now);
  const upcomingProblems = filtered.filter((p) => !p.revised && p.nextReviewDate && new Date(p.nextReviewDate) > now);
  const revisedProblems  = filtered.filter((p) => p.revised);

  function sortList(list: Problem[]) {
    if (sort === "saved")
      return [...list].sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime());
    if (sort === "difficulty") {
      const order: Record<string, number> = { Easy: 0, Medium: 1, Hard: 2 };
      return [...list].sort((a, b) => (order[a.difficulty] ?? 3) - (order[b.difficulty] ?? 3));
    }
    return [...list].sort((a, b) => {
      if (!a.nextReviewDate) return 1;
      if (!b.nextReviewDate) return -1;
      return new Date(a.nextReviewDate).getTime() - new Date(b.nextReviewDate).getTime();
    });
  }

  const tabData = {
    due:      { list: dueProblems,      label: "Due",      color: "#f87171" },
    upcoming: { list: upcomingProblems, label: "Upcoming", color: "#fbbf24" },
    revised:  { list: revisedProblems,  label: "Revised",  color: "#4ade80" },
  };

  const activeList = sortList(tabData[activeTab].list);
  const filters: DifficultyFilter[] = ["All", "Easy", "Medium", "Hard"];
  const sorts: { value: SortOption; label: string }[] = [
    { value: "due",        label: "by date"    },
    { value: "saved",      label: "newest"     },
    { value: "difficulty", label: "difficulty" },
  ];

  const todayLabel = now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  const totalDue =problems.filter((p) =>!p.revised &&p.nextReviewDate &&new Date(p.nextReviewDate) <= now).length;
  const doneToday  = totalDue - todayProblems.length;
  const pct        = totalDue > 0 ? Math.round((doneToday / totalDue) * 100) : 0;

  return (
    <div style={{
      minHeight: "100vh",
      background: G.pageBg,
      color: "#e2e8f0",
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      display: "flex",
      flexDirection: "column" as const,
    }}>

      {/* ── HEADER ── */}
      <div style={{
        borderBottom: "1px solid #1a1a2e",
        padding: "14px 36px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: G.headerBg,
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{
            width: "7px", height: "7px", borderRadius: "50%",
            background: "#fbbf24",
            display: "inline-block",
            boxShadow: "0 0 8px #fbbf2460",
          }} />
          <span style={{
            fontWeight: 700, fontSize: "15px", color: "#f1f5f9",
            letterSpacing: "-0.02em",
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          }}>
            ReLeet
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          {todayProblems.length > 0 && (
            <span style={{
              fontSize: "11px", color: "#f87171",
              background: "#f8717115", border: "1px solid #f8717130",
              padding: "3px 10px", borderRadius: "20px",
              fontFamily: "'JetBrains Mono', monospace",
            }}>
              {todayProblems.length} due today
            </span>
          )}
          <span style={{ color: "#6b7280", fontSize: "11px", fontFamily: "'JetBrains Mono', monospace" }}>
            {problems.length} saved
          </span>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={{ flex: 1, width: "100%" }}>
        <div style={{ maxWidth: "860px", margin: "0 auto", padding: "28px 36px 40px" }}>

          {/* ── STATS ── */}
          <div style={{ display: "flex", gap: "10px", marginBottom: "28px" }}>
            <StatCard label="due now"  value={dueProblems.length}      accent="#e07a7a" bg={G.statRed}    topBorder="#c95f5f" />
            <StatCard label="upcoming" value={upcomingProblems.length} accent="#d9b04c" bg={G.statOrange} topBorder="#c7952d" />
            <StatCard label="revised"  value={revisedProblems.length}  accent="#66c78a" bg={G.statGreen}  topBorder="#4da96f" />
            <StatCard label="total"    value={problems.length}         accent="#d8a14f" bg={G.statBlue}   topBorder="#c1842f" />
          </div>

          {/* ── TODAY'S REVIEW ── */}
          {todayProblems.length > 0 ? (
            <div style={{ marginBottom: "32px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: "3px", height: "18px", background: "#f87171", borderRadius: "2px", flexShrink: 0 }} />
                  <span style={{ fontSize: "14px", fontWeight: 700, color: "#f1f5f9", letterSpacing: "-0.01em" }}>
                    Review today
                  </span>
                  <span style={{
                    fontSize: "11px", fontWeight: 700, color: "#f87171",
                    background: "#f8717118", border: "1px solid #f8717130",
                    padding: "1px 9px", borderRadius: "20px",
                    fontFamily: "'JetBrains Mono', monospace",
                  }}>
                    {todayProblems.length}
                  </span>
                </div>
                <span style={{ fontSize: "11px", color: "#6b7280", fontFamily: "'JetBrains Mono', monospace" }}>
                  {todayLabel}
                </span>
              </div>

              <div style={{
                background: G.todayBg,
                border: "1px solid #1a1a2e",
                borderRadius: "10px",
                padding: "10px",
                display: "flex",
                flexDirection: "column" as const,
                gap: "6px",
              }}>
                {todayProblems.map((p) => (
                  <TodayCard key={p.url} problem={p} onToggle={toggleRevised} onSnooze={snoozeProblem} />
                ))}
              </div>

              {totalDue > 0 && (
                <div style={{ marginTop: "10px" }}>
                  <div style={{ height: "4px", background: "#1a1a2e", borderRadius: "2px", overflow: "hidden" }}>
                    <div style={{
                      height: "100%", width: `${pct}%`,
                      background: "linear-gradient(90deg, #4ade80, #22d3ee)",
                      borderRadius: "2px", transition: "width 0.4s ease",
                    }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "5px" }}>
                    <span style={{ fontSize: "11px", color: "#6b7280", fontFamily: "'JetBrains Mono', monospace" }}>
                      {doneToday} of {totalDue} done today
                    </span>
                    <span style={{ fontSize: "11px", color: pct === 100 ? "#4ade80" : "#6b7280", fontFamily: "'JetBrains Mono', monospace" }}>
                      {pct}%
                    </span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{
              marginBottom: "32px",
              background: G.allClear,
              border: "1px solid #2d6a4430",
              borderRadius: "10px",
              padding: "18px 22px",
              display: "flex", alignItems: "center", gap: "14px",
            }}>
              <div style={{
                width: "36px", height: "36px", borderRadius: "50%",
                background: "#142a1d", border: "1px solid #3d8d5b30",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "16px", color: "#48c774", flexShrink: 0,
              }}>
                ✓
              </div>
              <div>
                <div style={{ fontSize: "14px", fontWeight: 600, color: "#66c78a", marginBottom: "3px" }}>
                  All caught up!
                </div>
                <div style={{ fontSize: "12px", color: "#1e4d30", fontFamily: "'JetBrains Mono', monospace" }}>
                  No reviews due · {todayLabel}
                </div>
              </div>
            </div>
          )}

          {/* ── DIVIDER ── */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "18px" }}>
            <div style={{ width: "3px", height: "16px", background: "#ffa116", borderRadius: "2px" }} />
            <span style={{
              fontSize: "11px", fontWeight: 600, color: "#6b7280",
              letterSpacing: "0.08em", textTransform: "uppercase" as const,
              fontFamily: "'JetBrains Mono', monospace",
            }}>
              All problems
            </span>
            <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, #1a1a2e, transparent)" }} />
          </div>

          {/* ── SEARCH + FILTER ── */}
          <div style={{ display: "flex", gap: "8px", marginBottom: "10px", flexWrap: "wrap" as const }}>
            <input
              type="text"
              placeholder="search problems..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                flex: 1, minWidth: "180px",
                padding: "9px 14px", borderRadius: "8px",
                border: "1px solid #1a1a2e",
                background: G.cardBase, color: "#cbd5e1",
                fontSize: "14px", outline: "none",
                fontFamily: "'JetBrains Mono', monospace",
              }}
            />
            {filters.map((d) => {
              const active = filter === d;
              const dc = d !== "All" ? DIFF[d] : null;
              return (
                <button
                  key={d}
                  onClick={() => setFilter(d)}
                  style={{
                    padding: "9px 14px", borderRadius: "8px",
                    border: active
                      ? `1px solid ${dc ? dc.border : "#ffa11640"}`
                      : "1px solid #1a1a2e",
                    background: active
                      ? (dc ? dc.bg : "#ffa11610")
                      : "transparent",
                    color: active ? (dc ? dc.text : "#ffa116") : "#6b7280",
                    cursor: "pointer", fontSize: "11px",
                    fontFamily: "'JetBrains Mono', monospace",
                    letterSpacing: "0.04em", transition: "all 0.12s",
                  }}
                >
                  {d}
                </button>
              );
            })}
          </div>

          {/* ── SORT ── */}
          <div style={{ display: "flex", gap: "4px", marginBottom: "18px", alignItems: "center" }}>
            <span style={{ fontSize: "11px", color: "#6b7280", marginRight: "4px", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.06em" }}>
              sort:
            </span>
            {sorts.map((s) => (
              <button
                key={s.value}
                onClick={() => setSort(s.value)}
                style={{
                  padding: "4px 11px", borderRadius: "5px",
                  border: sort === s.value ? "1px solid #2a2a40" : "1px solid transparent",
                  background: sort === s.value ? G.cardBase : "transparent",
                  color: sort === s.value ? "#ffa116" : "#6b7280",
                  cursor: "pointer", fontSize: "11px",
                  fontFamily: "'JetBrains Mono', monospace",
                  transition: "all 0.12s",
                }}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* ── TABS ── */}
          <div style={{ display: "flex", borderBottom: "1px solid #1a1a2e", marginBottom: "14px" }}>
            {(["due", "upcoming", "revised"] as const).map((tab) => {
              const { label, color, list } = tabData[tab];
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: "10px 20px", border: "none",
                    borderBottom: isActive ? `2px solid ${color}` : "2px solid transparent",
                    background: "transparent", color: isActive ? color : "#6b7280",
                    cursor: "pointer", fontSize: "12px",
                    fontWeight: isActive ? 700 : 400,
                    fontFamily: "'JetBrains Mono', monospace",
                    letterSpacing: "0.03em", transition: "all 0.12s",
                  }}
                >
                  {label} ({list.length})
                </button>
              );
            })}
          </div>

          {/* ── PROBLEM LIST (scrollable when tall) ── */}
          {activeList.length === 0 ? (
            <div style={{
              textAlign: "center", paddingTop: "60px",
              color: "#6b7280", fontSize: "14px",
              fontFamily: "'JetBrains Mono', monospace",
            }}>
              nothing here yet
            </div>
          ) : (
            <div style={{
              maxHeight: "480px",
              overflowY: "auto",
              paddingRight: "4px",
              display: "flex",
              flexDirection: "column" as const,
              gap: "6px",
              // custom scrollbar via webkit
              scrollbarWidth: "thin",
              scrollbarColor: "#1a1a2e transparent",
            }}>
              {activeList.map((p) => (
                <ProblemCard
                  key={p.url}
                  problem={p}
                  onToggle={toggleRevised}
                  onDelete={deleteProblem}
                  onSnooze={snoozeProblem}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── FOOTER ── */}
      <Footer />
    </div>
  );
}