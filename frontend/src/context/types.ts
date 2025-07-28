export interface GameContextType {
  randomNumber: number;
  currentTurns: number;
  gameHistory: Array<{
    guess: number;
    exactMatches: number;
    partialMatches: number;
  }>;
  isPlaying: boolean;
  isBackendConnected: boolean;
  generateRandomNumber: () => void;
  checkGuess: (guess: number) => Promise<{
    exactMatches: number;
    partialMatches: number;
  }>;
  resetGame: () => void;
  // Modal state and actions
  modalState: {
    isOpen: boolean;
    type: string | null;
    customData?: { number?: number; turns?: number; message?: string };
  };
  openModal: (
    type: string,
    customData?: { number?: number; turns?: number; message?: string }
  ) => void;
  closeModal: () => void;
  handleWelcomeClose: () => void;
}
