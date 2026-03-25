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

At any point you can click the digits in the Digit Group table and you will get a dropdown menu with the options to mark the digit as "Not in the number" or "In the number". You can do the same for the digits in the Guessed Number table where you will get the same options plus the option to mark the digit as "In the exact position".

You only have 10 turns in order to win. Have fun!`,
    type: "instructions",
    buttons: {
      primary: "Got it",
    },
  },

  tutorial: {
    title: "Suggestions for a winning strategy",
    content: `One winning strategy is to split the digits 0 to 9 into 4 groups to try to figure out how many digits from each group are in the number to be guessed.

**Step 1:** Input your first guess. The computer will split the digits of the number you have just input into 2 groups (3 digits for the first group and 2 for the second) and display them in the Digit Group table on the right. The Clues table will now display the total number of ways in which the digits could be spread across the two groups.

**Step 2:** For your second try, scramble the digits from the first group (to get more information about their position) and add the third group.

**Step 3:** Use the digits from groups 2 and 3 (again, change their position from their last usage for more information) and select a random digit from the fourth group.

By the third step (or even earlier), the computer will eliminate impossible options and and higlight with red the only possible way in which the digits of the number to be guessed could be spread across the four groups. Also, on this last third step you will be able to know if the digit you added from the fourth group is in the number or not. 

In some rare cases, you will only be left with one possibility before the third step. In that case, you can abandon the strategy because it will not yield any more useful information and continue with whatever guess you see fit.

The clues offered in this strategy will only be useful if you follow these three steps as described above. Otherwise, you will get false information. Choose wisely and have fun!`,
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
  customData?: { number?: number; turns?: number; message?: string },
): ModalMessage => {
  const baseMessage = modalMessages[type];

  if (!baseMessage) {
    throw new Error(`Unknown modal type: ${type}`);
  }

  // Customize win/lose messages with game data
  if (type === "win" && customData) {
    return {
      ...baseMessage,
      content: `\n\nYou won! You successfully guessed the number ${customData.number} in ${customData.turns} ${customData.turns === 1 ? "turn!" : "turns!"}`,
    };
  }

  if (type === "lose" && customData) {
    return {
      ...baseMessage,
      content: `\n\nYou ran out of turns! The number was ${customData.number}. Better luck next time!`,
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
