// Local game logic functions (kept for potential future use)

/**
 * Generate a random 5-digit number with unique digits, first digit not 0
 * @returns {number} The generated random number
 */
export const generateLocalRandomNumber = (): number => {
  const digits: number[] = [];
  while (digits.length < 5) {
    const digit = Math.floor(Math.random() * 10);
    // Ensure first digit isn't 0 and all digits are unique
    if (digits.length === 0 && digit === 0) continue;
    if (!digits.includes(digit)) {
      digits.push(digit);
    }
  }
  // Convert array of digits to a number
  const number = parseInt(digits.join(""));
  console.log("🎯 Local random number for testing:", number);
  return number;
};

/**
 * Check a player's guess against the target number
 * @param {number} guess - The player's guess
 * @param {number} targetNumber - The target number to guess
 * @returns {Object} Object containing exactMatches and partialMatches
 */
export const checkLocalGuess = (guess: number, targetNumber: number) => {
  // Convert both numbers to arrays of digits for comparison
  const guessDigits = String(guess).split("").map(Number);
  const targetDigits = String(targetNumber).split("").map(Number);

  let exactMatches = 0;
  let partialMatches = 0;

  // Check for exact matches (correct digit in correct position)
  for (let i = 0; i < 5; i++) {
    if (guessDigits[i] === targetDigits[i]) {
      exactMatches++;
    }
  }

  // Check for partial matches (correct digit in wrong position)
  for (let i = 0; i < 5; i++) {
    if (
      targetDigits.includes(guessDigits[i]) &&
      guessDigits[i] !== targetDigits[i]
    ) {
      partialMatches++;
    }
  }

  return { exactMatches, partialMatches };
};

/**
 * Validate if a guess is a valid 5-digit number with unique digits
 * @param {number} guess - The number to validate
 * @returns {Object} Object with isValid boolean and error message if invalid
 */
export const validateLocalGuess = (guess: number) => {
  const guessStr = String(guess);

  // Check if it's a 5-digit number
  if (guessStr.length !== 5) {
    return { isValid: false, error: "Guess must be a 5-digit number" };
  }

  // Check if first digit is not 0
  if (guessStr[0] === "0") {
    return { isValid: false, error: "First digit cannot be 0" };
  }

  // Check if all digits are unique
  const digits = guessStr.split("");
  const uniqueDigits = new Set(digits);
  if (uniqueDigits.size !== 5) {
    return { isValid: false, error: "All digits must be unique" };
  }

  return { isValid: true };
};
