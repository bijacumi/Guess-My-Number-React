import React from "react";
import { useTutorial } from "../../context/TutorialContext";
import TutorialCell from "./TutorialCell";
import "./Tutorial.scss";

const DigitsTable: React.FC = () => {
  const { tutorialState, markCell, getCellMark } = useTutorial();

  const handleCellMark = (
    rowIndex: number,
    cellIndex: number,
    mark: "in" | "out" | "undo"
  ) => {
    markCell(rowIndex, cellIndex, mark);
  };

  return (
    <table className="digits-table">
      <tbody>
        {tutorialState.digitsTable.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <TutorialCell
                key={cellIndex}
                value={cell}
                isClickable={cell !== ""}
                onMark={(mark) => handleCellMark(rowIndex, cellIndex, mark)}
                currentMark={getCellMark(rowIndex, cellIndex)}
                className="digits-cell"
              />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DigitsTable;
