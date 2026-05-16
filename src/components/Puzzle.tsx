import { useState, useCallback } from "react";
import type { Puzzle as PuzzleType } from "../types/puzzle";

interface PuzzleProps {
  puzzle: PuzzleType | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitAnswer: (answer: string) => void;
}

/* Puzzle component */
export function Puzzle({
  puzzle,
  isOpen,
  onClose,
  onSubmitAnswer,
}: PuzzleProps) {
  const [answer, setAnswer] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [hintLevel, setHintLevel] = useState(0);

  const hints = puzzle?.hints ?? [];
  const inputs = puzzle?.inputs ?? [];

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (answer.trim()) {
        onSubmitAnswer(answer.trim());
        setAnswer("");
      }
    },
    [answer, onSubmitAnswer]
  );

  const handleShowHint = useCallback(() => {
    setShowHint(true);
    setHintLevel((prev) => Math.min(prev + 1, hints.length));
  }, [hints.length]);

  const difficultyColor: Record<string, string> = {
    easy: "#4caf50",
    medium: "#ff9800",
    hard: "#f44336",
    expert: "#9c27b0",
  };

  if (!puzzle) return null;

  return (
    <div className={`puzzle-panel ${isOpen ? "puzzle-panel--open" : ""}`}>
      <button
        className="puzzle-panel__close"
        onClick={onClose}
        aria-label="Close puzzle"
      >
        ✕
      </button>

      <div className="puzzle-panel__header">
        <h3 className="puzzle-panel__title">{puzzle.title}</h3>
        <span
          className="puzzle-panel__difficulty"
          style={{ background: difficultyColor[puzzle.difficulty] || "#999" }}
        >
          {puzzle.difficulty}
        </span>
      </div>

      <p className="puzzle-panel__description">{puzzle.description}</p>

      {puzzle.storyContext && (
        <p className="puzzle-panel__story">
          <em>"{puzzle.storyContext}"</em>
        </p>
      )}

      {/* Hints section */}
      <div className="puzzle-panel__hints">
        {!showHint && hints.length > 0 && (
          <button
            className="puzzle-panel__hint-btn"
            onClick={handleShowHint}
          >
            💡 Show Hint
          </button>
        )}
        {showHint &&
          hints.slice(0, hintLevel).map((hint, i) => (
            <div key={i} className="puzzle-panel__hint">
              <span className="puzzle-panel__hint-label">Hint {hint.level}:</span>{" "}
              {hint.text}
              {hint.penaltyScore && (
                <span className="puzzle-panel__hint-penalty">
                  (-{hint.penaltyScore} pts)
                </span>
              )}
            </div>
          ))}
        {showHint && hintLevel < hints.length && (
          <button
            className="puzzle-panel__hint-btn"
            onClick={handleShowHint}
          >
            💡 Next Hint
          </button>
        )}
      </div>

      {/* Answer form */}
      <form className="puzzle-panel__form" onSubmit={handleSubmit}>
        <input
          className="puzzle-panel__input"
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder={inputs[0]?.placeholder || "Enter your answer..."}
          aria-label={inputs[0]?.label || "Answer"}
        />
        <button className="puzzle-panel__submit" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
}
