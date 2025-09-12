# 🚀 Team Setup Guide - Smart Ledger

## Quick Start (5 minutes)

### 1. Prerequisites
- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **Git** - [Download here](https://git-scm.com/)
- **VS Code** (recommended) - [Download here](https://code.visualstudio.com/)

### 2. Clone the Repository
```bash
git clone https://github.com/Harsh7817/wise-ledger-hub.git
cd wise-ledger-hub
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Start Development Server
```bash
npm run dev
```

### 5. Open in Browser
- Go to `http://localhost:8080`
- Use any email/password to sign in (demo mode)

## ✅ You're Ready!

You should now see:
- **Smart Ledger login page** with piggy bank logo
- **Full financial dashboard** after signing in
- **All features working** (Dashboard, Expenses, Income, Budget, Tax Calculator)

## 🔄 Daily Workflow

### Getting Latest Changes
```bash
git checkout main
git pull origin main
```

### Working on Features
```bash
# Create a new branch
git checkout -b feature/your-feature-name

# Make your changes
# ... edit files ...

# Commit changes
git add .
git commit -m "Add: Description of your changes"

# Push to GitHub
git push origin feature/your-feature-name

# Create Pull Request on GitHub
```

### Switching Between Branches
```bash
# See all branches
git branch -a

# Switch to main
git checkout main

# Switch to feature branch
git checkout feature/your-feature-name
```

## 🛠️ Available Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Check code quality
- `npm run lint:fix` - Fix linting issues
- `npm run preview` - Preview production build

## 📁 Project Structure

```
src/
├── components/          # UI components
│   ├── dashboard/       # Dashboard components
│   ├── layout/         # Header, Sidebar
│   └── ui/             # Base UI components
├── contexts/           # React contexts
├── pages/              # Page components
│   ├── Dashboard.tsx
│   ├── Expenses.tsx
│   ├── Income.tsx
│   ├── Budget.tsx
│   └── TaxCalculator.tsx
└── main.tsx           # App entry point
```

## 🎯 Development Guidelines

### Code Style
- Use TypeScript for all files
- Follow existing naming conventions
- Use meaningful variable names
- Add comments for complex logic

### Git Commit Messages
```
type: Brief description

- Detailed description if needed
```

Types: `Add:`, `Fix:`, `Update:`, `Remove:`, `Refactor:`, `Style:`, `Docs:`

## 🚨 Troubleshooting

### Common Issues

**1. Dependencies not installed:**
```bash
npm install
```

**2. Build errors:**
```bash
npm run build
```

**3. Linting errors:**
```bash
npm run lint:fix
```

**4. Git conflicts:**
```bash
git status
git diff
```

**5. Can't push changes:**
```bash
git pull origin main
# Resolve conflicts if any
git push origin your-branch-name
```

### Getting Help
- Check `COLLABORATION.md` for detailed workflow
- Ask team members in group chat
- Check GitHub Issues for known problems

## 📞 Team Communication

### Daily Standups
- What did you work on yesterday?
- What are you working on today?
- Any blockers or issues?

### Code Reviews
- Review all Pull Requests
- Test changes locally before approving
- Provide constructive feedback

## 🎉 Welcome to the Team!

You're now ready to contribute to Smart Ledger! 

**Repository**: https://github.com/Harsh7817/wise-ledger-hub
**Documentation**: See `COLLABORATION.md` for detailed workflow

Happy coding! 🚀
