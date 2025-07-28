let randomNumber = 0; // the random number the computer selects
let digitsOfRandomNumber = []; // the digits of the number that the computer selects randomly
let inputNumber = 0; // the numbers that I tell the computer
let digitsOfInputNumber = []; // the digits of the input number
let digitsZeroToNine = []; // put the digits 0 to 9 in an array because I will need them later
let centeredValue = 0;
let displacedValue = 0;
let anotherRandomArray = [];
let sumOfCenteredDisplaced = [];
let crossOuts = 0;

let playing = false; // this will ensure that the game doesn't reset right in the middle of playing
let enterKeyEnabled = true; // this will ensure that you can only press the enter key while you are still playing, and not after you either won or lost the game.
let youWon = false;
let haveErrors = false;
let duplicateDigits = false;

let averageTurns = 0; // the average of the number of moves in which you win the game
let averageTime = 0; // the average of the time in which you win the game, in seconds which I will display in minutes and seconds
let currentNumberOfTurns = 0; // I will have a maximum of moves at which the game ends
let arrayOfTurns = [0];
let arrayOfTimes = [0];
let gamesPlayed = 0;
//let instructionsYes = true;

const playAgain = document.getElementById("play-again");
const getNumber = document.getElementById("btn-check");
const guessedNumber = document.getElementById("number-input");
const explanation = document.getElementById("explanation");
const displayGamesPlayed = document.getElementById("games-played");
const displayCurrentTurns = document.getElementById("current-turns");
const displayAverageTurns = document.getElementById("average");
const warningMessage = document.getElementById("message");
const messageTitle = document.getElementById("messageTitle");
const modalWindow = document.getElementById("modal");
const blurBackground = document.getElementById("overlay");
const closeWarningMessageBtn = document.getElementById("close-modal");
const tutorialDigits = document.getElementById("table-digits");
const tutorialClues = document.getElementById("table-clues");
const instructionsBtn = document.getElementById("instructions");
const tutorialBtn = document.getElementById("tutorial");

const closeWarningMessageFunction = function () {
  modalWindow.classList.add("hidden");
  blurBackground.classList.add("hidden");
};

const displayWarningMessageFunction = function (instructionsYes) {
  modalWindow.classList.remove("hidden");
  blurBackground.classList.remove("hidden");
  if (instructionsYes) {
    messageTitle.textContent = "How to play this game";
    warningMessage.textContent =
      "You need to guess a five digit number that the computer selects randomly. The digits in the number don't repeat themselves and the first digit can not be 0. With you every guess you will receive two clues: the first clue (specified with the symbol 🎯🎯🎯) is how many digits from your guess are in the exact position in the number that the computer selected; the second clue (specified with the symbol 🤏🤏🤏) is how many digits from your guess are in the number that the computer selected but on a different position in the number. You only have 10 turns in order to win. Have fun!";
  } else {
    messageTitle.textContent = "Suggestions for a winning strategy";
    warningMessage.textContent =
      "One winning strategy is to split the digits 0 to 9 into 4 groups to try to figure out how many digits from each group are in the number to be guessed. Once you input your first guess, the computer will do this split for you and display the 4 groups into the table on the right. On the first guess it will also show, on the right side of this table, the total possibilities for how many digits from the two groups are present in the number to be guessed. Now, for your second try, scramble the digits from the first group (just to get additional information) and add the third group. And for the third try use the digits from groups 2 and 3 and select a random digit from the fourth group. By this third step (or even earlier in some cases), the computer will eliminate the options that are not possible (by crossing them out) and will show you how many digits are in each group (the ones in red), to help you find the number faster. The clues offered in this strategy will only work if you follow the first three steps as described above. Have fun!";
  }
};

