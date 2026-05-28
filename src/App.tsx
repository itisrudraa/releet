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

type DifficultyFilter =
  | "All"
  | "Easy"
  | "Medium"
  | "Hard";

type SortOption =
  | "due"
  | "saved"
  | "difficulty";

const DIFFICULTY_COLOR: Record<
  string,
  string
> = {
  Easy: "#00b8a3",
  Medium: "#ffc01e",
  Hard: "#ff375f",
};

function DifficultyBadge({
  difficulty,
}: {
  difficulty: string;
}) {
  const color =
    DIFFICULTY_COLOR[difficulty] ??
    "#888";

  return (
    <span
      style={{
        color,
        fontSize: "11px",
        fontWeight: 600,
        background: color + "22",
        padding: "2px 8px",
        borderRadius: "4px",
        letterSpacing: "0.03em",
      }}
    >
      {difficulty}
    </span>
  );
}

function formatDate(
  iso: string
) {
  return new Date(
    iso
  ).toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
    }
  );
}

function getDaysUntil(
  iso: string
) {
  return Math.ceil(
    (
      new Date(iso).getTime() -
      Date.now()
    ) /
      (
        1000 *
        60 *
        60 *
        24
      )
  );
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent: string;
}) {
  return (
    <div
      style={{
        background: "#1e1e1e",
        border:
          "1px solid #2f2f2f",
        borderRadius: "10px",
        padding: "16px 20px",
        flex: 1,
      }}
    >
      <div
        style={{
          fontSize: "24px",
          fontWeight: 700,
          color: accent,
        }}
      >
        {value}
      </div>

      <div
        style={{
          fontSize: "11px",
          color: "#777",
          marginTop: "4px",
          letterSpacing: "0.06em",
        }}
      >
        {label}
      </div>
    </div>
  );
}

