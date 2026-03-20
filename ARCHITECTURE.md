# Desktop Buddy Architecture

## Overview

Desktop Buddy is a single-window Electron application built with vanilla JavaScript. It follows a **main process + renderer process** pattern with IPC-based communication.

```
┌─────────────────────────────────────────────────────────────┐
│                      Electron Application                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │               Main Process (src/main.js)             │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │ • Window lifecycle & tray management                 │  │
│  │ • IPC event handlers                                 │  │
│  │ • Notification delivery (toast + tray balloon)       │  │
│  │ • Reminder scheduling engine integration             │  │
│  │ • Settings & data persistence (JSON files)           │  │
│  │ • System integration (tray, context menu)            │  │
│  └──────────────────────────────────────────────────────┘  │
│                         ↕ IPC Bridge                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Preload Script (src/preload.js)              │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │ • Context isolation bridge                           │  │
│  │ • 15+ exposed APIs (getSettings, startPomodoro, etc) │  │
│  │ • Event subscription helpers                         │  │
│  └──────────────────────────────────────────────────────┘  │
│                         ↕ API Calls                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │       Renderer Process (public/renderer.js)          │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │ • UI event listeners & interaction handlers          │  │
│  │ • Real-time state rendering                          │  │
│  │ • Theme persistence (localStorage)                   │  │
│  │ • Dashboard views (breaks, tasks, daily, activity)   │  │
│  └──────────────────────────────────────────────────────┘  │
│                         ↓ Render                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │            UI Layer (public/index.html)              │  │
│  │                  + Dual Themes (CSS)                 │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │ • Playful theme: bold colors, illustrated mascot     │  │
│  │ • Calm theme: beige, minimal, analytics-focused      │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Module Breakdown

### Core Modules

#### `src/main.js` (Main Process)
**Responsibility**: Application lifecycle, IPC routing, notifications

**Key Functions**:
- `createWindow()` - Initializes app window with size/position persistence
- `showReminderNotification(title, body)` - Dual delivery: Electron toast + Windows tray balloon
- `startPomodoro(durationMin, mode)` - Initializes timer with state/tick events
- `addTask(text)` - Quick task capture with persistence
- `saveDailyCheckIn(data)` - Daily plan/review/mood persistence
- `getActivityHistory()` - Retrieves last 150 activity entries
- IPC Handlers: `handle()` for async, `on()` for events

**Storage**: `app.getPath('userData')` + JSON files
- `assistant-data.json` - Tasks, daily check-ins, activity history
- `settings.json` - User preferences (theme, reminder intervals)

---

#### `src/reminderEngine.js` (Scheduling)
**Responsibility**: Autonomous break/hydration/posture scheduling

**Key Functions**:
- `startSchedule(mode, onTick)` - Begin scheduling with mode (breaks, hydration, posture)
- `getNextReminderIn()` - Time until next reminder
- `skipReminder()` - Advance to next scheduled reminder
- `snoozeReminder(minutes)` - Temporary delay

**Behavior**:
- Runs in main process as background loop
- Fires reminder events based on configurable intervals
- Integrates with notification system

---

#### `src/preload.js` (Context Bridge)
**Responsibility**: Secure IPC bridge between renderer and main process

**Exposed APIs** (all return Promises or handle events):
- Settings: `getSettings()`, `updateSettings(key, value)`
- Reminders: `snoozeReminder()`, `skipReminder()`
- Pomodoro: `startPomodoro()`, `pausePomodoro()`, `stopPomodoro()`
- Tasks: `addTask()`, `getTasksForToday()`, `toggleTask()`, `deleteTask()`
- Daily: `saveDailyCheckIn()`, `getDailyCheckIns()`
- History: `getActivityHistory()`
- Events: `onReminderStateChanged()`, `onPomodoroTick()`, `onDataChanged()`, `onThemeChanged()`

---

#### `src/settingsStore.js` (Settings Persistence)
**Responsibility**: JSON-based settings management

**Key Functions**:
- `getSetting(key)` - Retrieve individual setting
- `setSetting(key, value)` - Save and persist to JSON
- `loadSettings()` - Load from disk on startup

**Default Settings**:
```javascript
{
  reminders: { enabled: true, interval: 30 },
  breaks: { enabled: true, interval: 60 },
  hydration: { enabled: true, interval: 90 },
  posture: { enabled: true, interval: 120 },
  theme: "playful"
}
```

---

#### `src/dataStore.js` (Application Data)
**Responsibility**: Tasks, daily check-ins, activity history persistence

**Key Functions**:
- `addTask(text, dueDate)` - Create new task
- `getTasks(date)` - Retrieve tasks for specific date
- `updateTask(id, updates)` - Mark done, edit, etc.
- `deleteTask(id)` - Remove task
- `saveDailyCheckIn(date, plan, review, mood)` - Daily entry
- `addHistory(event, details)` - Log activity
- `getHistory(limit)` - Last N activity entries (default 150)

**Storage File**: `assistant-data.json`
```javascript
{
  tasks: { "2026-03-20": [...] },
  daily: { "2026-03-20": {...} },
  history: [...]
}
```

---

### UI Modules

#### `public/index.html` (Markup)
**Structure**:
- Titlebar with theme toggle
- Sidebar with mascot illustration (playful theme only)
- 8 main dashboard sections:
  1. Break reminders + snooze/skip controls
  2. Hydration reminder + glass counter
  3. Posture reminder + check indicator
  4. Quick actions (notifications, history)
  5. Pomodoro timer + mode selector
  6. Task list + quick add
  7. Daily check-in form
  8. Activity history feed

---

#### `public/renderer.js` (Client Logic)
**Responsibility**: UI interactions, state management, event subscription

**Key Functions**:
- `initializeApp()` - Fetch initial state, bind listeners
- `renderPomodoroDisplay()` - Update countdown
- `renderTasks()` - Render task list from state
- `renderActivityHistory()` - Display last 10 activities
- `toggleTheme()` - Switch between playful/calm
- `handleQuickAddTask()` - Capture and persist task

**State Flow**:
1. App loads → fetch current state from main process
2. User interacts → call preload API
3. Main process updates → emit IPC event
4. Renderer subscribes → re-render affected UI

---

#### `public/style.css` (Styling - ~600 lines)
**Theme System**:

**Playful Theme** (default):
- Primary colors: Lime #c6eb6b, Pink #e88cdd, Sky #89b2ff, Mint #9ce7d8, Apricot #ffd39b, Plum #c3b2ff
- Typography: Baloo2 (playful, rounded)
- Borders: 20-25px border-radius
- Mascot: CSS-drawn character in sidebar
- Shadows: Bold, colorful accents

**Calm Theme** (`body.theme-calm`):
- Primary colors: Beige background #f0e4dc, Neutral cards #f7f6f5
- Typography: Nunito (clean, professional)
- Borders: 26px border radius (dashboard style)
- Shadows: Subtle, muted
- Layout: Analytics-focused (no mascot)

---

## Data Flow Diagram

```
User Action (click, input) 
    ↓
