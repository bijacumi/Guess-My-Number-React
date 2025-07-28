import React from "react";
import { useGame } from "./context/useGame";
import { useTutorial } from "./context/TutorialContext";
import Header from "./components/Header/Header";
import GameBoard from "./components/GameBoard/GameBoard";
import Footer from "./components/Footer/Footer";
import Modal from "./components/Modal/Modal";
import { getModalMessage } from "./utils/modalMessages";
import "./App.scss";

const App: React.FC = () => {
  const {
    modalState,
    openModal,
    closeModal,
    resetGame,
    markAllOccurrencesOfDigit,
  } = useGame();
  const { resetTutorial, setGameDigitMarkCallback } = useTutorial();

  // Set up the callback to connect tutorial and game contexts
  React.useEffect(() => {
    setGameDigitMarkCallback(markAllOccurrencesOfDigit);
  }, [setGameDigitMarkCallback, markAllOccurrencesOfDigit]);

  const handleModalPrimaryAction = () => {
    if (modalState.type === "win" || modalState.type === "lose") {
      resetGame();
      resetTutorial();
    } else if (modalState.type === "error") {
      resetGame();
      resetTutorial();
    }
  };

  const getCurrentModalMessage = () => {
    if (!modalState.type) return null;
    return getModalMessage(modalState.type, modalState.customData);
  };

  return (
    <div className="app">
      <Header
        onInstructionsClick={() => openModal("instructions")}
        onTutorialClick={() => openModal("tutorial")}
      />
      <GameBoard />
      <Footer />

      <Modal
        isOpen={modalState.isOpen}
        message={getCurrentModalMessage()!}
        onClose={closeModal}
        onPrimaryAction={handleModalPrimaryAction}
      />
    </div>
  );
};

export default App;
