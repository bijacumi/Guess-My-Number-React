import React from "react";
import { useTutorial } from "../../context/TutorialContext";
import "./Tutorial.scss";

const CluesTable: React.FC = () => {
  const { tutorialState } = useTutorial();

  const getCellClassName = (rowIndex: number, cellIndex: number): string => {
    const classes = ["clues-cell"];

    if (tutorialState.crossedOutCells[rowIndex][cellIndex]) {
      classes.push("crossed-out");
    }

    if (tutorialState.highlightedCells[rowIndex][cellIndex]) {
      classes.push("highlighted");
    }

    return classes.join(" ");
  };

  // Check if entire column is crossed out
  const isColumnCrossedOut = (columnIndex: number): boolean => {
    return tutorialState.crossedOutCells.every((row) => row[columnIndex]);
  };

  return (
    <table className="clues-table">
      <tbody>
        {tutorialState.cluesTable.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <td
                key={cellIndex}
                className={`${getCellClassName(rowIndex, cellIndex)} ${
                  isColumnCrossedOut(cellIndex) ? "column-crossed-out" : ""
                }`}
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CluesTable;
