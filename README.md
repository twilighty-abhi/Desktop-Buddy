# Desktop Buddy

[![GitHub release](https://img.shields.io/github/v/release/twilighty-abhi/desktop-buddy)](https://github.com/twilighty-abhi/desktop-buddy/releases)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Build status](https://github.com/twilighty-abhi/desktop-buddy/workflows/CI/badge.svg)](https://github.com/twilighty-abhi/desktop-buddy/actions?query=workflow%3ACI)
[![Node 24](https://img.shields.io/badge/node-%3E%3D19.0.0-brightgreen)](package.json)
[![Electron 41](https://img.shields.io/badge/electron-41.0.3-blue)](https://www.electronjs.org/)
[![Last commit](https://img.shields.io/github/last-commit/twilighty-abhi/desktop-buddy)](https://github.com/twilighty-abhi/desktop-buddy/commits)

Your personal wellness coach for healthy work habits. Break reminders, Pomodoro timer, task tracking, and mood logging—all in a beautiful desktop app.

**[⬇️ Download Latest Release](https://github.com/twilighty-abhi/desktop-buddy/releases/latest)** | **[📋 Roadmap](ROADMAP.md)** | **[🏗️ Architecture](ARCHITECTURE.md)** | **[💬 Discussions](https://github.com/twilighty-abhi/desktop-buddy/discussions)**

---

## ✨ Features

- **Break Reminders** - Smart notifications for breaks, hydration, and posture checks
- **Pomodoro Timer** - 25/50-minute focus sessions with multiple modes
- **Task Management** - Quick capture, daily tracking, completion status
- **Daily Check-in** - Morning plans, evening reviews, mood logging
- **Activity History** - 150-entry feed of all interactions
- **Dual Themes** - Playful (colorful mascot) & Calm (minimal analytics)
- **Windows Tray** - System tray icon with quick access
- **Standalone .exe** - No installer needed, just click and run
- **Privacy First** - 100% local storage, zero cloud dependency

---

## 🚀 Quick Start

### Download & Run
1. Download `Desktop Buddy.exe` from [Releases](https://github.com/twilighty-abhi/desktop-buddy/releases)
2. Extract and run the `.exe` file
3. Grant notification permissions when prompted
4. Start your wellness journey!

### Or, Run from Source (Development)

**Requirements**: Node.js 19+

```bash
# Clone and install
git clone https://github.com/twilighty-abhi/desktop-buddy.git
cd desktop-buddy
npm install

# Start development server
npm start

# Run tests
npm test

# Build portable .exe
npm run make:exe
```

---

## 🎨 Dual Theme System

Switch between two beautifully designed themes:

**Playful Theme** - Bold colors, illustrated mascot coach, playful typography
- Primary Palette: Lime, Pink, Sky, Mint, Apricot, Plum
- Best for: Creative, energetic users

**Calm Theme** - Minimal beige design, analytics-focused, professional typography
- Primary Palette: Soft beige, neutral whites, subtle shadows
- Best for: Focused, minimalist users

Toggle theme anytime using the button in the titlebar. Your preference is saved automatically.

---

## 📚 Documentation

- **[Architecture Guide](ARCHITECTURE.md)** - Codebase overview, module breakdown, IPC design
- **[Developer Guide](CONTRIBUTING.md)** - Setup, testing, commit conventions
- **[Roadmap](ROADMAP.md)** - Planned features and community voting
- **[Security Policy](SECURITY.md)** - Vulnerability reporting
- **[Changelog](CHANGELOG.md)** - Version history and release notes

---

## 🛠️ Tech Stack

| Category | Tech |
|----------|------|
| **Framework** | Electron 41.0.3 |
| **Language** | JavaScript (Vanilla - no frameworks) |
| **Styling** | CSS (dual-theme with variables) |
| **Storage** | Local JSON persistence |
| **Notifications** | Electron API + Windows Tray |
| **Testing** | Jest |
| **CI/CD** | GitHub Actions |
| **Packaging** | electron-packager |
| **License** | MIT |

---

## 📊 Project Stats

- **Language**: JavaScript (59.2%), CSS (27.3%), HTML (13.5%)
- **Lines of Code**: ~2,500 core logic
- **Package Size**: ~150MB (including Electron)
- **Memory Usage**: ~170MB typical
- **Startup Time**: 2-3 seconds
- **Test Coverage**: Core modules (dataStore, settingsStore, reminderEngine)

---

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for:
- Development setup
- Branch naming conventions
- Commit message format (conventional commits)
- Pull request process
- Code standards

---

## 📝 Project Status

| Status | Details |
|--------|---------|
| **Current Release** | v1.0.0 (March 2026) |
| **Development** | Active |
| **Support** | Community-driven |
| **Updates** | Regular feature releases |

---

## 💡 Acknowledgments

- Electron team for the amazing framework
- GitHub for Actions CI/CD platform
- Our contributors and community members

See all [contributors](https://github.com/twilighty-abhi/desktop-buddy/contributors).

---

## 📞 Support & Feedback

- **Bugs**: [Open an issue](https://github.com/twilighty-abhi/desktop-buddy/issues/new?template=bug_report.yml)
- **Ideas**: [Start a discussion](https://github.com/twilighty-abhi/desktop-buddy/discussions)
- **Feature Requests**: [Request a feature](https://github.com/twilighty-abhi/desktop-buddy/issues/new?template=feature_request.yml)
- **Security Issues**: See [SECURITY.md](SECURITY.md)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) - see LICENSE file for details.

Copyright © 2026 Abhiram N J

---

**Find this project helpful?** Please consider:
- ⭐ Starring the repository
- 🐛 Reporting bugs
- 💬 Joining our community
- 🚀 Contributing code or ideas
