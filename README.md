# Desktop buddy

Desktop buddy is an Electron-based personal assistant for healthy work habits.

## Features

- Break reminders with snooze and skip
- Hydration and posture reminders
- Pomodoro timer
- Quick task capture
- Daily plan, review, and mood log
- Activity history
- Theme switcher (playful and calm)

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
