#!/bin/bash

echo "Setting up Guess the Number Backend..."

# Create .env file from example
if [ ! -f .env ]; then
    echo "Creating .env file from env.example..."
    cp env.example .env
    echo "✅ .env file created"
else
    echo "✅ .env file already exists"
fi

# Install dependencies
echo "Installing dependencies..."
npm install

echo "✅ Setup complete!"
echo ""
echo "To start the development server, run:"
echo "npm run dev"
echo ""
echo "The server will run on http://localhost:3001" 