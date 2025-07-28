export interface ModalMessage {
  title: string;
  content: string;
  type: "instructions" | "tutorial" | "win" | "lose" | "error";
  buttons: {
    primary?: string;
    secondary?: string;
  };
}

export const modalMessages: Record<string, ModalMessage> = {
  welcome: {
    title: "Welcome to Guess the Number!",
    content: `Welcome to the number guessing game! 

You need to guess a five digit number that the computer selects randomly. The digits in the number don't repeat themselves and the first digit can not be 0.

With every guess you will receive two clues:
• 🎯 (Target): How many digits from your guess are in the exact position
• 🤏 (Hand): How many digits from your guess are in the number but on a different position

You only have 10 turns in order to win. Good luck!`,
    type: "instructions",
    buttons: {
      primary: "Start Playing",
    },
  },

  instructions: {
    title: "How to play this game",
    content: `You need to guess a five digit number that the computer selects randomly. The digits in the number don't repeat themselves and the first digit can not be 0.

With every guess you will receive two clues:
• 🎯 (Target): How many digits from your guess are in the exact position in the number that the computer selected
• 🤏 (Hand): How many digits from your guess are in the number that the computer selected but on a different position

You only have 10 turns in order to win. Have fun!`,
    type: "instructions",
    buttons: {
      primary: "Got it",
    },
  },

  tutorial: {
    title: "Suggestions for a winning strategy",
    content: `One winning strategy is to split the digits 0 to 9 into 4 groups to try to figure out how many digits from each group are in the number to be guessed.

**Step 1:** Input your first guess. The computer will split the digits into 4 groups and display them in the strategy table on the right. It will also show the total possibilities for how many digits from the groups are present in the number.

**Step 2:** For your second try, scramble the digits from the first group and add the third group.

**Step 3:** Use the digits from groups 2 and 3 and select a random digit from the fourth group.

By the third step (or even earlier), the computer will eliminate impossible options and show you how many digits are in each group (highlighted in red) to help you find the number faster.

The clues offered in this strategy will only work if you follow the first three steps as described above. Have fun!`,
    type: "tutorial",
    buttons: {
      primary: "Got it",
    },
  },

  win: {
    title: "🎉 Congratulations! 🎉",
    content: "You won! You successfully guessed the number!",
    type: "win",
    buttons: {
      primary: "Play Again",
      secondary: "Close",
    },
  },

  lose: {
    title: "😔 Game Over 😔",
    content: "You ran out of turns! Better luck next time!",
    type: "lose",
    buttons: {
      primary: "Play Again",
      secondary: "Close",
    },
  },

  error: {
    title: "⚠️ Connection Error",
    content:
      "Could not establish connection to the server. Please try again later.",
    type: "error",
    buttons: {
      primary: "Try Again",
      secondary: "Close",
    },
  },
};

export const getModalMessage = (
  type: string,
  customData?: { number?: number; turns?: number; message?: string }
): ModalMessage => {
  const baseMessage = modalMessages[type];

  if (!baseMessage) {
    throw new Error(`Unknown modal type: ${type}`);
  }

  // Customize win/lose messages with game data
  if (type === "win" && customData) {
    return {
      ...baseMessage,
      content: `🎉 Congratulations! 🎉\n\nYou won! You successfully guessed the number ${customData.number} in ${customData.turns} turns!`,
    };
  }

  if (type === "lose" && customData) {
    return {
      ...baseMessage,
      content: `😔 Game Over 😔\n\nYou ran out of turns! The number was ${customData.number}. Better luck next time!`,
    };
  }

  if (type === "error" && customData?.message) {
    return {
      ...baseMessage,
      content: customData.message,
    };
  }

  return baseMessage;
};
