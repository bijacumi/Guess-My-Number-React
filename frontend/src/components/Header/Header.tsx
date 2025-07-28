import React from "react";
import { useGame } from "../../context/useGame";
import { useTutorial } from "../../context/TutorialContext";
import "./Header.scss";

interface HeaderProps {
  onInstructionsClick: () => void;
  onTutorialClick: () => void;
}

const Header: React.FC<HeaderProps> = ({
  onInstructionsClick,
  onTutorialClick,
}) => {
  const { resetGame } = useGame();
  const { resetTutorial } = useTutorial();

  const handlePlayAgain = () => {
    resetGame();
    resetTutorial();
  };

  return (
    <header className="header">
      <div className="header-buttons">
        <button className="btn" onClick={handlePlayAgain}>
          Play Again
        </button>
        <button className="btn" onClick={onInstructionsClick}>
          Instructions
        </button>
        <button className="btn" onClick={onTutorialClick}>
          Tutorial
        </button>
      </div>
    </header>
  );
};

export default Header;
