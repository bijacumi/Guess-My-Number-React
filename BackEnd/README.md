# Guess the Number - Backend

Backend server for the Guess the Number game.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create environment file:

```bash
cp env.example .env
```

3. Start the development server:

```bash
npm run dev
```

## API Endpoints

### POST /api/game/new

Start a new game.

**Response:**

```json
{
  "success": true,
  "message": "New game started",
  "turnsRemaining": 10
}
```

### POST /api/game/guess

Submit a guess.

**Request:**

```json
{
  "guess": 12345
}
```

**Response (game continues):**

```json
{
  "success": true,
  "exactMatches": 2,
  "partialMatches": 1,
  "gameOver": false,
  "turnsRemaining": 9
}
```

**Response (game won):**

```json
{
  "success": true,
  "exactMatches": 5,
  "partialMatches": 0,
  "gameOver": true,
  "won": true,
  "turnsTaken": 3,
  "targetNumber": 12345
}
```

**Response (game lost):**

```json
{
  "success": true,
  "exactMatches": 2,
  "partialMatches": 1,
  "gameOver": true,
  "won": false,
  "targetNumber": 12345
}
```

### GET /api/game/status

Get current game status.

**Response:**

```json
{
  "success": true,
  "isActive": true,
  "turnsRemaining": 8,
  "gameHistory": [
    {
      "guess": 12345,
      "exactMatches": 2,
      "partialMatches": 1
    }
  ]
}
```

### GET /api/health

Health check endpoint.

**Response:**

```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Environment Variables

- `PORT`: Server port (default: 3001)
- `NODE_ENV`: Environment (development/production)
