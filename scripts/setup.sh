#!/bin/bash

# Smart Ledger - Team Setup Script

echo "🚀 Setting up Smart Ledger for team collaboration..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if Git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if installation was successful
if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully!"
else
    echo "❌ Failed to install dependencies. Please check the error messages above."
    exit 1
fi

# Run linting
echo "🔍 Running linter..."
npm run lint

# Build the project
echo "🏗️ Building project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Project built successfully!"
else
    echo "❌ Build failed. Please check the error messages above."
    exit 1
fi

echo ""
echo "🎉 Setup complete! You can now:"
echo "   • Run 'npm run dev' to start the development server"
echo "   • Open http://localhost:8080 in your browser"
echo "   • Start collaborating with your team!"
echo ""
echo "📚 Read COLLABORATION.md for detailed team workflow instructions."
