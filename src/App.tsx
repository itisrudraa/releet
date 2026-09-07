/// <reference types="chrome" />

import { useMemo, useState } from "react";
import StatCard from "./components/dashboard/StatCard";
import TodayCard from "./components/dashboard/TodayCard";
import ProblemCard from "./components/dashboard/ProblemCard";
import Footer from "./components/dashboard/Footer";
import { useProblems } from "./hooks/useProblems";
import { getDifficultyColor } from "./components/common/DiffBadge";
import { getProblemGroups, matchesProblemFilters, sortProblems } from "./utils/problems";
import type { DifficultyFilter, ReviewTab, SortOption } from "./types/problem";

const G = {
  pageBg: "#0f0f0f", headerBg: "#111111", cardBase: "#1a1a1a",
  todayBg: "#151515", statRed: "#181212", statOrange: "#181511",
  statGreen: "#111613", statBlue: "#141414", allClear: "#101612",
};

const filters: DifficultyFilter[] = ["All", "Easy", "Medium", "Hard"];
const sorts: { value: SortOption; label: string }[] = [
  { value: "due", label: "by date" }, { value: "saved", label: "newest" }, { value: "difficulty", label: "difficulty" },
];

export default function App() {
  const { problems, deleteProblem, toggleRevised, snoozeProblem } = useProblems();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<DifficultyFilter>("All");
  const [sort, setSort] = useState<SortOption>("due");
  const [activeTab, setActiveTab] = useState<ReviewTab>("due");

  const now = new Date();
  const groups = useMemo(() => getProblemGroups(problems, now), [problems]);
  const filtered = useMemo(() => problems.filter((p) => matchesProblemFilters(p, search, filter)), [problems, search, filter]);
  const filteredGroups = useMemo(() => getProblemGroups(filtered, now), [filtered]);
  const activeList = useMemo(() => sortProblems(filteredGroups[activeTab], sort), [filteredGroups, activeTab, sort]);
  const todayLabel = now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  const totalDue = groups.due.length;
  const doneToday = 0;
  const pct = totalDue > 0 ? Math.round((doneToday / totalDue) * 100) : 0;

  const tabData: Record<ReviewTab, { label: string; color: string }> = {
    due: { label: "Due", color: "#f87171" }, upcoming: { label: "Upcoming", color: "#fbbf24" }, revised: { label: "Revised", color: "#4ade80" },
  };

  return <div style={{ minHeight: "100vh", background: G.pageBg, color: "#e2e8f0", fontFamily: "'Segoe UI', system-ui, sans-serif", display: "flex", flexDirection: "column" }}>
    <header style={{ borderBottom: "1px solid #1a1a2e", padding: "14px 36px", display: "flex", alignItems: "center", justifyContent: "space-between", background: G.headerBg, position: "sticky", top: 0, zIndex: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}><span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#fbbf24", display: "inline-block" }} /><strong style={{ fontSize: "15px", color: "#f1f5f9", fontFamily: "'JetBrains Mono', monospace" }}>ReLeet</strong></div>
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>{groups.due.length > 0 && <span style={{ fontSize: "11px", color: "#f87171", background: "#f8717115", border: "1px solid #f8717130", padding: "3px 10px", borderRadius: "20px", fontFamily: "'JetBrains Mono', monospace" }}>{groups.due.length} due today</span>}<span style={{ color: "#6b7280", fontSize: "11px", fontFamily: "'JetBrains Mono', monospace" }}>{problems.length} saved</span></div>
    </header>
    <main style={{ flex: 1, width: "100%" }}><div style={{ maxWidth: "860px", margin: "0 auto", padding: "28px 36px 40px" }}>
      <div style={{ display: "flex", gap: "10px", marginBottom: "28px" }}>
        <StatCard label="due now" value={filteredGroups.due.length} accent="#e07a7a" bg={G.statRed} topBorder="#c95f5f" />
        <StatCard label="upcoming" value={filteredGroups.upcoming.length} accent="#d9b04c" bg={G.statOrange} topBorder="#c7952d" />
        <StatCard label="revised" value={filteredGroups.revised.length} accent="#66c78a" bg={G.statGreen} topBorder="#4da96f" />
        <StatCard label="total" value={problems.length} accent="#d8a14f" bg={G.statBlue} topBorder="#c1842f" />
      </div>
      {groups.due.length > 0 ? <section style={{ marginBottom: "32px" }}><div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}><div style={{ display: "flex", alignItems: "center", gap: "10px" }}><div style={{ width: "3px", height: "18px", background: "#f87171", borderRadius: "2px" }} /><strong style={{ fontSize: "14px" }}>Review today</strong><span style={{ fontSize: "11px", fontWeight: 700, color: "#f87171", background: "#f8717118", padding: "1px 9px", borderRadius: "20px" }}>{groups.due.length}</span></div><span style={{ fontSize: "11px", color: "#6b7280", fontFamily: "'JetBrains Mono', monospace" }}>{todayLabel}</span></div><div style={{ background: G.todayBg, border: "1px solid #1a1a2e", borderRadius: "10px", padding: "10px", display: "flex", flexDirection: "column", gap: "6px" }}>{groups.due.map((p) => <TodayCard key={p.url} problem={p} onToggle={toggleRevised} onSnooze={snoozeProblem} />)}</div>{totalDue > 0 && <div style={{ marginTop: "10px" }}><div style={{ height: "4px", background: "#1a1a2e", borderRadius: "2px", overflow: "hidden" }}><div style={{ height: "100%", width: `${pct}%`, background: "linear-gradient(90deg, #4ade80, #22d3ee)" }} /></div><div style={{ display: "flex", justifyContent: "space-between", marginTop: "5px" }}><span style={{ fontSize: "11px", color: "#6b7280" }}>{doneToday} of {totalDue} done today</span><span style={{ fontSize: "11px", color: pct === 100 ? "#4ade80" : "#6b7280" }}>{pct}%</span></div></div>}</section> : <section style={{ marginBottom: "32px", background: G.allClear, border: "1px solid #2d6a4430", borderRadius: "10px", padding: "18px 22px", display: "flex", alignItems: "center", gap: "14px" }}><div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#142a1d", display: "flex", alignItems: "center", justifyContent: "center", color: "#48c774" }}>✓</div><div><div style={{ fontSize: "14px", fontWeight: 600, color: "#66c78a" }}>All caught up!</div><div style={{ fontSize: "12px", color: "#1e4d30" }}>No reviews due · {todayLabel}</div></div></section>}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "18px" }}><div style={{ width: "3px", height: "16px", background: "#ffa116", borderRadius: "2px" }} /><span style={{ fontSize: "11px", fontWeight: 600, color: "#6b7280", letterSpacing: "0.08em" }}>ALL PROBLEMS</span><div style={{ flex: 1, height: "1px", background: "#1a1a2e" }} /></div>
      <div style={{ display: "flex", gap: "8px", marginBottom: "10px", flexWrap: "wrap" }}><input type="text" placeholder="search problems..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ flex: 1, minWidth: "180px", padding: "9px 14px", borderRadius: "8px", border: "1px solid #1a1a2e", background: G.cardBase, color: "#cbd5e1", fontSize: "14px", outline: "none" }} />{filters.map((d) => { const active = filter === d; const c = d !== "All" ? getDifficultyColor(d) : null; return <button key={d} onClick={() => setFilter(d)} style={{ padding: "9px 14px", borderRadius: "8px", border: active ? `1px solid ${c?.border ?? "#ffa11640"}` : "1px solid #1a1a2e", background: active ? c?.bg ?? "#ffa11610" : "transparent", color: active ? c?.text ?? "#ffa116" : "#6b7280", cursor: "pointer", fontSize: "11px" }}>{d}</button>; })}</div>
      <div style={{ display: "flex", gap: "4px", marginBottom: "18px", alignItems: "center" }}><span style={{ fontSize: "11px", color: "#6b7280", marginRight: "4px" }}>sort:</span>{sorts.map((item) => <button key={item.value} onClick={() => setSort(item.value)} style={{ padding: "4px 11px", borderRadius: "5px", border: sort === item.value ? "1px solid #2a2a40" : "1px solid transparent", background: sort === item.value ? G.cardBase : "transparent", color: sort === item.value ? "#ffa116" : "#6b7280", cursor: "pointer", fontSize: "11px" }}>{item.label}</button>)}</div>
      <div style={{ display: "flex", borderBottom: "1px solid #1a1a2e", marginBottom: "14px" }}>{(Object.keys(tabData) as ReviewTab[]).map((tab) => { const data = tabData[tab]; const list = filteredGroups[tab]; const active = activeTab === tab; return <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: "10px 20px", border: "none", borderBottom: active ? `2px solid ${data.color}` : "2px solid transparent", background: "transparent", color: active ? data.color : "#6b7280", cursor: "pointer", fontSize: "12px", fontWeight: active ? 700 : 400 }}>{data.label} ({list.length})</button>; })}</div>
      {activeList.length === 0 ? <div style={{ textAlign: "center", paddingTop: "60px", color: "#6b7280", fontSize: "14px" }}>nothing here yet</div> : <div style={{ maxHeight: "480px", overflowY: "auto", paddingRight: "4px", display: "flex", flexDirection: "column", gap: "6px" }}>{activeList.map((p) => <ProblemCard key={p.url} problem={p} onToggle={toggleRevised} onDelete={deleteProblem} onSnooze={snoozeProblem} />)}</div>}
    </div></main>
    <Footer />
  </div>;
}
