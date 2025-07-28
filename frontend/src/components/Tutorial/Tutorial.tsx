import React from "react";
import { useTutorial } from "../../context/TutorialContext";
import StrategyToggle from "./StrategyToggle";
import DigitsTable from "./DigitsTable";
import CluesTable from "./CluesTable";
import ManualStrategy from "./ManualStrategy";
import "./Tutorial.scss";

const Tutorial: React.FC = () => {
  const { isTutorialVisible, strategyMode } = useTutorial();

  if (!isTutorialVisible) {
    return (
      <div className="tutorial-container">
        <StrategyToggle />
        {strategyMode === "automatic" && (
          <div className="tutorial-section">
            <div className="table-header">
              <span>Digits group</span>
              <span>Clues</span>
            </div>
            <div className="table-content">
              <DigitsTable />
              <CluesTable />
            </div>
          </div>
        )}
        {strategyMode === "manual" && <ManualStrategy />}
      </div>
    );
  }

  return (
    <div className="tutorial-section">
      {strategyMode === "automatic" ? (
        <>
          <div className="table-header">
            <span>Digits group</span>
            <span>Clues</span>
          </div>
          <div className="table-content">
            <DigitsTable />
            <CluesTable />
          </div>
        </>
      ) : (
        <ManualStrategy />
      )}
    </div>
  );
};

export default Tutorial;
