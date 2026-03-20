import React from "react";
import { useTutorial } from "../../context/TutorialContext";
import "./StrategyToggle.scss";

const StrategyToggle: React.FC = () => {
  const { strategyMode, toggleStrategyMode } = useTutorial();

  return (
    <div className="strategy-toggle">
      <div className="toggle-container">
        <button
          className={`toggle-btn ${
            strategyMode === "automatic" ? "active" : ""
          }`}
          onClick={toggleStrategyMode}
        >
          Automatic Strategy
        </button>
        <button
          className={`toggle-btn ${strategyMode === "manual" ? "active" : ""}`}
          onClick={toggleStrategyMode}
        >
          Manual Strategy
        </button>
      </div>
    </div>
  );
};

export default StrategyToggle;