function ProblemCard({
  problem,
  onToggle,
  onDelete,
}: {
  problem: Problem;
  onToggle: (
    url: string
  ) => void;
  onDelete: (
    url: string
  ) => void;
}) {
  const [hovered, setHovered] =
    useState(false);

  const [
    deleteHovered,
    setDeleteHovered,
  ] = useState(false);

  const daysUntil =
    problem.nextReviewDate
      ? getDaysUntil(
          problem.nextReviewDate
        )
      : null;

  const isOverdue =
    daysUntil !== null &&
    daysUntil < 0;

  const diffColor =
    DIFFICULTY_COLOR[
      problem.difficulty
    ] ?? "#555";

  return (
    <div
      onMouseEnter={() =>
        setHovered(true)
      }
      onMouseLeave={() =>
        setHovered(false)
      }
      style={{
        background: hovered
          ? "#252525"
          : "#1c1c1c",

        border:
          "1px solid " +
          (
            hovered
              ? "#383838"
              : "#2a2a2a"
          ),

        borderLeft:
          `3px solid ${diffColor}`,

        borderRadius: "8px",

        padding: "14px 18px",

        display: "flex",

        alignItems: "center",

        justifyContent:
          "space-between",

        gap: "16px",

        opacity:
          problem.revised
            ? 0.5
            : 1,

        transition:
          "background 0.15s, border-color 0.15s, opacity 0.2s",
      }}
    >
      <div
        style={{
          flex: 1,
          minWidth: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "6px",
            flexWrap: "wrap",
          }}
        >
          <a
            href={problem.url}
            target="_blank"
            rel="noreferrer"
            style={{
              color: "#f0f0f0",
              fontWeight: 500,
              fontSize: "14px",
              textDecoration:
                "none",
              whiteSpace:
                "nowrap",
              overflow: "hidden",
              textOverflow:
                "ellipsis",
              maxWidth: "360px",
              display: "block",
            }}
          >
            {problem.title ??
              "Untitled"}
          </a>

          <DifficultyBadge
            difficulty={
              problem.difficulty ??
              "Unknown"
            }
          />
        </div>

        <div
          style={{
            display: "flex",
            gap: "16px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              color: "#666",
              fontSize: "12px",
            }}
          >
            Saved{" "}
            {formatDate(
              problem.savedAt
            )}
          </span>

          {problem.nextReviewDate && (
            <span
              style={{
                fontSize: "12px",
                color:
                  isOverdue
                    ? "#ff6b6b"
                    : "#777",
              }}
            >
              {isOverdue
                ? `${Math.abs(
                    daysUntil!
                  )}d overdue`
                : daysUntil === 0
                ? "Due today"
                : `Review ${formatDate(
                    problem.nextReviewDate
                  )}`}
            </span>
          )}

          {problem.revised && (
            <span
              style={{
                color: "#00b8a3",
                fontSize: "12px",
              }}
            >
              ✓ Revised
            </span>
          )}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: "6px",
          flexShrink: 0,
        }}
      >
        <button
          onClick={() =>
            onToggle(problem.url)
          }
          style={{
            padding: "6px 12px",
            borderRadius: "6px",
            border:
              "1px solid " +
              (
                problem.revised
                  ? "#1e3a2a"
                  : "#333"
              ),
            background:
              problem.revised
                ? "#0f2a1a"
                : "#252525",
            color:
              problem.revised
                ? "#00b8a3"
                : "#999",
            cursor: "pointer",
            fontSize: "12px",
            transition:
              "all 0.15s",
            whiteSpace:
              "nowrap",
            fontFamily:
              "'Segoe UI', system-ui, sans-serif",
          }}
        >
          {problem.revised
            ? "✓ Done"
            : "Mark done"}
        </button>

        <button
          onClick={() =>
            onDelete(problem.url)
          }
          onMouseEnter={() =>
            setDeleteHovered(true)
          }
          onMouseLeave={() =>
            setDeleteHovered(false)
          }
          style={{
            padding: "6px 10px",
            borderRadius: "6px",
            border:
              "1px solid " +
              (
                deleteHovered
                  ? "#ff6b6b55"
                  : "#333"
              ),
            background:
              deleteHovered
                ? "#2a1515"
                : "#252525",
            color:
              deleteHovered
                ? "#ff6b6b"
                : "#666",
            cursor: "pointer",
            fontSize: "13px",
            transition:
              "all 0.15s",
            fontFamily:
              "'Segoe UI', system-ui, sans-serif",
          }}
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [problems, setProblems] =
    useState<Problem[]>([]);

  const [search, setSearch] =
    useState("");

  const [filter, setFilter] =
    useState<DifficultyFilter>(
      "All"
    );

  const [sort, setSort] =
    useState<SortOption>(
      "due"
    );

  const [
    activeTab,
    setActiveTab,
  ] = useState<
    "due" |
    "upcoming" |
    "revised"
  >("due");

  useEffect(() => {
    function loadProblems() {
      chrome.storage.local.get(
        "savedProblems",
        (result) => {
          const cleaned = (
            (
              result[
                "savedProblems"
              ] as Problem[]
            ) || []
          ).filter(
            (p) =>
              p.title &&
              p.difficulty
          );

          setProblems(cleaned);
        }
      );
    }

    loadProblems();

    chrome.storage.onChanged.addListener(
      loadProblems
    );

    return () =>
      chrome.storage.onChanged.removeListener(
        loadProblems
      );
  }, []);

  async function deleteProblem(
    url: string
  ) {
    const updated =
      problems.filter(
        (p) => p.url !== url
      );

    setProblems(updated);

    await chrome.storage.local.set({
      savedProblems: updated,
    });
  }

  async function toggleRevised(
    url: string
  ) {
    const updated = problems.map(
      (p) =>
        p.url === url
          ? {
              ...p,
              revised:
                !p.revised,
            }
          : p
    );

    setProblems(updated);

    await chrome.storage.local.set({
      savedProblems: updated,
    });
  }

  function matchesFilters(
    p: Problem
  ) {
    const matchSearch = (
      p.title || ""
    )
      .toLowerCase()
      .includes(
        search.toLowerCase()
      );

    const matchFilter =
      filter === "All" ||
      p.difficulty === filter;

    return (
      matchSearch &&
      matchFilter
    );
  }

  const now = new Date();

  const filtered =
    problems.filter(
      matchesFilters
    );

  const dueProblems =
    filtered.filter(
      (p) =>
        !p.revised &&
        p.nextReviewDate &&
        new Date(
          p.nextReviewDate
        ) <= now
    );

  const upcomingProblems =
    filtered.filter(
      (p) =>
        !p.revised &&
        p.nextReviewDate &&
        new Date(
          p.nextReviewDate
        ) > now
    );

  const revisedProblems =
    filtered.filter(
      (p) => p.revised
    );

  function sortProblems(
    list: Problem[]
  ) {
    if (sort === "saved") {
      return [...list].sort(
        (a, b) =>
          new Date(
            b.savedAt
          ).getTime() -
          new Date(
            a.savedAt
          ).getTime()
      );
    }

    if (
      sort === "difficulty"
    ) {
      const order: Record<
        string,
        number
      > = {
        Easy: 0,
        Medium: 1,
        Hard: 2,
      };

      return [...list].sort(
        (a, b) =>
          (
            order[
              a.difficulty
            ] ?? 3
          ) -
          (
            order[
              b.difficulty
            ] ?? 3
          )
      );
    }

    return [...list].sort(
      (a, b) => {
        if (
          !a.nextReviewDate
        )
          return 1;

        if (
          !b.nextReviewDate
        )
          return -1;

        return (
          new Date(
            a.nextReviewDate
          ).getTime() -
          new Date(
            b.nextReviewDate
          ).getTime()
        );
      }
    );
  }

  const tabData = {
    due: {
      list: dueProblems,
      label: "Due",
      color: "#ff375f",
    },

    upcoming: {
      list: upcomingProblems,
      label: "Upcoming",
      color: "#ffc01e",
    },

    revised: {
      list: revisedProblems,
      label: "Revised",
      color: "#00b8a3",
    },
  };

  const activeList =
    sortProblems(
      tabData[activeTab].list
    );

  const filters:
    DifficultyFilter[] = [
    "All",
    "Easy",
    "Medium",
    "Hard",
  ];

  const sorts: {
    value: SortOption;
    label: string;
  }[] = [
    {
      value: "due",
      label: "By date",
    },

    {
      value: "saved",
      label: "Newest",
    },

    {
      value: "difficulty",
      label: "Difficulty",
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#181818",
        color: "#e8e8e8",
        fontFamily:
          "'Segoe UI', system-ui, sans-serif",
      }}
    >
      <div
        style={{
          borderBottom:
            "1px solid #282828",
          padding: "18px 40px",
          display: "flex",
          alignItems: "center",
          justifyContent:
            "space-between",
          background: "#1e1e1e",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius:
                "50%",
              background:
                "#f89f1b",
            }}
          />

          <span
            style={{
              fontWeight: 700,
              fontSize: "15px",
              color: "#f0f0f0",
            }}
          >
            ReLeet
          </span>
        </div>

        <span
          style={{
            color: "#666",
            fontSize: "12px",
          }}
        >
          {problems.length} problem
          {problems.length !== 1
            ? "s"
            : ""}
        </span>
      </div>

      <div
        style={{
          maxWidth: "820px",
          margin: "0 auto",
          padding: "28px 40px",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "10px",
            marginBottom: "24px",
          }}
        >
          <StatCard
            label="DUE NOW"
            value={
              dueProblems.length
            }
            accent="#ff375f"
          />

          <StatCard
            label="UPCOMING"
            value={
              upcomingProblems.length
            }
            accent="#ffc01e"
          />

          <StatCard
            label="REVISED"
            value={
              revisedProblems.length
            }
            accent="#00b8a3"
          />

          <StatCard
            label="TOTAL"
            value={
              problems.length
            }
            accent="#f89f1b"
          />
        </div>

        <div
          style={{
            display: "flex",
            gap: "8px",
            marginBottom: "10px",
            flexWrap: "wrap",
          }}
        >
          <input
            type="text"
            placeholder="Search problems..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            style={{
              flex: 1,
              minWidth: "200px",
              padding: "9px 16px",
              borderRadius: "8px",
              border:
                "1px solid #2f2f2f",
              background: "#222",
              color: "#e0e0e0",
              fontSize: "13px",
              outline: "none",
            }}
          />

          {filters.map((d) => (
            <button
              key={d}
              onClick={() =>
                setFilter(d)
              }
              style={{
                padding:
                  "9px 16px",
                borderRadius:
                  "8px",
                border:
                  filter === d
                    ? "1px solid #f89f1b66"
                    : "1px solid #2f2f2f",
                background:
                  filter === d
                    ? "#f89f1b18"
                    : "#222",
                color:
                  filter === d
                    ? "#f89f1b"
                    : "#888",
                cursor: "pointer",
                fontSize: "12px",
              }}
            >
              {d}
            </button>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            gap: "6px",
            marginBottom: "22px",
            alignItems: "center",
          }}
        >
          {sorts.map((s) => (
            <button
              key={s.value}
              onClick={() =>
                setSort(
                  s.value
                )
              }
              style={{
                padding:
                  "5px 12px",
                borderRadius:
                  "6px",
                border:
                  sort === s.value
                    ? "1px solid #383838"
                    : "1px solid transparent",
                background:
                  sort === s.value
                    ? "#252525"
                    : "transparent",
                color:
                  sort === s.value
                    ? "#ccc"
                    : "#666",
                cursor: "pointer",
                fontSize: "12px",
              }}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            borderBottom:
              "1px solid #282828",
            marginBottom: "18px",
          }}
        >
          {(
            [
              "due",
              "upcoming",
              "revised",
            ] as const
          ).map((tab) => {
            const {
              label,
              color,
              list,
            } = tabData[tab];

            const isActive =
              activeTab === tab;

            return (
              <button
                key={tab}
                onClick={() =>
                  setActiveTab(tab)
                }
                style={{
                  padding:
                    "10px 20px",
                  border: "none",
                  borderBottom:
                    isActive
                      ? `2px solid ${color}`
                      : "2px solid transparent",
                  background:
                    "transparent",
                  color: isActive
                    ? color
                    : "#666",
                  cursor:
                    "pointer",
                  fontSize:
                    "13px",
                  fontWeight:
                    isActive
                      ? 600
                      : 400,
                }}
              >
                {label} (
                {list.length})
              </button>
            );
          })}
        </div>

        {activeList.length ===
        0 ? (
          <div
            style={{
              textAlign:
                "center",
              paddingTop:
                "64px",
              color: "#555",
            }}
          >
            No problems here
            yet.
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection:
                "column",
              gap: "8px",
            }}
          >
            {activeList.map(
              (p) => (
                <ProblemCard
                  key={p.url}
                  problem={p}
                  onToggle={
                    toggleRevised
                  }
                  onDelete={
                    deleteProblem
                  }
                />
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}