function setTutorialDigitsFromScratch() {
  // I am now setting the matrix of tuturial digits scrambling all 10 digits. Below I will start with the digits of the first guess, add them to the matrix and then scramble and add the other five
  for (let i = 0; i <= 9; i++) {
    // sets another array of randomized 0 to 9 without 0 being the first and then it sets the original ordered 0 to 9 array back to full
    if (i == 0) {
      randomSelector = Math.trunc(Math.random() * 9) + 1;
    } else {
      randomSelector = Math.trunc(Math.random() * digitsZeroToNine.length);
    }

    anotherRandomArray[i] = digitsZeroToNine[randomSelector];
    digitsZeroToNine.splice(randomSelector, 1);
  }
  resetDigitsArray(digitsZeroToNine);

  let counter = 0;
  for (i = 0; i <= 3; i++) {
    for (let j = 0; j <= 2; j++) {
      if ((i === 1 && j === 2) || (i === 2 && j === 2)) {
        tutorialDigits.rows[i].cells[2].innerText = "";
        counter--;
      } else
        tutorialDigits.rows[i].cells[
          j
        ].innerText = `${anotherRandomArray[counter]}`;
      counter++;
    }
  }
  /* displays the two tables if I am hiding them at the beginning of the game in full tutorial mode
    tutorialClues.classList.remove("hidden")
    tutorialDigits.classList.remove("hidden") */
}
function spliceDigitFromArray(number) {
  // will be used in the set tutorial digits from inpun to ensure that once I selected the digits they will be removed from the selection array to avoid repetition
  for (let i = 0; i <= digitsZeroToNine.length; i++) {
    if (number === digitsZeroToNine[i]) digitsZeroToNine.splice(i, 1);
  }
}

function hideTutorialClues() {
  //for reset at the beginning of a new game
  for (let i = 0; i <= 3; i++) {
    for (let j = 0; j <= 2; j++) {
      tutorialClues.rows[i].cells[j].innerText = "";
    }
  }
}

function setTutorialDigitsFromInput() {
  //this is to use the first input of the player
  for (let i = 0; i <= 9; i++) {
    if (i <= 2) {
      tutorialDigits.rows[0].cells[i].innerText = digitsOfInputNumber[i];
      spliceDigitFromArray(digitsOfInputNumber[i]);
    } else if (i >= 3 && i <= 4) {
      tutorialDigits.rows[1].cells[i - 3].innerText = digitsOfInputNumber[i];
      spliceDigitFromArray(digitsOfInputNumber[i]);
    } else if (i >= 5 && i <= 6)
      tutorialDigits.rows[2].cells[i - 5].innerText = digitsZeroToNine[i - 5];
    else if (i >= 7 && i <= 9)
      tutorialDigits.rows[3].cells[i - 7].innerText = digitsZeroToNine[i - 5];
  }

  tutorialDigits.rows[1].cells[2].innerText = ""; //adds a blank character to these 2 cells as they are supposed to have nothing in them
  tutorialDigits.rows[2].cells[2].innerText = "";
  resetDigitsArray(digitsZeroToNine); // puts the 0 to 9 array back to its original form since we spliced it here
  tutorialDigits.classList.remove("hidden");
}

function setTutorialClues(turn) {
  sumOfCenteredDisplaced[turn - 1] = centeredValue + displacedValue;

  switch (turn) {
    case 1:
      crossOuts = 0;
      console.log(
        `step 1. I am resetting the crossOuts to 0, and the value of crossOut is ${crossOuts}`
      );
      if (sumOfCenteredDisplaced[0] > 2) {
        for (let i = 2; i >= 0; i--) {
          tutorialClues.rows[1].cells[2 - i].innerText = i;
          tutorialClues.rows[0].cells[2 - i].innerText =
            sumOfCenteredDisplaced[0] - i;
        }
      } else {
        for (let i = sumOfCenteredDisplaced[0]; i >= 0; i--) {
          tutorialClues.rows[1].cells[2 - i].innerText = i;
          tutorialClues.rows[0].cells[2 - i].innerText =
            sumOfCenteredDisplaced[0] - i;
        }
      }

      if (
        Number(tutorialClues.rows[0].cells[2].innerText) > 3
        //Number(tutorialClues.rows[0].cells[2].innerText) < 0 - it would never be negative here. It could happen in the second step, but not here.
      ) {
        for (let z = 0; z <= 3; z++) {
          tutorialClues.rows[z].cells[2].classList.add("vertical-line");
          //tutorialClues.rows[z].cells[1].style.color = "red"; not sure if this is needed here, only if there are only 2 options. I need to check for that first.
        }
        crossOuts++;
        //console.log(`step 1. I want to see what the value of crossOut is and it is ${crossOuts}`)
      }
      break;

    case 2:
      for (let j = 0; j <= 2; j++) {
        tutorialClues.rows[2].cells[j].innerText =
          sumOfCenteredDisplaced[1] -
          Number(tutorialClues.rows[0].cells[j].innerText);
        let temporarySum = 0;
        for (let i = 0; i <= 2; i++) {
          temporarySum += Number(tutorialClues.rows[i].cells[j].innerText);
        }
        tutorialClues.rows[3].cells[j].innerText = 5 - temporarySum;
        if (
          Number(tutorialClues.rows[2].cells[j].innerText) > 2 ||
          Number(tutorialClues.rows[3].cells[j].innerText) < 0
        ) {
          for (let z = 0; z <= 3; z++) {
            tutorialClues.rows[z].cells[j].classList.add("vertical-line");
          }
          crossOuts++;
          //console.log(`step 2. I want to see what the value of crossOut is and it is ${crossOuts}`)
        }
      }

      //now I will test for the rare case when I can eliminate two out of three options from move number two. In that case the correct option should be highlighted here and I should not wait until the third step to do it. I could actually suggest that the player changes strategies for the third step, or not. it's really hard to test it
      if (crossOuts === 2) {
        for (let j = 0; j <= 2; j++) {
          if (
            tutorialClues.rows[0].cells[j].classList.contains("vertical-line")
          ) {
            continue; // if it contains the vertical line, skip to the next columns
          } else {
            for (let i = 0; i <= 3; i++) {
              tutorialClues.rows[i].cells[j].style.color = "red"; // once it finds the correct option (it might be the first), break the loop completely, as the other two are already crossed out
            }
            break;
          }
        }
      }
      break;
    case 3:
      for (let j = 0; j <= 2; j++) {
        let temporarySum =
          Number(tutorialClues.rows[1].cells[j].innerText) +
          Number(tutorialClues.rows[2].cells[j].innerText); // testing for the correct option that will tell the players how the correct digits are dispersed through the 4 groups
        for (let i = 0; i <= 3; i++) {
          if (
            sumOfCenteredDisplaced[2] === temporarySum ||
            sumOfCenteredDisplaced[2] === temporarySum + 1
          ) {
            tutorialClues.rows[i].cells[j].style.color = "red";
          } else tutorialClues.rows[i].cells[j].classList.add("vertical-line");
        }
      }
      break;
  }
}

