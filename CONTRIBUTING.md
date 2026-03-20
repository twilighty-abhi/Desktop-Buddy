# Contributing

Thanks for contributing to Desktop buddy!

---

## 🚀 Quick Start

### Prerequisites
- Node.js 19 or later
- npm (usually bundled with Node.js)
- Git

### Development Setup

1. **Fork and clone** the repository:
```bash
git clone https://github.com/YOUR_USERNAME/Desktop-Buddy.git
cd Desktop-Buddy
```

2. **Install dependencies**:
```bash
npm install
```

3. **Start development server**:
```bash
npm start
```

4. **Make your changes** and test locally

---

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test:watch

# Run tests with coverage report
npm test:coverage
```

### Test Structure

Tests are located in `__tests__/unit/` and use **Jest** framework:

- `__tests__/unit/dataStore.test.js` - Task, daily check-in, and history tests
- `__tests__/unit/settingsStore.test.js` - Settings persistence tests
- `__tests__/unit/reminderEngine.test.js` - Reminder scheduling tests

### Writing Tests

When adding new features:
1. Write tests in `__tests__/unit/`
2. Ensure core logic is testable (avoid Electron-specific code in logic)
3. Aim for >80% coverage on new modules
4. Follow Jest conventions (describe, test, expect)

Example test:
```javascript
test('should add a new task', () => {
  const task = dataStore.addTask('New task');
  expect(task.text).toBe('New task');
  expect(task.completed).toBe(false);
});
```

---

## 🏗️ Architecture Overview

Before contributing, read the [Architecture Guide](ARCHITECTURE.md) to understand:
- Main process vs. renderer process
- IPC communication pattern
- Data persistence strategy
- UI theming system

**Quick reference**:
- **Main process**: `src/main.js` - Window lifecycle, notifications, IPC handlers
- **Renderer**: `public/renderer.js` - UI interactions, state rendering
- **Storage**: `src/dataStore.js`, `src/settingsStore.js` - JSON persistence
- **Styling**: `public/style.css` - Dual theme system

---

## 📝 Commit Message Style

Use **conventional commits** format:

```
type(scope): description

[optional body]
```

**Types**:
- `feat` - New feature
- `fix` - Bug fix
- `refactor` - Code reorganization (no behavior change)
- `docs` - Documentation updates
- `test` - Test additions/updates
- `ci` - CI/CD workflow changes
- `chore` - Dependency updates, build config

**Examples**:
```
feat(pomodoro): add 50-minute session option
fix(notification): handle Windows Focus Assist blocking
docs(roadmap): update Phase 2 timeline
test(dataStore): add coverage for task deletion
ci(workflow): upgrade node version to 24
```

---

## 🔄 Pull Request Process

1. **Create a feature branch**:
```bash
git checkout -b feat/your-feature-name
```

2. **Make your changes**:
   - Keep commits small and focused
   - Follow the commit message style above
   - Write tests for new functionality

3. **Test before pushing**:
```bash
npm test
npm start  # Manual smoke test
```

4. **Push and open PR**:
```bash
git push origin feat/your-feature-name
```

5. **Fill the PR template**:
   - Describe what changed and why
   - Link related issues
   - Include testing steps for reviewers
   - Add screenshots for UI changes (**no build artifacts**)

### PR Checklist
- [ ] Tests pass locally (`npm test`)
- [ ] No lint errors (`npm run lint` when available)
- [ ] Follows commit message conventions
- [ ] Includes tests for new features
- [ ] No build output committed (`release/`, `dist/`, `node_modules/`)
- [ ] Updated [CHANGELOG.md](CHANGELOG.md) for user-facing changes

---

## 🎨 UI/Theme Development

When modifying UI or themes:

1. **Test both themes**:
   - Playful theme (default, colorful with mascot)
   - Calm theme (beige, analytics-focused)

2. **Files**:
   - Markup: `public/index.html`
   - Styles: `public/style.css` (CSS variables for theming)
   - Logic: `public/renderer.js`

3. **Theme support checklist**:
   - [ ] Tested in playful theme
   - [ ] Tested in calm theme
   - [ ] Responsive on 1024x768 minimum
   - [ ] Dark mode consideration

---

## 🐛 Reporting Bugs

Found a bug? Use the [bug report template](https://github.com/twilighty-abhi/desktop-buddy/issues/new?template=bug_report.yml):

- Clear summary
- Reproduction steps
- Expected vs. actual behavior
- Desktop Buddy version, OS, Node version
- Relevant logs or screenshots

---

## 💡 Feature Ideas

Have a great idea? [Open a discussion](https://github.com/twilighty-abhi/desktop-buddy/discussions) or [create a feature request](https://github.com/twilighty-abhi/desktop-buddy/issues/new?template=feature_request.yml).

Check the [Roadmap](ROADMAP.md) to see planned features and vote on your favorites!

---

## 📚 Resources

- [Architecture Guide](ARCHITECTURE.md) - Deep dive into codebase
- [Roadmap](ROADMAP.md) - Planned features and community voting
- [Security Policy](SECURITY.md) - Reporting vulnerabilities
- [Changelog](CHANGELOG.md) - Version history

---

## 🎯 Development Goals

Our priorities for contributions:

**High Priority** ✅
- Bug fixes and stability
- Test coverage for core modules
- Documentation improvements
- Performance optimizations

**Medium Priority** 🟡
- Local feature enhancements (quick ways to be productive)
- UI/UX improvements
- Accessibility (keyboard nav, WCAG compliance)

**Lower Priority** (See Roadmap) 🟠
- Cloud sync features
- Cross-platform support
- Advanced analytics

---

## Release Process

### For Maintainers

1. **Update version**:
```bash
npm version minor  # or major, patch
```

2. **Update CHANGELOG.md**:
```markdown
## [X.Y.Z] - YYYY-MM-DD
### Added
### Fixed
### Changed
```

3. **Commit and tag**:
```bash
git add package.json CHANGELOG.md
git commit -m "chore(release): bump to v1.1.0"
git tag v1.1.0
git push origin main --follow-tags
```

4. GitHub Actions will:
   - Build portable `.exe`
   - Create GitHub Release
   - Auto-generate release notes

---

## ❓ Questions?

- 💬 [GitHub Discussions](https://github.com/twilighty-abhi/desktop-buddy/discussions)
- 🐛 [Create an Issue](https://github.com/twilighty-abhi/desktop-buddy/issues)
- 📧 See [SECURITY.md](SECURITY.md) for security contact

Thanks for making Desktop Buddy better! 🙌
