import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import "./GameDigitCell.scss";

interface GameDigitCellProps {
  value: string;
  isClickable: boolean;
  onMark?: (mark: "not-in" | "in" | "position" | "undo") => void;
  currentMark?: "not-in" | "in" | "position" | null;
  className?: string;
}

const GameDigitCell: React.FC<GameDigitCellProps> = ({
  value,
  isClickable,
  onMark,
  currentMark,
  className = "",
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });
  const cellRef = useRef<HTMLTableCellElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        cellRef.current &&
        !cellRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  const handleCellClick = () => {
    if (!isClickable || !onMark) return;

    if (cellRef.current) {
      const rect = cellRef.current.getBoundingClientRect();
      const cellWidth = rect.width;
      const cellHeight = rect.height;

      // Position dropdown to overlap diagonally: 20% from right edge and 20% from bottom edge
      setDropdownPosition({
        x: rect.right - cellWidth * 0.2, // 20% from right edge
        y: rect.bottom - cellHeight * 0.2, // 20% from bottom edge
      });
      setShowDropdown(!showDropdown);
    }
  };

  const handleMark = (mark: "not-in" | "in" | "position" | "undo") => {
    if (onMark) {
      onMark(mark);
    }
    setShowDropdown(false);
  };

  const getCellClassName = () => {
    let classes = `game-digit-cell ${className}`;

    if (isClickable) {
      classes += " clickable";
    }

    if (currentMark === "not-in") {
      classes += " marked-not-in";
    } else if (currentMark === "in") {
      classes += " marked-in";
    } else if (currentMark === "position") {
      classes += " marked-position";
    }

    return classes;
  };

  return (
    <>
      <span
        ref={cellRef}
        className={getCellClassName()}
        onClick={handleCellClick}
      >
        {value}
      </span>

      {showDropdown &&
        createPortal(
          <div
            ref={dropdownRef}
            className="game-cell-dropdown"
            style={{
              left: dropdownPosition.x,
              top: dropdownPosition.y,
            }}
          >
            {currentMark === "not-in" ? (
              <div
                className="dropdown-option"
                onClick={() => handleMark("undo")}
              >
                Undo selection
              </div>
            ) : (
              <div
                className="dropdown-option"
                onClick={() => handleMark("not-in")}
              >
                Not in the number
              </div>
            )}
            {currentMark === "in" ? (
              <div
                className="dropdown-option"
                onClick={() => handleMark("undo")}
              >
                Undo selection
              </div>
            ) : (
              <div className="dropdown-option" onClick={() => handleMark("in")}>
                In the number
              </div>
            )}
            {currentMark === "position" ? (
              <div
                className="dropdown-option"
                onClick={() => handleMark("undo")}
              >
                Undo selection
              </div>
            ) : (
              <div
                className="dropdown-option"
                onClick={() => handleMark("position")}
              >
                Position guessed
              </div>
            )}
          </div>,
          document.body
        )}
    </>
  );
};

export default GameDigitCell;
