/// <reference types="chrome" />
import { useEffect, useState } from "react";

type Problem = {
  title: string;
  difficulty: string;
  url: string;
  savedAt: string;
  revised?: boolean;
};

type DifficultyFilter = "All" | "Easy" | "Medium" | "Hard";

function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const colorMap: Record<string, string> = {
    Easy: "#00b8a3",
    Medium: "#ffc01e",
    Hard: "#ff375f",
  };
  const color = colorMap[difficulty] ?? "#aaa";
  return (
    <span style={{ color, fontWeight: 600, fontSize: "13px" }}>
      {difficulty}
    </span>
  );
}

export default function App() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<DifficultyFilter>("All");

  // Load from chrome.storage.local on mount
  useEffect(() => {

    function loadProblems() {

      chrome.storage.local.get(
        "savedProblems",
        (result) => {

          console.log(result);

          const cleaned = (
            (result["savedProblems"] as Problem[]) || []
          ).filter(
            (p) => p.title && p.difficulty
          );

          setProblems(cleaned);
        }
      );
    }

    // Initial load
    loadProblems();

    // Live updates
    chrome.storage.onChanged.addListener(
      loadProblems
    );

    // Cleanup
    return () => {

      chrome.storage.onChanged.removeListener(
        loadProblems
      );

    };

  }, []);

  // Delete by URL (safer than index)
  async function deleteProblem(url: string) {
    const updated = problems.filter((p) => p.url !== url);
    setProblems(updated);
    await chrome.storage.local.set({ savedProblems: updated });
  }

  // Toggle revised by URL
  async function toggleRevised(url: string) {
    const updated = problems.map((p) =>
      p.url === url ? { ...p, revised: !p.revised } : p
    );
    setProblems(updated);
    await chrome.storage.local.set({ savedProblems: updated });
  }

  // Apply search + difficulty filter
  const visible = problems.filter((p) => {

    const title = p.title || "";

    const matchSearch =
      title.toLowerCase().includes(
        search.toLowerCase()
      );

    const matchFilter =
      filter === "All" ||
      p.difficulty === filter;

    return matchSearch && matchFilter;
  });;

  const filters: DifficultyFilter[] = ["All", "Easy", "Medium", "Hard"];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f0f1a",
        color: "white",
        fontFamily: "'Segoe UI', sans-serif",
        padding: "48px 40px",
        maxWidth: "860px",
        margin: "0 auto",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: "36px" }}>
        <h1 style={{ fontSize: "30px", fontWeight: 700, margin: 0 }}>
          🔁 ReLeet
        </h1>
        <p style={{ color: "#666", marginTop: "6px", fontSize: "14px" }}>
          {problems.length} problem{problems.length !== 1 ? "s" : ""} saved for revision
        </p>
      </div>

      {/* Search + Filter Bar */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "28px",
          flexWrap: "wrap",
        }}
      >
        <input
          type="text"
          placeholder="Search problems..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: 1,
            minWidth: "200px",
            padding: "10px 16px",
            borderRadius: "10px",
            border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(255,255,255,0.05)",
            color: "white",
            fontSize: "14px",
            outline: "none",
          }}
        />

        {filters.map((d) => (
          <button
            key={d}
            onClick={() => setFilter(d)}
            style={{
              padding: "10px 18px",
              borderRadius: "10px",
              border:
                filter === d
                  ? "1px solid rgba(255,165,0,0.5)"
                  : "1px solid rgba(255,255,255,0.08)",
              background:
                filter === d
                  ? "rgba(255,165,0,0.12)"
                  : "rgba(255,255,255,0.03)",
              color: filter === d ? "orange" : "#777",
              cursor: "pointer",
              fontWeight: filter === d ? 600 : 400,
              fontSize: "13px",
              transition: "all 0.15s ease",
            }}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Empty state */}
      {visible.length === 0 && (
        <p
          style={{
            color: "#444",
            textAlign: "center",
            marginTop: "100px",
            fontSize: "15px",
          }}
        >
          {problems.length === 0
            ? "No problems saved yet. Get a Wrong Answer on LeetCode to start! 💪"
            : "No problems match your search."}
        </p>
      )}

      {/* Problem Cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {visible.map((problem) => (
          <div
            key={problem.url}
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "14px",
              padding: "18px 22px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "16px",
              opacity: problem.revised ? 0.45 : 1,
              transition: "opacity 0.2s ease",
            }}
          >
            {/* Left: info */}
            <div>
              <a
                href={problem.url}
                target="_blank"
                rel="noreferrer"
                style={{
                  color: "white",
                  fontWeight: 600,
                  fontSize: "15px",
                  textDecoration: "none",
                }}
              >
                {problem.title ?? "Untitled"}
              </a>

              <div
                style={{
                  marginTop: "6px",
                  display: "flex",
                  gap: "14px",
                  alignItems: "center",
                }}
              >
                <DifficultyBadge difficulty={problem.difficulty ?? "Unknown"} />
                <span style={{ color: "#555", fontSize: "12px" }}>
                  {new Date(problem.savedAt).toLocaleDateString()}
                </span>
                {problem.revised && (
                  <span style={{ color: "#00b8a3", fontSize: "12px" }}>
                    ✓ Revised
                  </span>
                )}
              </div>
            </div>

            {/* Right: actions */}
            <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
              <button
                onClick={() => toggleRevised(problem.url)}
                style={{
                  padding: "7px 13px",
                  borderRadius: "8px",
                  border: "1px solid rgba(0,184,163,0.25)",
                  background: "rgba(0,184,163,0.07)",
                  color: "#00b8a3",
                  cursor: "pointer",
                  fontSize: "12px",
                  whiteSpace: "nowrap",
                }}
              >
                {problem.revised ? "Unmark" : "Mark Revised"}
              </button>

              <button
                onClick={() => deleteProblem(problem.url)}
                style={{
                  padding: "7px 13px",
                  borderRadius: "8px",
                  border: "1px solid rgba(255,60,60,0.25)",
                  background: "rgba(255,60,60,0.07)",
                  color: "#ff6b6b",
                  cursor: "pointer",
                  fontSize: "12px",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}