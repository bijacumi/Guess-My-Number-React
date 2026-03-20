const express = require("express");
const cors = require("cors");
require("dotenv").config();

const {
  generateRandomNumber,
  checkGuess,
  validateGuess,
} = require("./gameLogic");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors()); //to be able to call the backend from the frontend
app.use(express.json()); //to be able to parse the request body in JSON format

// Game state (in memory for now, will be moved to database later)
let currentGame = {
  targetNumber: null,
  isActive: false,
  turnsRemaining: 10,
  gameHistory: [],
};

// Routes

/**
 * POST /api/game/new
 * Start a new game
 */
app.post("/api/game/new", (req, res) => {
  try {
    currentGame = {
      targetNumber: generateRandomNumber(),
      isActive: true,
      turnsRemaining: 10,
      gameHistory: [],
    };

    res.json({
      success: true,
      message: "New game started",
      turnsRemaining: currentGame.turnsRemaining,
    });
  } catch (error) {
    console.error("Error starting new game:", error);
    res.status(500).json({
      success: false,
      error: "Failed to start new game",
    });
  }
});

/**
 * POST /api/game/guess
 * Submit a guess
 */
app.post("/api/game/guess", (req, res) => {
  try {
    const { guess } = req.body;

    // Check if game is active
    if (!currentGame.isActive) {
      return res.status(400).json({
        success: false,
        error: "No active game. Start a new game first.",
      });
    }

    // Validate guess
    const validation = validateGuess(guess);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: validation.error,
      });
    }

    // Check the guess and extract the exactMatches and partialMatches
    const { exactMatches, partialMatches } = checkGuess(
      guess,
      currentGame.targetNumber,
    );

    // Update game state with the new information
    currentGame.turnsRemaining--;
    currentGame.gameHistory.push({
      guess,
      exactMatches,
      partialMatches,
    });

    // Check win condition
    if (exactMatches === 5) {
      currentGame.isActive = false;
      return res.json({
        success: true,
        exactMatches,
        partialMatches,
        gameOver: true,
        won: true,
        turnsTaken: currentGame.gameHistory.length, //add 1 here because the current turn is not counted yet. Actually check to see if the problem is here or in another place, maybe on the frontend.
        targetNumber: currentGame.targetNumber,
      });
    }

    // Check lose condition
    if (currentGame.turnsRemaining === 0) {
      currentGame.isActive = false;
      return res.json({
        success: true,
        exactMatches,
        partialMatches,
        gameOver: true,
        won: false,
        targetNumber: currentGame.targetNumber,
      });
    }

    // Game continues
    res.json({
      success: true,
      exactMatches,
      partialMatches,
      gameOver: false,
      turnsRemaining: currentGame.turnsRemaining,
    });
  } catch (error) {
    console.error("Error processing guess:", error);
    res.status(500).json({
      success: false,
      error: "Failed to process guess",
    });
  }
});

/**
 * GET /api/game/status
 * Get current game status
 */
app.get("/api/game/status", (req, res) => {
  try {
    res.json({
      success: true,
      isActive: currentGame.isActive,
      turnsRemaining: currentGame.turnsRemaining,
      gameHistory: currentGame.gameHistory,
    });
  } catch (error) {
    console.error("Error getting game status:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get game status",
    });
  }
});

/**
 * GET /api/health
 * Health check endpoint
 */
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || "development"}`); //if the NODE_ENV is not set, default to development
});
