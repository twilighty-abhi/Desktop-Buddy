const path = require("path");
const { app, BrowserWindow, ipcMain, Tray, Menu, nativeImage, Notification } = require("electron");
const { ReminderEngine } = require("./reminderEngine");
const { readSettings, writeSettings } = require("./settingsStore");
const { readAssistantData, writeAssistantData } = require("./dataStore");

let mainWindow = null;
let tray = null;
let settings = null;
let assistantData = readAssistantData();
let pomodoroTimer = null;
let pomodoroState = {
  running: false,
  mode: "work",
  workMinutes: 25,
  breakMinutes: 5,
  endsAt: null,
  remainingSeconds: 0,
};

app.setPath("sessionData", path.join(app.getPath("temp"), "desktop-buddy-session"));
app.commandLine.appendSwitch("disk-cache-dir", path.join(app.getPath("temp"), "desktop-buddy-cache"));

function notifyRenderer(channel, payload) {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send(channel, payload);
  }
}

function saveAssistantData(next) {
  assistantData = writeAssistantData(next);
  notifyRenderer("assistant:dataChanged", assistantData);
}

function addHistory(type, message) {
  const entry = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    type,
    message,
    at: new Date().toISOString(),
  };

  const next = {
    ...assistantData,
    history: [entry, ...(assistantData.history || [])].slice(0, 150),
  };

  saveAssistantData(next);
}

function getPomodoroState() {
  if (!pomodoroState.running || !pomodoroState.endsAt) {
    return { ...pomodoroState, remainingSeconds: 0 };
  }

  const remainingMs = new Date(pomodoroState.endsAt).getTime() - Date.now();
  const remainingSeconds = Math.max(0, Math.ceil(remainingMs / 1000));
  return { ...pomodoroState, remainingSeconds };
}

function runPomodoroTick() {
  const snapshot = getPomodoroState();
  notifyRenderer("assistant:pomodoroTick", snapshot);

  if (!snapshot.running || snapshot.remainingSeconds > 0) {
    return;
  }

  const switchedMode = snapshot.mode === "work" ? "break" : "work";
  const durationMinutes = switchedMode === "work" ? snapshot.workMinutes : snapshot.breakMinutes;

  pomodoroState = {
    ...snapshot,
    running: true,
    mode: switchedMode,
    endsAt: new Date(Date.now() + durationMinutes * 60 * 1000).toISOString(),
  };

  showReminderNotification({
    title: switchedMode === "work" ? "Focus session started" : "Break session started",
    body:
      switchedMode === "work"
        ? "Back to focused work. Stay on one task."
        : "Take a short break and reset your posture.",
    silent: !settings.soundEnabled,
  });
  addHistory("pomodoro", `Switched to ${switchedMode} mode`);
}

function startPomodoro(workMinutes, breakMinutes) {
  const safeWork = Math.max(5, Math.min(180, Number(workMinutes) || 25));
  const safeBreak = Math.max(3, Math.min(60, Number(breakMinutes) || 5));

  if (pomodoroTimer) {
    clearInterval(pomodoroTimer);
  }

  pomodoroState = {
    running: true,
    mode: "work",
    workMinutes: safeWork,
    breakMinutes: safeBreak,
    endsAt: new Date(Date.now() + safeWork * 60 * 1000).toISOString(),
    remainingSeconds: safeWork * 60,
  };

  pomodoroTimer = setInterval(runPomodoroTick, 1000);
  runPomodoroTick();
  addHistory("pomodoro", `Started ${safeWork}/${safeBreak} focus cycle`);

  return getPomodoroState();
}

function stopPomodoro() {
  if (pomodoroTimer) {
    clearInterval(pomodoroTimer);
    pomodoroTimer = null;
  }

  pomodoroState = {
    ...pomodoroState,
    running: false,
    endsAt: null,
    remainingSeconds: 0,
  };

  notifyRenderer("assistant:pomodoroTick", getPomodoroState());
  addHistory("pomodoro", "Stopped focus cycle");
  return getPomodoroState();
}

function showReminderNotification({ title, body, silent }) {
  let delivered = false;

  try {
    if (Notification.isSupported()) {
      const notification = new Notification({
        title,
        body,
        silent,
      });
      notification.show();
      delivered = true;
    }
  } catch (error) {
    delivered = false;
  }

  // Always use a tray balloon on Windows to survive Focus Assist and dev-toast quirks.
  if (tray && process.platform === "win32") {
    tray.displayBalloon({
      iconType: "info",
      title,
      content: body,
      noSound: Boolean(silent),
    });
  }

  notifyRenderer("assistant:notificationStatus", {
    delivered,
    usedFallback: process.platform === "win32" && Boolean(tray),
    title,
    body,
    at: new Date().toISOString(),
  });

  addHistory("notification", `${title}: ${body}`);
}