function resetDigitsArray(array) {
  for (let i = 0; i < 10; i++) {
    array[i] = i;
  }
}

function calculateAverageTurns(turn) {
  arrayOfTurns[gamesPlayed - 1] = turn;
  let sum = 0;
  for (let i = 0; i <= arrayOfTurns.length - 1; i++) {
    sum += arrayOfTurns[i];
  }
  averageTurns = sum / arrayOfTurns.length;
  return averageTurns.toFixed(2);
}

function resetAll() {
  explanation.textContent =
    'Press the "Instructions" button for information on how to play the game and on the "Tutorial" button for a strategy that will maximize your winning chances';
  youWon = false;
  enterKeyEnabled = true;
  guessedNumber.disabled = false;
  getNumber.disabled = false;
  playing = true;
  randomNumber = 0;
  //let randomSelector = 0;
  displayGamesPlayed.textContent = gamesPlayed;
  currentNumberOfTurns = 0;
  displayCurrentTurns.textContent = currentNumberOfTurns;

  for (let j = 0; j <= 2; j++) {
    for (let i = 0; i <= 3; i++) {
      tutorialClues.rows[i].cells[j].classList.remove("vertical-line");
      tutorialClues.rows[i].cells[j].style.color = "#5b4c5e";
    }
  }
}

function generateRandomNumber() {
  resetAll();

  for (i = 0; i <= 4; i++) {
    if (i == 0) {
      randomSelector = Math.trunc(Math.random() * 9) + 1;
    } else {
      randomSelector = Math.trunc(Math.random() * digitsZeroToNine.length);
    }

    digitsOfRandomNumber[i] = digitsZeroToNine[randomSelector];
    randomNumber += digitsOfRandomNumber[i] * 10 ** (4 - i);
    digitsZeroToNine.splice(randomSelector, 1);
  }

  console.log(`The random number is ${randomNumber}`);
  resetDigitsArray(digitsZeroToNine);
  //explanation.textContent = "";
  guessedNumber.value = "";
  guessedNumber.focus();
  deleteAllRows();
  tutorialDigits.classList.add("hidden");
  hideTutorialClues();
}

function splitNumberIntoDigits(number) {
  digitsOfInputNumber = String(number).split("").map(Number);

  // this is the same as the code below, but it's more efficient
  /*let divisor = 0;
  let partialNumber = number;
  for (i = 0; i <= 4; i++) {
    divisor = 10 ** (4 - i);
    digitsOfInputNumber[i] = Math.floor(partialNumber / divisor);
    partialNumber = number % divisor;
  }*/
}

