/// <reference types="chrome" />

import { useMemo, useState } from "react";
import StatCard from "./components/dashboard/StatCard";
import TodayCard from "./components/dashboard/TodayCard";
import ProblemCard from "./components/dashboard/ProblemCard";
import Footer from "./components/dashboard/Footer";
import { useProblems } from "./hooks/useProblems";
import { getProblemGroups, matchesProblemFilters, sortProblems } from "./utils/problems";
import type { DifficultyFilter, ReviewTab, SortOption } from "./types/problem";

const filters: DifficultyFilter[] = ["All", "Easy", "Medium", "Hard"];
const sorts: { value: SortOption; label: string }[] = [
  { value: "due", label: "by date" },
  { value: "saved", label: "newest" },
  { value: "difficulty", label: "difficulty" },
];

const filterClasses: Record<DifficultyFilter, string> = {
  All: "border-[#ffa11640] bg-[#ffa11610] text-[#ffa116]",
  Easy: "border-green-400/25 bg-green-400/5 text-green-400",
  Medium: "border-amber-400/25 bg-amber-400/5 text-amber-400",
  Hard: "border-red-400/25 bg-red-400/5 text-red-400",
};

const tabData: Record<ReviewTab, { label: string; color: string }> = {
  due: { label: "Due", color: "#f87171" },
  upcoming: { label: "Upcoming", color: "#fbbf24" },
  revised: { label: "Revised", color: "#4ade80" },
};

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

  return (
    <div className="flex min-h-screen flex-col bg-releet-bg font-sans text-slate-200">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-[#1a1a2e] bg-releet-header px-9 py-3.5">
        <div className="flex items-center gap-2.5"><span className="inline-block h-[7px] w-[7px] rounded-full bg-amber-400" /><strong className="font-mono text-[15px] text-slate-100">ReLeet</strong></div>
        <div className="flex items-center gap-3.5">
          {groups.due.length > 0 && <span className="rounded-full border border-red-400/20 bg-red-400/5 px-2.5 py-[3px] font-mono text-[11px] text-red-400">{groups.due.length} due today</span>}
          <span className="font-mono text-[11px] text-[#6b7280]">{problems.length} saved</span>
        </div>
      </header>

      <main className="w-full flex-1">
        <div className="mx-auto w-full max-w-[860px] px-9 pb-10 pt-7">
          <div className="mb-7 flex gap-2.5">
            <StatCard label="due now" value={filteredGroups.due.length} accent="#e07a7a" bg="#181212" topBorder="#c95f5f" />
            <StatCard label="upcoming" value={filteredGroups.upcoming.length} accent="#d9b04c" bg="#181511" topBorder="#c7952d" />
            <StatCard label="revised" value={filteredGroups.revised.length} accent="#66c78a" bg="#111613" topBorder="#4da96f" />
            <StatCard label="total" value={problems.length} accent="#d8a14f" bg="#141414" topBorder="#c1842f" />
          </div>

          {groups.due.length > 0 ? (
            <section className="mb-8">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5"><div className="h-[18px] w-[3px] rounded-sm bg-red-400" /><strong className="text-sm">Review today</strong><span className="rounded-full bg-red-400/10 px-2 py-px text-[11px] font-bold text-red-400">{groups.due.length}</span></div>
                <span className="font-mono text-[11px] text-[#6b7280]">{todayLabel}</span>
              </div>
              <div className="flex flex-col gap-1.5 rounded-[10px] border border-[#1a1a2e] bg-releet-today p-2.5">
                {groups.due.map((p) => <TodayCard key={p.url} problem={p} onToggle={toggleRevised} onSnooze={snoozeProblem} />)}
              </div>
              {totalDue > 0 && <div className="mt-2.5"><div className="h-1 overflow-hidden rounded-sm bg-[#1a1a2e]"><div className="h-full bg-gradient-to-r from-green-400 to-cyan-400" style={{ width: `${pct}%` }} /></div><div className="mt-1.5 flex justify-between"><span className="text-[11px] text-[#6b7280]">{doneToday} of {totalDue} done today</span><span className={`text-[11px] ${pct === 100 ? "text-green-400" : "text-[#6b7280]"}`}>{pct}%</span></div></div>}
            </section>
          ) : (
            <section className="mb-8 flex items-center gap-3.5 rounded-[10px] border border-green-400/20 bg-[#101612] px-[22px] py-[18px]">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#142a1d] text-green-400">✓</div>
              <div><div className="text-sm font-semibold text-[#66c78a]">All caught up!</div><div className="text-xs text-[#1e4d30]">No reviews due · {todayLabel}</div></div>
            </section>
          )}

          <div className="mb-[18px] flex items-center gap-3"><div className="h-4 w-[3px] rounded-sm bg-[#ffa116]" /><span className="text-[11px] font-semibold tracking-[0.08em] text-[#6b7280]">ALL PROBLEMS</span><div className="h-px flex-1 bg-[#1a1a2e]" /></div>
          <div className="mb-2.5 flex flex-wrap gap-2">
            <input type="text" placeholder="search problems..." value={search} onChange={(e) => setSearch(e.target.value)} className="min-w-[180px] flex-1 rounded-lg border border-[#1a1a2e] bg-releet-card px-3.5 py-2.5 text-sm text-slate-300 outline-none placeholder:text-[#4a4a6a] focus:border-[#2a2a40]" />
            {filters.map((d) => { const active = filter === d; return <button key={d} onClick={() => setFilter(d)} className={`cursor-pointer rounded-lg border px-3.5 py-2.5 text-[11px] ${active ? filterClasses[d] : "border-[#1a1a2e] bg-transparent text-[#6b7280] hover:text-slate-300"}`}>{d}</button>; })}
          </div>

          <div className="mb-[18px] flex items-center gap-1"><span className="mr-1 text-[11px] text-[#6b7280]">sort:</span>{sorts.map((item) => <button key={item.value} onClick={() => setSort(item.value)} className={`cursor-pointer rounded px-2.5 py-1 text-[11px] ${sort === item.value ? "border border-[#2a2a40] bg-releet-card text-[#ffa116]" : "border border-transparent bg-transparent text-[#6b7280] hover:text-slate-300"}`}>{item.label}</button>)}</div>

          <div className="mb-3.5 flex border-b border-[#1a1a2e]">
            {(Object.keys(tabData) as ReviewTab[]).map((tab) => { const data = tabData[tab]; const list = filteredGroups[tab]; const active = activeTab === tab; return <button key={tab} onClick={() => setActiveTab(tab)} className={`border-b-2 bg-transparent px-5 py-2.5 text-xs font-normal ${active ? "font-bold" : "border-transparent text-[#6b7280]"}`} style={active ? { borderBottomColor: data.color, color: data.color } : undefined}>{data.label} ({list.length})</button>; })}
          </div>

          {activeList.length === 0 ? <div className="pt-[60px] text-center text-sm text-[#6b7280]">nothing here yet</div> : <div className="flex max-h-[480px] flex-col gap-1.5 overflow-y-auto pr-1">{activeList.map((p) => <ProblemCard key={p.url} problem={p} onToggle={toggleRevised} onDelete={deleteProblem} onSnooze={snoozeProblem} />)}</div>}
        </div>
      </main>
      <Footer />
    </div>
  );
}
