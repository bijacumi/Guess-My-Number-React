import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import "./TutorialCell.scss";

interface TutorialCellProps {
  value: string;
  isClickable: boolean;
  onMark?: (mark: "in" | "out" | "undo") => void;
  currentMark?: "in" | "out" | null;
  className?: string;
}

const TutorialCell: React.FC<TutorialCellProps> = ({
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

  const handleMark = (mark: "in" | "out" | "undo") => {
    if (onMark) {
      onMark(mark);
    }
    setShowDropdown(false);
  };

  const getCellClassName = () => {
    let classes = `tutorial-cell ${className}`;

    if (isClickable) {
      classes += " clickable";
    }

    if (currentMark === "in") {
      classes += " marked-in";
    } else if (currentMark === "out") {
      classes += " marked-out";
    }

    return classes;
  };

  return (
    <>
      <td
        ref={cellRef}
        className={getCellClassName()}
        onClick={handleCellClick}
      >
        {value}
      </td>

      {showDropdown &&
        createPortal(
          <div
            ref={dropdownRef}
            className="cell-dropdown"
            style={{
              left: dropdownPosition.x,
              top: dropdownPosition.y,
            }}
          >
            {currentMark === "in" ? (
              <div
                className="dropdown-option"
                onClick={() => handleMark("undo")}
              >
                Undo selection
              </div>
            ) : (
              <div className="dropdown-option" onClick={() => handleMark("in")}>
                Is in the number
              </div>
            )}
            {currentMark === "out" ? (
              <div
                className="dropdown-option"
                onClick={() => handleMark("undo")}
              >
                Undo selection
              </div>
            ) : (
              <div
                className="dropdown-option"
                onClick={() => handleMark("out")}
              >
                Is NOT in the number
              </div>
            )}
          </div>,
          document.body
        )}
    </>
  );
};

export default TutorialCell;
