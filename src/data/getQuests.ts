import type { Quest } from "../types/quest";

export function getQuests(): Quest[] {
  return [
    {
      id: 1,
      investigationSite: {
        id: 1,
        lat: 51.432742,
        lng: 5.439947,
        radius: 50,
        status: "OPEN",
        title: "The Missing Briefcase",
      },
      puzzle: {
        title: "The Hidden Code",
        description: "A briefcase was found near the station with a coded lock. Decode the message to unlock it.",
        storyContext: "Witnesses saw a man in a trench coat drop the briefcase and run.",
        type: "cipher",
        difficulty: "medium",
        status: "active",
        clues: [
          { text: "Look at the first letter of each word on the note", discovered: false },
        ],
        hints: [
          { level: 1, text: "It's an acrostic — read vertically", penaltyScore: 10 },
        ],
        inputs: [
          { label: "Your answer", type: "text", placeholder: "Enter decoded message" },
        ],
        expectedSolution: { answer: "HELLO", caseSensitive: false },
        timeLimit: 300,
        media: [],
        validation: { type: "exact" },
        scoring: { baseScore: 100, timeBonusPerSecond: 0.5, hintPenalty: 10 },
      },
    },
    {
      id: 2,
      investigationSite: {
        id: 2,
        lat: 51.423634,
        lng: 5.501457,
        radius: 20,
        status: "OPEN",
        title: "Suspicious Footprints",
      },
      puzzle: {
        title: "Follow the Trail",
        description: "Strange footprints lead to a locked gate. Solve the riddle engraved on the lock.",
        storyContext: "The footprints appear only at night and vanish by morning.",
        type: "riddle",
        difficulty: "easy",
        status: "active",
        clues: [
          { text: "I have keys but no locks. I have space but no room. What am I?", discovered: false },
        ],
        hints: [
          { level: 1, text: "You're using one right now", penaltyScore: 5 },
        ],
        inputs: [
          { label: "Answer", type: "text", placeholder: "What is it?" },
        ],
        expectedSolution: { answer: "keyboard", caseSensitive: false },
        timeLimit: 180,
        media: [],
        validation: { type: "exact" },
        scoring: { baseScore: 50, hintPenalty: 5 },
      },
    },
    {
      id: 3,
      investigationSite: {
        id: 3,
        lat: 51.428742,
        lng: 5.479947,
        radius: 79,
        status: "OPEN",
        title: "The Abandoned Warehouse",
      },
      puzzle: {
        title: "Crack the Safe",
        description: "Inside the warehouse you find a safe with a 4-digit combination. A sequence of numbers is scratched on the wall.",
        storyContext: "The warehouse has been abandoned for years, but someone was here recently.",
        type: "sequence",
        difficulty: "hard",
        status: "active",
        clues: [
          { text: "2, 4, 8, 16, ?", discovered: false },
        ],
        hints: [
          { level: 1, text: "Each number is doubled", penaltyScore: 15 },
          { level: 2, text: "The answer is 32", penaltyScore: 30 },
        ],
        inputs: [
          { label: "Combination", type: "text", placeholder: "Enter the next number" },
        ],
        expectedSolution: { answer: "32", caseSensitive: false },
        timeLimit: 240,
        media: [],
        validation: { type: "exact" },
        scoring: { baseScore: 150, timeBonusPerSecond: 1, hintPenalty: 15 },
      },
    },
  ];
}
