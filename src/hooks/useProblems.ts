import { useCallback, useEffect, useState } from "react";
import type { Problem } from "../types/problem";
import { loadProblems, saveProblems } from "../services/storage";

export function useProblems() {
  const [problems, setProblems] = useState<Problem[]>([]);

  useEffect(() => {
    const load = () => loadProblems(setProblems);
    load();
    chrome.storage.onChanged.addListener(load);
    return () => chrome.storage.onChanged.removeListener(load);
  }, []);

  const updateProblems = useCallback(async (updated: Problem[]) => {
    setProblems(updated);
    await saveProblems(updated);
  }, []);

  const deleteProblem = useCallback(
    async (url: string) => {
      await updateProblems(problems.filter((problem) => problem.url !== url));
    },
    [problems, updateProblems],
  );

  const toggleRevised = useCallback(
    async (url: string) => {
      await updateProblems(
        problems.map((problem) =>
          problem.url === url
            ? { ...problem, revised: !problem.revised }
            : problem,
        ),
      );
    },
    [problems, updateProblems],
  );

  const snoozeProblem = useCallback(
    async (url: string, days: number) => {
      await updateProblems(
        problems.map((problem) => {
          if (problem.url !== url) return problem;
          return {
            ...problem,
            revised: false,
            nextReviewDate: new Date(
              Date.now() + days * 24 * 60 * 60 * 1000,
            ).toISOString(),
          };
        }),
      );
    },
    [problems, updateProblems],
  );

  return { problems, deleteProblem, toggleRevised, snoozeProblem };
}
