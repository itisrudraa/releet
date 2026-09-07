import type { Problem } from "../types/problem";

const STORAGE_KEY = "savedProblems";

export function loadProblems(onLoaded: (problems: Problem[]) => void) {
  chrome.storage.local.get(STORAGE_KEY, (result) => {
    const problems = ((result[STORAGE_KEY] as Problem[]) || []).filter(
      (problem) => problem.title && problem.difficulty,
    );
    onLoaded(problems);
  });
}

export async function saveProblems(problems: Problem[]) {
  await chrome.storage.local.set({ [STORAGE_KEY]: problems });
}
