@echo off
echo 🚀 Setting up Smart Ledger for team collaboration...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Check if Git is installed
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Git is not installed. Please install Git first.
    pause
    exit /b 1
)

REM Install dependencies
echo 📦 Installing dependencies...
call npm install

REM Check if installation was successful
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies. Please check the error messages above.
    pause
    exit /b 1
)
echo ✅ Dependencies installed successfully!

REM Run linting
echo 🔍 Running linter...
call npm run lint

REM Build the project
echo 🏗️ Building project...
call npm run build

if %errorlevel% neq 0 (
    echo ❌ Build failed. Please check the error messages above.
    pause
    exit /b 1
)
echo ✅ Project built successfully!

echo.
echo 🎉 Setup complete! You can now:
echo    • Run 'npm run dev' to start the development server
echo    • Open http://localhost:8080 in your browser
echo    • Start collaborating with your team!
echo.
echo 📚 Read COLLABORATION.md for detailed team workflow instructions.
pause