function compareDigits() {
  centeredValue = 0;
  displacedValue = 0;
  for (i = 0; i <= 4; i++) {
    let skipOuterLoop = false;
    for (let j = 0; j <= 4; j++) {
      if (digitsOfInputNumber[i] === digitsOfRandomNumber[j]) {
        if (i === j) centeredValue++;
        else displacedValue++;
        skipOuterLoop = true;
        break;
      }
    }
    if (skipOuterLoop) continue;
  }
}

/*function testDuplicateDigits () {
    for (i=0; i<=3; i++) {
        for (j=i+1; j<=4; j++) {
            if (digitsOfInputNumber[i] === digitsOfInputNumber [j]) {

            }
        }
    }
}*/

function endGame(message) {
  explanation.textContent = message;
  playing = false;
  guessedNumber.disabled = true;
  getNumber.disabled = true;
  enterKeyEnabled = false;
  gamesPlayed++;
  displayGamesPlayed.textContent = gamesPlayed;
  displayAverageTurns.textContent = calculateAverageTurns(currentNumberOfTurns);
}

function guessANumber() {
  currentNumberOfTurns++;
  inputNumber = Number(guessedNumber.value);
  guessedNumber.value = ""; // deletes the value and keeps the cursor in the input box
  guessedNumber.focus();

  splitNumberIntoDigits(inputNumber);
  compareDigits();

  if (currentNumberOfTurns === 1) {
    setTutorialDigitsFromInput();
  }
  setTutorialClues(currentNumberOfTurns);

  // displays the key clues along the number you entered
  addRows(inputNumber, centeredValue, displacedValue);

  // for wining and losing the game
  if (inputNumber === randomNumber) {
    endGame(
      `✅✅✅ You Won! The number was ${randomNumber} and you guessed it! ✅✅✅. Press <Play Again> to play another game.`
    );
    youWon = true;
  }

  if (currentNumberOfTurns === 10 && !youWon) {
    endGame(
      `❌❌❌ You Lost! The number was ${randomNumber} but you didn't guess it ❌❌❌! Press <Play Again> to play another game.`
    );
  }
  displayCurrentTurns.textContent = currentNumberOfTurns;
}

function addCell(row, value) {
  const newCell = document.createElement("td"); // even if you have declared it as a universal variable, you still need to put it here to create the cell every time. Same below for rows. And you have to put const in the function to create the variable again every time. But it's just better to put it here and not make it universal because you are only using it here and this way you don't take up memory space.
  newCell.textContent = value;
  row.appendChild(newCell);
}

function addRows(number, center, offCenter) {
  const tableBody = document.getElementById("table-body");
  const newRow = document.createElement("tr");
  addCell(newRow, number);
  addCell(newRow, center);
  addCell(newRow, offCenter);
  tableBody.appendChild(newRow);
}

function deleteAllRows() {
  const tableBody = document.getElementById("table-body");
  tableBody.innerHTML = ""; //apparently, I need to put the innerHTML because it's a constant and with that I can somewhat still modify it??? I am not sure I understand
}

displayAverageTurns.textContent = 0;
resetDigitsArray(digitsZeroToNine);
if (!playing) generateRandomNumber();
instructions.addEventListener("click", () =>
  displayWarningMessageFunction(true)
);
tutorial.addEventListener("click", () => displayWarningMessageFunction(false));
closeWarningMessageBtn.addEventListener("click", closeWarningMessageFunction);
playAgain.addEventListener("click", generateRandomNumber);
getNumber.addEventListener("click", guessANumber);
document.addEventListener("keydown", function (event) {
  if (enterKeyEnabled && event.key === "Enter") {
    guessANumber();
  }
});
document.addEventListener("keydown", function (e) {
  // console.log(e.key);

  if (e.key === "Escape" && !warningMessage.classList.contains("hidden")) {
    closeWarningMessageFunction();
  }
});

guessedNumber.addEventListener("input", function (event) {
  //ensure you can not input more than 5 digits
  let value = event.target.value;
  if (value.startsWith("0") && value.length === 1) {
    //this doesn't let you put 0 as the first digit
    value = value.slice(1);
  }

  // Check for repeating digits
  const digits = value.split("");
  const uniqueDigits = [...new Set(digits)];
  if (digits.length !== uniqueDigits.length) {
    value = value.slice(0, -1);
    guessedNumber.classList.add("invalid");
    setTimeout(() => guessedNumber.classList.remove("invalid"), 500);
  }

  if (value.length > 5) {
    value = value.slice(0, 5);
  }
  event.target.value = value;
});
