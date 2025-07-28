import React, { useEffect } from "react";
import type { ModalMessage } from "../../utils/modalMessages";
import "./Modal.scss";

interface ModalProps {
  isOpen: boolean;
  message: ModalMessage;
  onClose: () => void;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  message,
  onClose,
  onPrimaryAction,
  onSecondaryAction,
}) => {
  // Close modal when clicking outside
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Close modal with Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handlePrimaryAction = () => {
    if (onPrimaryAction) {
      onPrimaryAction();
    }
    onClose();
  };

  const handleSecondaryAction = () => {
    if (onSecondaryAction) {
      onSecondaryAction();
    }
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-container">
        <div className="modal-header">
          <h2 className="modal-title">{message.title}</h2>
          <button className="modal-close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-content">
          <div className="modal-text">
            {message.content.split("\n").map((line, index) => (
              <p key={index}>
                {line.startsWith("•") ? (
                  <span className="bullet-point">{line}</span>
                ) : line.startsWith("**") && line.endsWith("**") ? (
                  <strong>{line.slice(2, -2)}</strong>
                ) : (
                  line
                )}
              </p>
            ))}
          </div>
        </div>

        <div className="modal-footer">
          {message.buttons.secondary && (
            <button
              className="btn btn-secondary"
              onClick={handleSecondaryAction}
            >
              {message.buttons.secondary}
            </button>
          )}
          {message.buttons.primary && (
            <button className="btn btn-primary" onClick={handlePrimaryAction}>
              {message.buttons.primary}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