Renderer Event Handler (renderer.js)
    ↓
Preload API Call (preload.js)
    ↓
IPC Message to Main Process
    ↓
Main Handler (main.js)
    ↓
Update Data Store (dataStore.js / settingsStore.js)
    ↓
Write to Disk (JSON files)
    ↓
Emit IPC Event Back to Renderer
    ↓
Renderer Subscription Handler
    ↓
Re-render UI (DOM updates)
    ↓
User Sees Change
```

---

## IPC Communication Protocol

All IPC follows request-response or event pattern:

### Request-Response (async)
```javascript
// Renderer
const result = await window.electronAPI.startPomodoro(25, "work");

// Main
ipcMain.handle('start-pomodoro', async (event, minutes, mode) => {
  // Process request
  return { success: true, timerId: 123 };
});
```

### Events (one-way or subscription)
```javascript
// Renderer subscribes
window.electronAPI.onPomodoroTick((time) => {
  updateDisplay(time);
});

// Main emits
mainWindow.webContents.send('pomodoro-tick', remainingSeconds);
```

---

## Performance Notes

- **Memory**: ~150-200MB typical operation (Electron baseline)
- **Startup**: ~2-3 seconds cold start
- **Persistence**: Synchronous JSON I/O (small data sets, <1MB)
- **Scheduling**: Single backgroundScheduler loop, no threads
- **Notifications**: Native Windows API (no delays)

---

## Security Measures

- **Context Isolation**: Enabled (preload bridge only)
- **Sandbox**: Renderer process sandboxed
- **Node Integration**: Disabled in renderer
- **IPC Validation**: All messages validated by type
- **Local Data Only**: No network calls (no external dependencies)

---

## Extension Points

Future architecture improvements:
- **Plugin System**: Load custom reminder categories
- **Theme Engine**: User-created themes via JSON
- **API Layer**: HTTP server for companion apps
- **Database Migration**: SQLite for complex queries
- **Analytics**: Opt-in telemetry pipeline

---

## File Tree

```
desktop-buddy/
├── src/
│   ├── main.js                    # Main process
│   ├── reminderEngine.js          # Scheduling
│   ├── preload.js                 # IPC bridge
│   ├── settingsStore.js           # Settings persistence
│   └── dataStore.js               # Data persistence
├── public/
│   ├── index.html                 # UI markup
│   ├── renderer.js                # Client logic
│   └── style.css                  # Dual themes
├── .github/
│   ├── workflows/
│   │   ├── ci.yml                 # Test & lint
│   │   └── release.yml            # Build & release
│   ├── ISSUE_TEMPLATE/            # Issue templates
│   ├── pull_request_template.md   # PR guidance
│   └── CODEOWNERS                 # Owner assignment
├── package.json                   # Dependencies & config
├── README.md                      # Project overview
├── ROADMAP.md                     # Future features
├── ARCHITECTURE.md                # This file
├── CONTRIBUTING.md                # Dev guide
├── SECURITY.md                    # Security policy
└── LICENSE                        # MIT License
```

---

## Contributing to Architecture

Before making significant architectural changes:
1. Discuss in [GitHub Discussions](../../discussions)
2. Open an [Architecture Decision Record (ADR)](../../issues/new?template=feature_request.yml)
3. Ensure backwards compatibility or migration path
4. Update this document

---

## Questions?

Ask in [GitHub Discussions](../../discussions) or open an [issue](../../issues).
