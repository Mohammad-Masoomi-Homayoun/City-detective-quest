import { useState, useEffect, useCallback, useMemo } from "react";
import { useGeolocation } from "../hooks/useGeolocation";
import { useProximityAlert } from "../hooks/useProximityAlert";
import { useQuests } from "../hooks/useQuests";
import { MapView } from "../components/MapView";
import { Puzzle } from "../components/Puzzle";
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

  const [showSitePanel, setShowSitePanel] = useState(false);
  const [showPuzzle, setShowPuzzle] = useState(false);
  const [activeQuestIndex, setActiveQuestIndex] = useState(-1);

  // Show puzzle panel directly when detective enters an investigation site
  useEffect(() => {
    if (insideCircleIndex !== -1) {
      setActiveQuestIndex(insideCircleIndex);
      setShowSitePanel(false);
      setShowPuzzle(true);
    } else {
      setShowPuzzle(false);
    }
  }, [insideCircleIndex]);

  const handleStartPuzzle = useCallback(() => {
    setShowSitePanel(false);
    setShowPuzzle(true);
  }, []);

  const handleBackToMap = useCallback(() => {
    setShowPuzzle(false);
  }, []);

  const handleCloseSitePanel = useCallback(() => {
    setShowSitePanel(false);
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

      {/* Site panel — shows when detective is inside a zone */}
      {activeQuestIndex !== -1 && showSitePanel && (
        <div className="site-panel site-panel--open">
          <button
            className="site-panel__close"
            onClick={handleCloseSitePanel}
            aria-label="Close"
          >
            ✕
          </button>
          <h3 className="site-panel__title">
            📍 {investigationSites[activeQuestIndex]?.title}
          </h3>
          <p className="site-panel__text">
            You are inside the investigation zone. Ready to solve the puzzle?
          </p>
          <button className="site-panel__action" onClick={handleStartPuzzle}>
            🧩 Start Puzzle
          </button>
        </div>
      )}

      {/* Puzzle full-screen view */}
      {activeQuestIndex !== -1 && quests[activeQuestIndex] && (
        <Puzzle
          puzzle={quests[activeQuestIndex].puzzle}
          isOpen={showPuzzle}
          onClose={handleBackToMap}
          onSubmitAnswer={handleSubmitAnswer}
        />
      )}
    </div>
  );
}
