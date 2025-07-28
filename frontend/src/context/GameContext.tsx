import React, { createContext, useState, useEffect } from "react";
import type { GameContextType } from "./types";

// Backend API URL
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3001/api";

// Extended interface for game digit marking
interface ExtendedGameContextType extends GameContextType {
  markGameDigit: (
    rowIndex: number,
    digitIndex: number,
    mark: "not-in" | "in" | "position" | "undo"
  ) => void;
  getGameDigitMark: (
    rowIndex: number,
    digitIndex: number
  ) => "not-in" | "in" | "position" | null;
  markAllOccurrencesOfDigit: (digit: string, mark: "not-in") => void;
}

// Create a context with undefined as initial value
// This context will hold all game-related state and functions
export const GameContext = createContext<ExtendedGameContextType | undefined>(
  undefined
);

// GameProvider component that wraps the app and provides game state to all children
export const GameProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // State for tracking remaining turns (starts at 10)
  const [currentTurns, setCurrentTurns] = useState<number>(10);

  // State for storing the history of guesses and their results
  const [gameHistory, setGameHistory] = useState<
    GameContextType["gameHistory"]
  >([]);

  // State to track if a game is currently in progress
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // State to track backend connection status
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(true);
  const [gameDigitMarks, setGameDigitMarks] = useState<
    Record<string, "not-in" | "in" | "position">
  >({});

  // Modal state
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: string | null;
    customData?: { number?: number; turns?: number };
  }>({
    isOpen: true, // Start with welcome modal
    type: "welcome",
  });

  // Modal actions
  const openModal = (
    type: string,
    customData?: { number?: number; turns?: number }
  ) => {
    setModalState({ isOpen: true, type, customData });
  };

  const closeModal = () => {
    setModalState({ isOpen: false, type: null });
  };

  // Effect to start a new game when the component mounts
  useEffect(() => {
    generateRandomNumber();
  }, []); // Empty dependency array means this runs once on mount

  // Function to start a new game via backend API
  const generateRandomNumber = async () => {
    try {
      setIsBackendConnected(true);
      const response = await fetch(`${API_BASE_URL}/game/new`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to start new game");
      }

      const data = await response.json();

      if (data.success) {
        setCurrentTurns(data.turnsRemaining);
        setIsPlaying(true);
        setGameHistory([]);
        // Note: We don't set randomNumber here as it's now managed by the backend
      } else {
        throw new Error(data.error || "Failed to start new game");
      }
    } catch (error) {
      console.error("Error starting new game:", error);
      setIsBackendConnected(false);
      openModal("error");
    }
  };

  // Function to check a player's guess via backend API
  const checkGuess = async (guess: number) => {
    try {
      setIsBackendConnected(true);
      const response = await fetch(`${API_BASE_URL}/game/guess`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ guess }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit guess");
      }

      const data = await response.json();

      if (data.success) {
        const {
          exactMatches,
          partialMatches,
          gameOver,
          won,
          turnsTaken,
          targetNumber,
        } = data;

        // Update turns
        if (!gameOver) {
          setCurrentTurns(data.turnsRemaining);
        }

        // Update game history
        setGameHistory((prev) => [
          ...prev,
          { guess, exactMatches, partialMatches },
        ]);

        // Check for win condition
        if (gameOver && won) {
          setIsPlaying(false);
          openModal("win", { number: targetNumber, turns: turnsTaken });
          return { exactMatches, partialMatches };
        }

        // Check for lose condition
        if (gameOver && !won) {
          setIsPlaying(false);
          openModal("lose", { number: targetNumber });
        }

        return { exactMatches, partialMatches };
      } else {
        throw new Error(data.error || "Failed to submit guess");
      }
    } catch (error) {
      console.error("Error submitting guess:", error);
      setIsBackendConnected(false);
      openModal("error");
      return { exactMatches: 0, partialMatches: 0 };
    }
  };

  // Function to reset the game to its initial state
  const resetGame = () => {
    setIsPlaying(false);
    closeModal();
    generateRandomNumber();
    setGameDigitMarks({}); // Clear all game digit marks
  };

  // Function to mark game digits
  const markGameDigit = (
    rowIndex: number,
    digitIndex: number,
    mark: "not-in" | "in" | "position" | "undo"
  ) => {
    console.log("markGameDigit called with:", rowIndex, digitIndex, mark);
    const key = `${rowIndex}-${digitIndex}`;
    if (mark === "undo") {
      setGameDigitMarks((prev) => {
        const newMarks = { ...prev };
        delete newMarks[key];
        return newMarks;
      });
    } else {
      setGameDigitMarks((prev) => ({
        ...prev,
        [key]: mark,
      }));
    }
  };

  // Function to get game digit mark
  const getGameDigitMark = (
    rowIndex: number,
    digitIndex: number
  ): "not-in" | "in" | "position" | null => {
    const key = `${rowIndex}-${digitIndex}`;
    return gameDigitMarks[key] || null;
  };

  const markAllOccurrencesOfDigit = React.useCallback(
    (digit: string, mark: "not-in") => {
      console.log("markAllOccurrencesOfDigit called with:", digit, mark);

      // Guard against undefined parameters
      if (!digit || typeof digit !== "string" || digit === "") {
        console.warn(
          "markAllOccurrencesOfDigit called with invalid digit:",
          digit
        );
        return;
      }

      if (mark !== "not-in") {
        console.warn(
          "markAllOccurrencesOfDigit called with invalid mark:",
          mark
        );
        return;
      }

      // Use functional update to avoid dependency on gameDigitMarks
      setGameDigitMarks((prevMarks) => {
        const newMarks = { ...prevMarks };

        // Find all occurrences of this digit in the game history
        gameHistory.forEach((entry, rowIndex) => {
          const guessDigits = String(entry.guess).split("");
          guessDigits.forEach((guessDigit, digitIndex) => {
            if (guessDigit === digit) {
              const key = `${rowIndex}-${digitIndex}`;
              newMarks[key] = mark;
              console.log("Marking game digit at:", key);
            }
          });
        });

        return newMarks;
      });
    },
    [gameHistory] // Remove gameDigitMarks from dependencies
  );

  // Provide all game state and functions to children components
  return (
    <GameContext.Provider
      value={{
        randomNumber: 0, // Not used anymore since backend manages this
        currentTurns,
        gameHistory,
        isPlaying,
        isBackendConnected,
        generateRandomNumber,
        checkGuess,
        resetGame,
        // Modal state and actions
        modalState,
        openModal,
        closeModal,
        handleWelcomeClose: closeModal, // Simple close for welcome modal
        // Game digit marking functions
        markGameDigit,
        getGameDigitMark,
        markAllOccurrencesOfDigit,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
