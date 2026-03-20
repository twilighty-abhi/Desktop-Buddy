# Desktop buddy

Desktop buddy is an Electron-based personal assistant for healthy work habits.

## Project status

- Active development
- Public release: `v1.0.0`

## Features

- Break reminders with snooze and skip
- Hydration and posture reminders
- Pomodoro timer
- Quick task capture
- Daily plan, review, and mood log
- Activity history
- Theme switcher (playful and calm)

## Tech stack

- Electron
- JavaScript, HTML, CSS
- Local JSON persistence (no cloud dependency)

## Run in development

```bash
npm install
npm start
```

## Build portable .exe

```bash
npm run make:exe
```

Output folder:

- `release/Desktop Buddy-win32-x64/Desktop Buddy.exe`

## Build installer

```bash
npm run dist
```

Note: on some Windows setups, installer build can require elevated privileges for symlink extraction used by signing tools.

## Repository standards

- CI workflow: [.github/workflows/ci.yml](.github/workflows/ci.yml)
- Release workflow: [.github/workflows/release.yml](.github/workflows/release.yml)
- Bug/feature templates: [.github/ISSUE_TEMPLATE](.github/ISSUE_TEMPLATE)
- Pull request template: [.github/pull_request_template.md](.github/pull_request_template.md)
- Contributing guide: [CONTRIBUTING.md](CONTRIBUTING.md)
- Security policy: [SECURITY.md](SECURITY.md)
