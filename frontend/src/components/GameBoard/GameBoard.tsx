import React, { useState } from "react";
import { useGame } from "../../context/useGame";
import { useTutorial } from "../../context/TutorialContext";
import Tutorial from "../Tutorial/Tutorial";
import GameDigitCell from "./GameDigitCell";
import "./GameBoard.scss";

const GameBoard: React.FC = () => {
  const {
    gameHistory,
    isPlaying,
    checkGuess,
    markGameDigit,
    getGameDigitMark,
  } = useGame();
  const { updateTutorialFromGuess } = useTutorial();
  const [guess, setGuess] = useState<string>("");
  const [error, setError] = useState<string>("");

  // Handle input changes with validation
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setError("");

    // Only allow digits
    if (!/^\d*$/.test(value)) {
      setError("Please enter only digits (0-9)");
      return;
    }

    // Prevent first digit from being 0
    if (value.length === 1 && value === "0") {
      setError("First digit cannot be 0");
      return;
    }

    // Check for duplicate digits
    const lastDigit = value[value.length - 1];
    const previousDigits = value.slice(0, -1);
    if (lastDigit && previousDigits.includes(lastDigit)) {
      setError("All digits must be unique - don't repeat digits");
      return;
    }

    // Limit to 5 digits
    if (value.length > 5) {
      return;
    }

    setGuess(value);
  };

  const handleGuess = async () => {
    setError("");
    const guessNumber = parseInt(guess);

    //do I still need to perform this validation here? I have done it so many times already, both on the frontend and the backend.
    if (isNaN(guessNumber)) {
      setError("Please enter a valid number");
      return;
    }

    if (guess.length !== 5) {
      setError("Please enter a 5-digit number");
      return;
    }

    const currentTurn = gameHistory.length + 1;
    const result = await checkGuess(guessNumber);

    // Update tutorial with the guess results
    updateTutorialFromGuess(
      guessNumber,
      result.exactMatches,
      result.partialMatches,
      currentTurn,
    );

    setGuess("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleGuess();
    }
  };

  return (
    <div className="game-container">
      <div className="game-content">
        <div className="input-section">
          <div className="input-group">
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              id="number-input"
              value={guess}
              onChange={handleInputChange}
              onKeyDown={handleKeyPress}
              placeholder="Type your guess here"
              maxLength={5}
              disabled={!isPlaying}
            />
            <button className="btn" onClick={handleGuess} disabled={!isPlaying}>
              Check Guess
            </button>
          </div>
          <div className="message-container">
            {error ? (
              <div className="error-message">{error}</div>
            ) : (
              <div className="placeholder-message">&nbsp;</div>
            )}
          </div>
        </div>

        <div className="main-work">
          <div className="left-column">
            <table>
              <thead>
                <tr>
                  <th>Guessed Number</th>
                  <th>🎯</th>
                  <th>🤏</th>
                </tr>
              </thead>
              <tbody>
                {gameHistory.map((entry, index) => {
                  const guessDigits = String(entry.guess).split("");
                  return (
                    <tr key={index}>
                      <td>
                        <div className="digit-row">
                          {guessDigits.map((digit, digitIndex) => (
                            <GameDigitCell
                              key={digitIndex}
                              value={digit}
                              isClickable={true}
                              onMark={(mark) =>
                                markGameDigit(index, digitIndex, mark)
                              }
                              currentMark={getGameDigitMark(index, digitIndex)}
                              className="game-digit"
                            />
                          ))}
                        </div>
                      </td>
                      <td>{entry.exactMatches}</td>
                      <td>{entry.partialMatches}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="right-column">
            <Tutorial />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameBoard;
