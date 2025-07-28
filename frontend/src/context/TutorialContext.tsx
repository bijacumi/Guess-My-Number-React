import React, { createContext, useState, useContext } from "react";
import type { TutorialState, TutorialData } from "../utils/tutorialLogic";
import {
  initializeTutorialState,
  setTutorialDigitsFromInput,
  setTutorialClues,
} from "../utils/tutorialLogic";

interface TutorialContextType {
  tutorialState: TutorialState;
  tutorialData: TutorialData;
  isTutorialVisible: boolean;
  strategyMode: "automatic" | "manual";
  showTutorial: () => void;
  hideTutorial: () => void;
  toggleStrategyMode: () => void;
  resetTutorial: () => void;
  updateTutorialFromGuess: (
    guess: number,
    exactMatches: number,
    partialMatches: number,
    turn: number
  ) => void;
  markCell: (row: number, col: number, mark: "in" | "out" | "undo") => void;
  getCellMark: (row: number, col: number) => "in" | "out" | null;
  setGameDigitMarkCallback: (
    callback: (digit: string, mark: "not-in") => void
  ) => void;
}

export const TutorialContext = createContext<TutorialContextType | undefined>(
  undefined
);

export const useTutorial = () => {
  const context = useContext(TutorialContext);
  if (!context) {
    throw new Error("useTutorial must be used within a TutorialProvider");
  }
  return context;
};

export const TutorialProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [tutorialState, setTutorialState] = useState<TutorialState>(
    initializeTutorialState()
  );
  const [tutorialData, setTutorialData] = useState<TutorialData>({
    sumOfCenteredDisplaced: [],
    crossOuts: 0,
  });
  const [isTutorialVisible, setIsTutorialVisible] = useState<boolean>(false);
  const [strategyMode, setStrategyMode] = useState<"automatic" | "manual">(
    "automatic"
  );
  const [cellMarks, setCellMarks] = useState<Record<string, "in" | "out">>({});
  const [gameDigitMarkCallback, setGameDigitMarkCallback] = useState<
    ((digit: string, mark: "not-in") => void) | null
  >(null);

  const showTutorial = () => {
    setIsTutorialVisible(true);
  };

  const hideTutorial = () => {
    setIsTutorialVisible(false);
  };

  const toggleStrategyMode = () => {
    setStrategyMode((prev) => (prev === "automatic" ? "manual" : "automatic"));
  };

  const resetTutorial = () => {
    setTutorialState(initializeTutorialState());
    setTutorialData({
      sumOfCenteredDisplaced: [],
      crossOuts: 0,
    });
    setCellMarks({}); // Clear all cell marks
  };

  const updateTutorialFromGuess = (
    guess: number,
    exactMatches: number,
    partialMatches: number,
    turn: number
  ) => {
    let currentState = tutorialState;

    if (turn === 1) {
      // Convert guess to array of digits
      const guessDigits = String(guess).split("").map(Number);

      // Set up the digits table from the first guess
      currentState = setTutorialDigitsFromInput(guessDigits, tutorialState);
    }

    // Update clues based on the guess results
    const { state: newState, data: newData } = setTutorialClues(
      turn,
      exactMatches,
      partialMatches,
      currentState,
      tutorialData
    );

    setTutorialState(newState);
    setTutorialData(newData);
  };

  const markCell = (row: number, col: number, mark: "in" | "out" | "undo") => {
    const key = `${row}-${col}`;
    if (mark === "undo") {
      setCellMarks((prev) => {
        const newMarks = { ...prev };
        delete newMarks[key];
        return newMarks;
      });
    } else {
      setCellMarks((prev) => ({
        ...prev,
        [key]: mark,
      }));

      // If marking as "out" (not in the number), automatically mark all occurrences in game digits
      if (
        mark === "out" &&
        gameDigitMarkCallback &&
        typeof gameDigitMarkCallback === "function"
      ) {
        const digitValue = tutorialState.digitsTable[row][col];
        console.log(
          "Tutorial cell value:",
          digitValue,
          "at position:",
          row,
          col,
          "type:",
          typeof digitValue,
          "length:",
          digitValue ? digitValue.length : "N/A"
        );
        if (digitValue && digitValue !== "" && digitValue.length > 0) {
          console.log("Marking all occurrences of digit:", digitValue);
          try {
            gameDigitMarkCallback(digitValue, "not-in");
          } catch (error) {
            console.error("Error calling gameDigitMarkCallback:", error);
          }
        } else {
          console.log("Skipping empty cell");
        }
      } else {
        console.log(
          "Callback not available or not a function:",
          gameDigitMarkCallback
        );
      }
    }
  };

  const getCellMark = (row: number, col: number): "in" | "out" | null => {
    const key = `${row}-${col}`;
    return cellMarks[key] || null;
  };

  return (
    <TutorialContext.Provider
      value={{
        tutorialState,
        tutorialData,
        isTutorialVisible,
        strategyMode,
        showTutorial,
        hideTutorial,
        toggleStrategyMode,
        resetTutorial,
        updateTutorialFromGuess,
        markCell,
        getCellMark,
        setGameDigitMarkCallback,
      }}
    >
      {children}
    </TutorialContext.Provider>
  );
};
