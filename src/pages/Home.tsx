import { useState, useEffect, useCallback, useMemo } from "react";
import { useGeolocation } from "../hooks/useGeolocation";
import { useProximityAlert } from "../hooks/useProximityAlert";
import { useQuests } from "../hooks/useQuests";
import { MapView } from "../components/MapView";
import { PuzzlePanel } from "../components/PuzzlePanel";
import type { InvestigationSite } from "../types/investigationSite";

export function Home() {
  const { location, loading: locationLoading, error: locationError } = useGeolocation();
  const { quests, loading: questsLoading, error: questsError, retry } = useQuests();

  const investigationSites: InvestigationSite[] = useMemo(
    () =>
      quests.map((q) => ({
        id: q.investigationSite.id,
        lat: q.investigationSite.lat,
        lng: q.investigationSite.lng,
        radius: q.investigationSite.radius,
        status: q.investigationSite.status || "OPEN",
        title: q.investigationSite.title,
      })),
    [quests]
  );

  const { insideCircleIndex, showNotification, dismissNotification } =
    useProximityAlert(location, investigationSites);

  const [showPuzzle, setShowPuzzle] = useState(false);
  const [activeQuestIndex, setActiveQuestIndex] = useState(-1);

  // Open puzzle panel when detective enters an investigation site
  useEffect(() => {
    if (insideCircleIndex !== -1) {
      setActiveQuestIndex(insideCircleIndex);
      setShowPuzzle(true);
    }
  }, [insideCircleIndex]);

  const handleClosePuzzle = useCallback(() => {
    setShowPuzzle(false);
  }, []);

  const handleSubmitAnswer = useCallback(
    (answer: string) => {
      const quest = quests[activeQuestIndex];
      if (!quest) return;

      const expected = quest.puzzle.expectedSolution;
      const correct = expected.caseSensitive
        ? answer === expected.answer
        : answer.toLowerCase() === expected.answer.toLowerCase();

      if (correct) {
        alert("✅ Correct! Case solved!");
        setShowPuzzle(false);
      } else {
        alert("❌ Wrong answer. Try again!");
      }
    },
    [activeQuestIndex, quests]
  );

  if (locationLoading || questsLoading) {
    return (
      <div className="status-screen">
        <div className="status-content">
          <div className="spinner" />
          <p>{questsLoading ? "Loading quests..." : "Detecting your location..."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="home">
      {(locationError || questsError) && (
        <div className="error-banner">
          <p>
            ⚠️ {locationError && `Location: ${locationError}. `}
            {questsError && `Quests: ${questsError}. `}
            {locationError && "Showing default location (Eindhoven)."}
          </p>
          {questsError && (
            <button className="error-banner__retry" onClick={retry}>
              Retry
            </button>
          )}
        </div>
      )}

      {showNotification && insideCircleIndex !== -1 && (
        <div className="proximity-notification">
          <div className="proximity-notification__content">
            <span className="proximity-notification__icon">🔍</span>
            <div>
              <strong>You entered a mystery zone!</strong>
              <p>
                {investigationSites[insideCircleIndex].title} — Radius:{" "}
                {investigationSites[insideCircleIndex].radius}m
              </p>
            </div>
            <button
              className="proximity-notification__dismiss"
              onClick={dismissNotification}
              aria-label="Dismiss"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <MapView
        location={location}
        circles={investigationSites}
        activeCircleIndex={insideCircleIndex}
      />

      {activeQuestIndex !== -1 && quests[activeQuestIndex] && (
        <PuzzlePanel
          puzzle={quests[activeQuestIndex].puzzle}
          isOpen={showPuzzle}
          onClose={handleClosePuzzle}
          onSubmitAnswer={handleSubmitAnswer}
        />
      )}
    </div>
  );
}
