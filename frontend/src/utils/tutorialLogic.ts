// Tutorial logic functions translated from vanilla JavaScript

export interface TutorialState {
  digitsTable: string[][];
  cluesTable: string[][];
  crossedOutCells: boolean[][];
  highlightedCells: boolean[][];
}

export interface TutorialData {
  sumOfCenteredDisplaced: number[];
  crossOuts: number;
}

// Initialize tutorial state
export const initializeTutorialState = (): TutorialState => ({
  digitsTable: Array(4)
    .fill(null)
    .map(() => Array(3).fill("")),
  cluesTable: Array(4)
    .fill(null)
    .map(() => Array(3).fill("")),
  crossedOutCells: Array(4)
    .fill(null)
    .map(() => Array(3).fill(false)),
  highlightedCells: Array(4)
    .fill(null)
    .map(() => Array(3).fill(false)),
});

// Reset digits array to 0-9
export const resetDigitsArray = (): number[] => {
  return Array.from({ length: 10 }, (_, i) => i);
};

// Remove a digit from the available digits array
export const spliceDigitFromArray = (
  digits: number[],
  number: number
): number[] => {
  return digits.filter((digit) => digit !== number);
};

// Hide tutorial clues (reset for new game)
export const hideTutorialClues = (state: TutorialState): TutorialState => {
  return {
    ...state,
    cluesTable: Array(4)
      .fill(null)
      .map(() => Array(3).fill("")),
    crossedOutCells: Array(4)
      .fill(null)
      .map(() => Array(3).fill(false)),
    highlightedCells: Array(4)
      .fill(null)
      .map(() => Array(3).fill(false)),
  };
};

// Set tutorial digits from player's first input
export const setTutorialDigitsFromInput = (
  inputDigits: number[],
  state: TutorialState
): TutorialState => {
  let availableDigits = resetDigitsArray();
  const newDigitsTable = [...state.digitsTable.map((row) => [...row])];

  // Remove input digits from available digits
  inputDigits.forEach((digit) => {
    availableDigits = spliceDigitFromArray(availableDigits, digit);
  });

  // Fill the digits table based on the strategy
  // First row: first 3 digits from input
  for (let i = 0; i < 3; i++) {
    newDigitsTable[0][i] = inputDigits[i].toString();
  }

  // Second row: last 2 digits from input
  for (let i = 0; i < 2; i++) {
    newDigitsTable[1][i] = inputDigits[i + 3].toString();
  }

  // Third row: first 2 digits from remaining available digits
  for (let i = 0; i < 2; i++) {
    newDigitsTable[2][i] = availableDigits[i].toString();
  }

  // Fourth row: last 3 digits from remaining available digits
  for (let i = 0; i < 3; i++) {
    newDigitsTable[3][i] = availableDigits[i + 2].toString();
  }

  // Empty cells in specific positions
  newDigitsTable[1][2] = "";
  newDigitsTable[2][2] = "";

  return {
    ...state,
    digitsTable: newDigitsTable,
  };
};

// Set tutorial clues based on turn number
export const setTutorialClues = (
  turn: number,
  exactMatches: number,
  partialMatches: number,
  state: TutorialState,
  tutorialData: TutorialData
): { state: TutorialState; data: TutorialData } => {
  const sumOfCenteredDisplaced = [...tutorialData.sumOfCenteredDisplaced];
  sumOfCenteredDisplaced[turn - 1] = exactMatches + partialMatches;

  let crossOuts = tutorialData.crossOuts;
  const newCluesTable = [...state.cluesTable.map((row) => [...row])];
  const newCrossedOutCells = [...state.crossedOutCells.map((row) => [...row])];
  const newHighlightedCells = [
    ...state.highlightedCells.map((row) => [...row]),
  ];

  switch (turn) {
    case 1:
      crossOuts = 0;

      if (sumOfCenteredDisplaced[0] > 2) {
        for (let i = 2; i >= 0; i--) {
          newCluesTable[1][2 - i] = i.toString();
          newCluesTable[0][2 - i] = (sumOfCenteredDisplaced[0] - i).toString();
        }
      } else {
        // For sum <= 2, only populate the first (sumOfCenteredDisplaced[0] + 1) columns
        const columnsToPopulate = sumOfCenteredDisplaced[0] + 1;
        for (let i = sumOfCenteredDisplaced[0]; i >= 0; i--) {
          const columnIndex = 2 - i;
          if (columnIndex >= 3 - columnsToPopulate) {
            newCluesTable[1][columnIndex] = i.toString();
            newCluesTable[0][columnIndex] = (
              sumOfCenteredDisplaced[0] - i
            ).toString();
          }
        }
      }

      // Cross out impossible combinations
      if (Number(newCluesTable[0][2]) > 3) {
        for (let z = 0; z <= 3; z++) {
          newCrossedOutCells[z][2] = true;
        }
        crossOuts++;
      }
      break;

    case 2:
      for (let j = 0; j <= 2; j++) {
        // Skip columns that are empty from step 1 (when sum was <= 2)
        if (newCluesTable[0][j] === "" && newCluesTable[1][j] === "") {
          continue;
        }

        newCluesTable[2][j] = (
          sumOfCenteredDisplaced[1] - Number(newCluesTable[0][j])
        ).toString();

        const temporarySum =
          Number(newCluesTable[0][j]) +
          Number(newCluesTable[1][j]) +
          Number(newCluesTable[2][j]);
        newCluesTable[3][j] = (5 - temporarySum).toString();

        if (
          Number(newCluesTable[2][j]) > 2 ||
          Number(newCluesTable[2][j]) < 0 ||
          Number(newCluesTable[3][j]) < 0
        ) {
          for (let z = 0; z <= 3; z++) {
            newCrossedOutCells[z][j] = true;
          }
          crossOuts++;
        }
      }

      // Highlight correct option if two options are eliminated
      if (crossOuts === 2) {
        for (let j = 0; j <= 2; j++) {
          if (newCrossedOutCells[0][j]) {
            continue;
          } else {
            for (let i = 0; i <= 3; i++) {
              newHighlightedCells[i][j] = true;
            }
            break;
          }
        }
      }
      break;

    case 3:
      for (let j = 0; j <= 2; j++) {
        // Skip columns that are empty from step 1 (when sum was <= 2)
        if (newCluesTable[0][j] === "" && newCluesTable[1][j] === "") {
          continue;
        }

        const temporarySum =
          Number(newCluesTable[1][j]) + Number(newCluesTable[2][j]);

        for (let i = 0; i <= 3; i++) {
          if (
            sumOfCenteredDisplaced[2] === temporarySum ||
            sumOfCenteredDisplaced[2] === temporarySum + 1
          ) {
            newHighlightedCells[i][j] = true;
          } else {
            newCrossedOutCells[i][j] = true;
          }
        }
      }
      break;
  }

  return {
    state: {
      ...state,
      cluesTable: newCluesTable,
      crossedOutCells: newCrossedOutCells,
      highlightedCells: newHighlightedCells,
    },
    data: {
      sumOfCenteredDisplaced,
      crossOuts,
    },
  };
};
