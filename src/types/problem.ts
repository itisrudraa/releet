export type Problem = {
  title: string;
  difficulty: string;
  url: string;
  savedAt: string;
  revised?: boolean;
  reviseAfterDays?: number;
  nextReviewDate?: string;
};

export type DifficultyFilter = "All" | "Easy" | "Medium" | "Hard";
export type SortOption = "due" | "saved" | "difficulty";
export type ReviewTab = "due" | "upcoming" | "revised";
