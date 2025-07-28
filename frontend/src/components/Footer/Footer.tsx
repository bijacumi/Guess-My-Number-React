import React, { useContext } from "react";
import { GameContext } from "../../context/GameContext";
import "./Footer.scss";

const Footer: React.FC = () => {
  const gameContext = useContext(GameContext);

  if (!gameContext) {
    throw new Error("Footer must be used within a GameProvider");
  }

  const { currentTurns } = gameContext;

  return (
    <footer>
      <p className="scores">
        Games played: <span>1</span>; Number of turns this game:{" "}
        <span>{10 - currentTurns}</span>; Average number of turns:{" "}
        <span>{(10 - currentTurns || 0).toFixed(2)}</span>
      </p>
    </footer>
  );
};

export default Footer;
