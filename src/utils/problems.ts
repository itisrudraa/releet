import type { DifficultyFilter, Problem, SortOption } from "../types/problem";
import { isDue } from "./dates";

export function matchesProblemFilters(
  problem: Problem,
  search: string,
  filter: DifficultyFilter,
) {
  return (
    (problem.title || "").toLowerCase().includes(search.toLowerCase()) &&
    (filter === "All" || problem.difficulty === filter)
  );
}

export function sortProblems(problems: Problem[], sort: SortOption) {
  if (sort === "saved") {
    return [...problems].sort(
      (a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime(),
    );
  }

  if (sort === "difficulty") {
    const order: Record<string, number> = { Easy: 0, Medium: 1, Hard: 2 };
    return [...problems].sort(
      (a, b) => (order[a.difficulty] ?? 3) - (order[b.difficulty] ?? 3),
    );
  }

  return [...problems].sort((a, b) => {
    if (!a.nextReviewDate) return 1;
    if (!b.nextReviewDate) return -1;
    return (
      new Date(a.nextReviewDate).getTime() - new Date(b.nextReviewDate).getTime()
    );
  });
}

export function getProblemGroups(problems: Problem[], now = new Date()) {
  return {
    due: problems.filter((p) => !p.revised && isDue(p.nextReviewDate, now)),
    upcoming: problems.filter(
      (p) => !p.revised && p.nextReviewDate && new Date(p.nextReviewDate) > now,
    ),
    revised: problems.filter((p) => p.revised),
  };
}