const reminderEngine = new ReminderEngine(
  (state) => {
    notifyRenderer("assistant:reminderStateChanged", state);
  },
  (reminder) => {
    showReminderNotification(reminder);
  }
);

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 920,
    height: 640,
    minWidth: 760,
    minHeight: 520,
    title: "Desktop Buddy",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadFile(path.join(__dirname, "..", "public", "index.html"));

  mainWindow.on("close", (event) => {
    if (!app.isQuiting) {
      event.preventDefault();
      mainWindow.hide();
    }
  });
}

function createTray() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><circle cx="8" cy="8" r="7" fill="#0071e3"/><circle cx="8" cy="8" r="3" fill="#ffffff"/></svg>`;
  const trayIcon = nativeImage.createFromDataURL(`data:image/svg+xml;utf8,${encodeURIComponent(svg)}`);
  tray = new Tray(trayIcon.resize({ width: 16, height: 16 }));
  tray.setToolTip("Desktop Buddy");

  const trayMenu = Menu.buildFromTemplate([
    {
      label: "Open Dashboard",
      click: () => showWindow(),
    },
    {
      label: "Snooze 5 min",
      click: () => reminderEngine.snoozeBreak(5),
    },
    {
      label: "Skip Break",
      click: () => reminderEngine.skipBreak(),
    },
    { type: "separator" },
    {
      label: "Quit",
      click: () => {
        app.isQuiting = true;
        app.quit();
      },
    },
  ]);

  tray.setContextMenu(trayMenu);
  tray.on("click", () => showWindow());
}

function showWindow() {
  if (!mainWindow) {
    return;
  }

  mainWindow.show();
  mainWindow.focus();
}

function registerIpc() {
  ipcMain.handle("assistant:getSettings", async () => settings);

  ipcMain.handle("assistant:updateSettings", async (_, partial) => {
    settings = writeSettings(partial);
    reminderEngine.updateSettings(settings);
    return settings;
  });

  ipcMain.handle("assistant:getReminderState", async () => reminderEngine.getState());
  ipcMain.handle("assistant:getDashboardData", async () => assistantData);
  ipcMain.handle("assistant:getPomodoroState", async () => getPomodoroState());

  ipcMain.handle("assistant:startPomodoro", async (_, payload) => {
    return startPomodoro(payload?.workMinutes, payload?.breakMinutes);
  });

  ipcMain.handle("assistant:stopPomodoro", async () => {
    return stopPomodoro();
  });

  ipcMain.handle("assistant:addTask", async (_, text) => {
    const safeText = String(text || "").trim();
    if (!safeText) {
      return assistantData;
    }

    const next = {
      ...assistantData,
      tasks: [
        {
          id: `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
          text: safeText,
          done: false,
          createdAt: new Date().toISOString(),
        },
        ...(assistantData.tasks || []),
      ],
    };

    saveAssistantData(next);
    addHistory("task", `Added task: ${safeText}`);
    return assistantData;
  });

  ipcMain.handle("assistant:toggleTask", async (_, id) => {
    const next = {
      ...assistantData,
      tasks: (assistantData.tasks || []).map((task) =>
        task.id === id
          ? {
              ...task,
              done: !task.done,
            }
          : task
      ),
    };

    saveAssistantData(next);
    addHistory("task", "Toggled task status");
    return assistantData;
  });

  ipcMain.handle("assistant:deleteTask", async (_, id) => {
    const next = {
      ...assistantData,
      tasks: (assistantData.tasks || []).filter((task) => task.id !== id),
    };

    saveAssistantData(next);
    addHistory("task", "Deleted task");
    return assistantData;
  });

  ipcMain.handle("assistant:saveDailyCheckIn", async (_, payload) => {
    const next = {
      ...assistantData,
      daily: {
        date: new Date().toISOString().slice(0, 10),
        planText: String(payload?.planText || ""),
        reviewText: String(payload?.reviewText || ""),
        mood: String(payload?.mood || ""),
      },
    };

    saveAssistantData(next);
    addHistory("daily", "Saved daily check-in");
    return assistantData;
  });

  ipcMain.handle("assistant:snoozeBreak", async (_, minutes) => {
    reminderEngine.snoozeBreak(Number(minutes) || settings.snoozeMinutes);
    return reminderEngine.getState();
  });

  ipcMain.handle("assistant:skipBreak", async () => {
    reminderEngine.skipBreak();
    return reminderEngine.getState();
  });

  ipcMain.handle("assistant:openDashboard", async () => {
    showWindow();
    return true;
  });

  ipcMain.handle("assistant:testNotification", async () => {
    showReminderNotification({
      title: "Desktop Buddy test",
      body: "Notifications are working. You will receive reminder alerts here.",
      silent: !settings.soundEnabled,
    });
    return true;
  });
}

app.whenReady().then(() => {
  app.setAppUserModelId("com.desktopbuddy.app");

  settings = readSettings();
  registerIpc();
  createWindow();
  createTray();

  reminderEngine.start(settings);
  mainWindow.hide();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
    showWindow();
  });
});

app.on("window-all-closed", () => {
  // Keep app alive in tray on Windows/macOS.
});

app.on("before-quit", () => {
  app.isQuiting = true;
  reminderEngine.stop();
  stopPomodoro();
});
