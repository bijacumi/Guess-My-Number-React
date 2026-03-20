// Tutorial logic functions translated from vanilla JavaScript

export interface TutorialState {
  digitsTable: string[][];
  cluesTable: string[][];
  crossedOutCells: boolean[][];
  highlightedCells: boolean[][];
}

//this data is needed to help with the strategy - to see how many available options there are, and also to keep track of how many columns of options are eliminated.
export interface TutorialData {
  sumOfCenteredDisplaced: number[];
  crossOuts: number;
}

// Initialize tutorial state. Fills all the tabels, the visible ones (digits and clues) and the invisible ones (those for the visual aides - the ones for crossing out and highlighting cells) with empty values.
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

// Remove the digitToRemove from the digits array
export const removeDigitFromArray = (
  digits: number[],
  digitToRemove: number,
): number[] => {
  return digits.filter((digit) => digit !== digitToRemove);
};

// Hide tutorial clues (reset for new game). Do I really need this? Can i not just use InitializeTutorialState??
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

// Set tutorial digits from player's first input. This should run only once per game, immediately after the first guess when the digits table in the tutorial is populated.
export const setTutorialDigitsFromInput = (
  inputDigits: number[],
  state: TutorialState,
): TutorialState => {
  let availableDigits = resetDigitsArray();

  //const newDigitsTable = [...state.digitsTable.map((row) => [...row])];
  //actually, I prefer this new approach as opposed to the one above, because I am just creating a new array all the time and I don't want to be depending on the state. And I don't have to manually place the empty cells at the end of rows 1 and 2.
  const newDigitsTable = Array(4)
    .fill(null)
    .map(() => Array(3).fill(""));

  // This removes the digits of the input number from the available digits array. The input number becomes the digits placed in rows 0 and 1 of the digits table, and the available digits array is used to place the 5 remaining digits in rows 2 and 3 of the digits table.
  inputDigits.forEach((digit) => {
    availableDigits = removeDigitFromArray(availableDigits, digit);
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

  // Empty cells in specific positions. I don't need this anymore, because I am creating a new array all the time and I don't want to be depending on the state. And I don't have to manually place the empty cells at the end of rows 1 and 2.
  //newDigitsTable[1][2] = "";
  //newDigitsTable[2][2] = "";

  return {
    ...state,
    digitsTable: newDigitsTable,
  };
};

// This is the main logic that calculates the clues based on the turn number, the exact matches and the partial matches. It also updates the crossed out cells and the highlighted cells to eliminate options and highlight the correct ones.
export const setTutorialClues = (
  turn: number,
  exactMatches: number,
  partialMatches: number,
  state: TutorialState,
  tutorialData: TutorialData,
): { state: TutorialState; data: TutorialData } => {
  //this is the array that holds the sum of the centered and displaced values for each turn. I need this value for the first three turns (I don't need it for the rest, but it won't even be calculated for the rest), to know what all the possible combinations of the presence of digits in the first two groups are, on the first turn, then in the first and third on the second turn, and so on and so forth.
  const sumOfCenteredDisplaced = [...tutorialData.sumOfCenteredDisplaced];
  sumOfCenteredDisplaced[turn - 1] = exactMatches + partialMatches;

  //this is the number of columns of options that are eliminated. It is used to determine if the correct option should be highlighted in the third step or even earlier.
  //since I am using this a lot, I will just create a shorter variable for it.
  const sum = sumOfCenteredDisplaced[0];
  const numberOfColumns =
    sum === 0 || sum === 5 ? 1 : sum === 1 || sum === 4 ? 2 : 3;

  //I need this variale because in the case I have three columns of clues, two of them need to be eliminated so I need to know if I elimnated two or just one.
  let crossOuts = tutorialData.crossOuts;
  let continueTutorial = true;

  //this is a helper function to create new copies of the 2D arrays to avoid mutating the original state.
  const deepCopy2DArray = <T>(arrayToCopy: T[][]): T[][] =>
    arrayToCopy.map((row) => [...row]);

  const newCluesTable = deepCopy2DArray(state.cluesTable);
  const newCrossedOutCells = deepCopy2DArray(state.crossedOutCells);
  const newHighlightedCells = deepCopy2DArray(state.highlightedCells);

  //Need to update it to include the case where you guess all five digits from the first guess or you guess none of them. Also need to take into consideration when you have a cross out from the second step and do not need to do the third step as in the strategy
  switch (turn) {
    case 1:
      crossOuts = 0;
      switch (sum) {
        case 0:
          newCluesTable[0][0] = "0";
          newCluesTable[1][0] = "0";
          newCluesTable[2][0] = "2";
          newCluesTable[3][0] = "3";
          for (let i = 0; i <= 3; i++) {
            newHighlightedCells[i][0] = true;
          }
          continueTutorial = false; // I am using this check to see if the stop tutorial functions properly. I will remove it after I make sure it works.
          break;

        case 1:
          for (let i = 1; i >= 0; i--) {
            newCluesTable[1][1 - i] = i.toString();
            newCluesTable[0][1 - i] = (sum - i).toString();
          }
          break;

        case 2:
        case 3:
          for (let i = 2; i >= 0; i--) {
            newCluesTable[1][2 - i] = i.toString();
            newCluesTable[0][2 - i] = (sum - i).toString();
          }
          break;

        case 4:
          for (let i = 2; i >= 1; i--) {
            newCluesTable[1][2 - i] = i.toString();
            newCluesTable[0][2 - i] = (sum - i).toString();
          }
          break;

        case 5:
          newCluesTable[0][0] = "3";
          newCluesTable[1][0] = "2";
          newCluesTable[2][0] = "0";
          newCluesTable[3][0] = "0";
          for (let i = 0; i <= 3; i++) {
            newHighlightedCells[i][0] = true;
          }
          continueTutorial = false;
          break;
      }
      break;

    case 2:
      //you have to include the logic for highlighting the correct option in the case where we have just 2 options from the beginning and one is eliminated in the second step. So far, it crosses out the incorrect option and does not highlight the correct one.
      //also, in this step you also have to check for the clues in the last row, because one of them might be 4 and that is obviously wrong, so that option has to be crossed out from this step, and highlighted the correct one so as to save you turn.
      if (continueTutorial) {
        console.log("case 2 is executing");
        for (let j = 0; j <= numberOfColumns - 1; j++) {
          newCluesTable[2][j] = (
            sumOfCenteredDisplaced[1] - Number(newCluesTable[0][j])
          ).toString();

          const temporarySum =
            Number(newCluesTable[0][j]) +
            Number(newCluesTable[1][j]) +
            Number(newCluesTable[2][j]);
          newCluesTable[3][j] = (5 - temporarySum).toString();
          //this checks if I can eliminate options from this step
          if (
            Number(newCluesTable[2][j]) > 2 ||
            Number(newCluesTable[2][j]) < 0 ||
            Number(newCluesTable[3][j]) > 3 ||
            Number(newCluesTable[3][j]) < 0
          ) {
            for (let z = 0; z <= 3; z++) {
              newCrossedOutCells[z][j] = true;
            }
            crossOuts++;
          }
        }
      } else {
        console.log(
          "case 2 is not executing because we already have one single correct option",
        );
      }

      // Highlight correct option if enough options are eliminated at this second step.
      if (crossOuts === 2 || (crossOuts === 1 && numberOfColumns === 2)) {
        for (let j = 0; j <= numberOfColumns; j++) {
          if (!newCrossedOutCells[0][j]) {
            for (let i = 0; i <= 3; i++) {
              newHighlightedCells[i][j] = true;
            }
            break;
          }
        }
      }
      break;

    case 3:
      //I don't have to check for 2 crossouts here, because if that already happend in the second step, then I have new highlighted cells and that triggers the continueTutorial stop in the provider.
      if (continueTutorial) {
        console.log("case 3 is executing");
        for (let j = 0; j <= numberOfColumns - 1; j++) {
          if (!newCrossedOutCells[0][j]) {
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
        }
      } else {
        console.log(
          "case 3 is not executing because we already have one single correct option from step 2",
        );
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
