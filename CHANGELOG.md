# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-03-20

### Added
- Initial public release of Desktop Buddy
- **Break Reminders**: Customizable break notifications with snooze/skip controls
- **Hydration Reminders**: Periodic drink water prompts with glass tracking
- **Posture Reminders**: Postural health check-ins at regular intervals
- **Pomodoro Timer**: 25/50-minute focus sessions with mode switching
- **Task Management**: Quick task capture, daily view, toggle completion status
- **Daily Check-in**: Morning plans, evening reviews, and mood logging
- **Activity History**: 150-entry feed tracking all app interactions
- **Dual Themes**: 
  - Playful theme: Colorful UI with illustrated mascot coach
  - Calm theme: Minimal beige analytics-focused design
- **Theme Persistence**: User preference saved to localStorage
- **Windows Tray Integration**: System tray icon with context menu
- **Notification System**: Native Electron toasts + Windows tray balloon fallback
- **Settings Storage**: JSON-based user preferences persistence
- **Portable Executable**: Standalone `.exe` distribution (no installer required)
- **GitHub Actions CI**: Automated test runs on push/PR
- **GitHub Actions Release**: Automated `.exe` build and GitHub Release publishing on tag push
- **Issue Templates**: Bug report and feature request templates
- **Pull Request Template**: PR submission guidance
- **Contributing Guide**: Development setup and workflow documentation
- **Security Policy**: Vulnerability reporting guidelines
- **LICENSE**: MIT License for open-source distribution
- **CODEOWNERS**: Repository maintainer assignment
- **ROADMAP**: Public feature roadmap with community voting

### Technical
- Electron 41.0.3 framework
- Vanilla JavaScript (no frameworks)
- CSS dual-theme system with CSS variables
- Local JSON persistence (no network calls)
- Context-isolated IPC architecture
- Node 24-compatible GitHub Actions workflows

---

## Unreleased (Planned)

### Phase 2 (Q2 2026)
- [ ] Mood & energy trend analytics
- [ ] Weekly/monthly productivity summaries
- [ ] Streak tracking for habits
- [ ] CSV/JSON data export
- [ ] Advanced activity dashboard with charts

### Phase 3 (Q3 2026)
- [ ] Custom reminder categories
- [ ] Notification sound options
- [ ] User-created theme customization
- [ ] Multi-language support
- [ ] Global keyboard shortcuts

### Phase 4 (Q4 2026)
- [ ] Startup-on-login integration
- [ ] Enhanced tray menu features
- [ ] Cross-platform notifications (macOS/Linux)
- [ ] Calendar sync (Outlook/Google Calendar)

### Phase 5 (2027)
- [ ] macOS native build
- [ ] Linux support
- [ ] iOS companion app
- [ ] Cloud web dashboard

See [ROADMAP.md](ROADMAP.md) for detailed feature plans and community voting.

---

## Version Format

This project uses [Semantic Versioning](https://semver.org/):
- **MAJOR**: Incompatible API changes (1.x.0)
- **MINOR**: Backwards-compatible feature additions (1.1.0)
- **PATCH**: Backwards-compatible bug fixes (1.0.1)

---

## How to Report Changes

1. **Bug Fixes**: Include issue number and brief description
2. **Features**: Link to feature request issue or discussion
3. **Breaking Changes**: Explain migration path clearly
4. **Dependencies**: Note version updates

Example:
```
Fixed notification delivery failure on Windows (#42)
Added Jest testing framework with core modules coverage
Updated electron-builder to v26.8.1
```
