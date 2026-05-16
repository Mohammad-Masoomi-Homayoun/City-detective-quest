export interface Clue {
  _id?: string;
  text: string;
  image?: string;
  audio?: string;
  discovered: boolean;
}

export interface Hint {
  _id?: string;
  level: number;
  text: string;
  penaltyScore?: number;
}

export type MediaType = "image" | "audio" | "video";

export interface MediaAsset {
  _id?: string;
  type: MediaType;
  url: string;
}

export interface PuzzleInput {
  _id?: string;
  label?: string;
  type?: string;
  placeholder?: string;
}

export interface Solution {
  _id?: string;
  answer: string;
  caseSensitive: boolean;
}

export type ValidationType = "exact" | "contains" | "regex" | "custom";

export interface Validation {
  _id?: string;
  type: ValidationType;
  pattern?: string;
}

export interface ScoreRule {
  _id?: string;
  baseScore: number;
  timeBonusPerSecond?: number;
  hintPenalty?: number;
}

export type PuzzleType =
  | "code"
  | "riddle"
  | "cipher"
  | "physical"
  | "gps"
  | "audio"
  | "image"
  | "sequence"
  | "logic"
  | "qr"
  | "augmented-reality";

export type PuzzleDifficulty = "easy" | "medium" | "hard" | "expert";

export type PuzzleStatus = "draft" | "active" | "archived";

export interface Puzzle {
  _id?: string;
  title: string;
  description: string;
  storyContext?: string;
  type: PuzzleType;
  difficulty: PuzzleDifficulty;
  status: PuzzleStatus;
  clues: Clue[];
  hints: Hint[];
  inputs: PuzzleInput[];
  expectedSolution: Solution;
  timeLimit?: number;
  media: MediaAsset[];
  validation: Validation;
  scoring?: ScoreRule;
  createdAt?: string;
  updatedAt?: string;
}
