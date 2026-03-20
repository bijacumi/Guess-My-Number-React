import React from "react";
import { useGame } from "../../context/useGame";
import "./Footer.scss";

const Footer: React.FC = () => {
  const { currentTurns } = useGame();

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
