# 🤝 Smart Ledger - Team Collaboration Guide

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- Git
- VS Code (recommended)
- GitHub account

### Initial Setup
1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd wise-ledger-hub-main
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   - Go to `http://localhost:8080`
   - Use any email/password to sign in (demo mode)

## 🔄 Workflow

### Making Changes
1. **Create a new branch:**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b bugfix/issue-description
   ```

2. **Make your changes:**
   - Edit files in VS Code
   - Test your changes locally
   - Ensure the app still builds: `npm run build`

3. **Commit your changes:**
   ```bash
   git add .
   git commit -m "Add: Brief description of your changes"
   ```

4. **Push to GitHub:**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create a Pull Request:**
   - Go to GitHub repository
   - Click "New Pull Request"
   - Select your branch
   - Add description of changes
   - Request review from teammates

### Getting Updates from Teammates
1. **Switch to main branch:**
   ```bash
   git checkout main
   ```

2. **Pull latest changes:**
   ```bash
   git pull origin main
   ```

3. **Update your feature branch:**
   ```bash
   git checkout feature/your-feature-name
   git merge main
   ```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── dashboard/       # Dashboard-specific components
│   ├── layout/         # Layout components (Header, Sidebar)
│   └── ui/             # Base UI components (shadcn/ui)
├── contexts/           # React contexts (Auth, etc.)
├── hooks/              # Custom React hooks
├── integrations/       # External service integrations
│   └── supabase/       # Supabase configuration
├── lib/                # Utility functions
├── pages/              # Page components
│   ├── Dashboard.tsx
│   ├── Expenses.tsx
│   ├── Income.tsx
│   ├── Budget.tsx
│   ├── TaxCalculator.tsx
│   └── Login.tsx
└── main.tsx           # App entry point
```

## 🎯 Development Guidelines

### Code Style
- Use TypeScript for all new files
- Follow existing naming conventions
- Use meaningful variable and function names
- Add comments for complex logic

### Component Guidelines
- Create components in appropriate folders
- Use functional components with hooks
- Keep components small and focused
- Use proper TypeScript interfaces

### Git Commit Messages
Use this format:
```
type: Brief description

- Detailed description if needed
- List of changes made
```

Types:
- `Add:` New features
- `Fix:` Bug fixes
- `Update:` Changes to existing features
- `Remove:` Deleting features
- `Refactor:` Code improvements
- `Style:` UI/styling changes
- `Docs:` Documentation updates

## 🚨 Important Notes

### Before Starting Work
1. **Always pull latest changes:**
   ```bash
   git checkout main
   git pull origin main
   ```

2. **Create a new branch for your work:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

### Before Committing
1. **Test your changes:**
   ```bash
   npm run build
   npm run lint
   ```

2. **Check for conflicts:**
   ```bash
   git status
   ```

### Before Pushing
1. **Ensure all tests pass:**
   ```bash
   npm run build
   ```

2. **Check for linting errors:**
   ```bash
   npm run lint
   ```

## 🔧 VS Code Setup

### Recommended Extensions
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript Importer
- Auto Rename Tag
- Path IntelliSense

### Settings
The project includes `.vscode/settings.json` with:
- Auto-formatting on save
- ESLint integration
- Tailwind CSS support
- TypeScript configuration

## 🐛 Troubleshooting

### Common Issues

1. **Dependencies not installed:**
   ```bash
   npm install
   ```

2. **Build errors:**
   ```bash
   npm run build
   ```

3. **Linting errors:**
   ```bash
   npm run lint
   ```

4. **Git conflicts:**
   ```bash
   git status
   git diff
   ```

### Getting Help
- Check existing issues on GitHub
- Ask teammates in team chat
- Review project documentation

## 📋 Team Responsibilities

### Frontend Developer
- UI/UX components
- User interface improvements
- Responsive design
- User experience optimization

### Backend Developer
- API integration
- Database operations
- Authentication system
- Data processing

### Full-Stack Developer
- End-to-end features
- Integration testing
- Performance optimization
- Deployment

## 🚀 Deployment

### Development
- Local development server: `npm run dev`
- Preview build: `npm run preview`

### Production
- Build: `npm run build`
- Deploy to hosting platform

## 📞 Communication

### Daily Standups
- What did you work on yesterday?
- What are you working on today?
- Any blockers or issues?

### Code Reviews
- Review all pull requests
- Provide constructive feedback
- Test changes locally before approving

### Issue Tracking
- Use GitHub Issues for bugs and features
- Assign issues to team members
- Update issue status regularly

---

**Happy Coding! 🎉**
