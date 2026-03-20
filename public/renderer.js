const fields = [
  "breakIntervalMinutes",
  "snoozeMinutes",
  "notificationsEnabled",
  "soundEnabled",
  "autoRepeatAllDay",
  "hydrationIntervalMinutes",
  "postureIntervalMinutes",
];

const statusEl = document.getElementById("status");
const pomodoroStatusEl = document.getElementById("pomodoroStatus");
const taskListEl = document.getElementById("taskList");
const activityListEl = document.getElementById("activityList");
const themeToggleEl = document.getElementById("themeToggle");

const calmThemeClass = "theme-calm";

function updateThemeButton() {
  if (!themeToggleEl) {
    return;
  }
  const isCalm = document.body.classList.contains(calmThemeClass);
  themeToggleEl.textContent = isCalm ? "Try Playful Design" : "Try Calm Design";
}

function applyTheme(themeName) {
  const isCalm = themeName === "calm";
  document.body.classList.toggle(calmThemeClass, isCalm);
  localStorage.setItem("desktopBuddyTheme", isCalm ? "calm" : "playful");
  updateThemeButton();
}

function bootstrapTheme() {
  const saved = localStorage.getItem("desktopBuddyTheme");
  applyTheme(saved === "calm" ? "calm" : "playful");
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formToSettings() {
  const result = {};

  for (const key of fields) {
    const el = document.getElementById(key);
    if (!el) {
      continue;
    }

    if (el.type === "checkbox") {
      result[key] = el.checked;
    } else {
      result[key] = Number(el.value);
    }
  }

  return result;
}

function hydrateForm(settings) {
  for (const key of fields) {
    const el = document.getElementById(key);
    if (!el || !(key in settings)) {
      continue;
    }

    if (el.type === "checkbox") {
      el.checked = Boolean(settings[key]);
    } else {
      el.value = String(settings[key]);
    }
  }
}

function renderState(state) {
  const parts = [];
  if (state.message) {
    parts.push(state.message);
  }
  if (state.nextBreakAt) {
    parts.push(`Next break: ${new Date(state.nextBreakAt).toLocaleTimeString()}`);
  }
  statusEl.textContent = parts.join(" | ") || "Assistant is ready";
}

function renderPomodoro(state) {
  if (!state || !state.running) {
    pomodoroStatusEl.textContent = "Pomodoro is idle";
    return;
  }

  const minutes = Math.floor(state.remainingSeconds / 60);
  const seconds = state.remainingSeconds % 60;
  const paddedSeconds = String(seconds).padStart(2, "0");
  pomodoroStatusEl.textContent = `${state.mode.toUpperCase()} ${minutes}:${paddedSeconds} remaining`;
}

function renderTasks(tasks) {
  if (!tasks.length) {
    taskListEl.innerHTML = "<li class=\"empty\">No tasks yet</li>";
    return;
  }

  taskListEl.innerHTML = tasks
    .map((task) => {
      const cls = task.done ? "task done" : "task";
      return `<li class="${cls}" data-id="${task.id}">
        <span>${escapeHtml(task.text)}</span>
        <div class="task-actions">
          <button class="secondary" data-action="toggle">${task.done ? "Undo" : "Done"}</button>
          <button class="secondary" data-action="delete">Delete</button>
        </div>
      </li>`;
    })
    .join("");
}

function renderDaily(daily) {
  document.getElementById("dailyPlan").value = daily.planText || "";
  document.getElementById("dailyReview").value = daily.reviewText || "";
  document.getElementById("mood").value = daily.mood || "";
}

function renderHistory(history) {
  if (!history.length) {
    activityListEl.innerHTML = "<li class=\"empty\">No activity yet</li>";
    return;
  }

  activityListEl.innerHTML = history
    .slice(0, 20)
    .map((entry) => {
      const time = new Date(entry.at).toLocaleTimeString();
      return `<li><strong>${escapeHtml(entry.type)}</strong> <span>${escapeHtml(entry.message)}</span> <small>${time}</small></li>`;
    })
    .join("");
}

async function refreshDashboardData() {
  const data = await window.assistantApi.getDashboardData();
  renderTasks(data.tasks || []);
  renderDaily(data.daily || {});
  renderHistory(data.history || []);
}

async function boot() {
  bootstrapTheme();

  const settings = await window.assistantApi.getSettings();
  hydrateForm(settings);

  const state = await window.assistantApi.getReminderState();
  renderState(state);

  const pomodoro = await window.assistantApi.getPomodoroState();
  renderPomodoro(pomodoro);
  await refreshDashboardData();

  window.assistantApi.onReminderStateChanged((nextState) => {
    renderState(nextState);
  });

  window.assistantApi.onNotificationStatus((payload) => {
    if (payload.delivered) {
      statusEl.textContent = `Notification sent: ${payload.title}`;
      return;
    }

    if (payload.usedFallback) {
      statusEl.textContent = "Toast blocked, used Windows tray balloon fallback.";
      return;
    }

    statusEl.textContent = "Notification could not be displayed. Check Windows notification settings.";
  });

  window.assistantApi.onPomodoroTick((payload) => {
    renderPomodoro(payload);
  });

  window.assistantApi.onDataChanged((payload) => {
    renderTasks(payload.tasks || []);
    renderDaily(payload.daily || {});
    renderHistory(payload.history || []);
  });
}

document.getElementById("saveSettings").addEventListener("click", async () => {
  const next = formToSettings();
  const updated = await window.assistantApi.updateSettings(next);
  hydrateForm(updated);

  const state = await window.assistantApi.getReminderState();
  renderState(state);
});

document.getElementById("snoozeNow").addEventListener("click", async () => {
  const snoozeMinutes = Number(document.getElementById("snoozeMinutes").value || 5);
  const state = await window.assistantApi.snoozeBreak(snoozeMinutes);
  renderState(state);
});

document.getElementById("skipNow").addEventListener("click", async () => {
  const state = await window.assistantApi.skipBreak();
  renderState(state);
});

document.getElementById("testNotification").addEventListener("click", async () => {
  await window.assistantApi.testNotification();
});

document.getElementById("startPomodoro").addEventListener("click", async () => {
  const workMinutes = Number(document.getElementById("pomodoroWorkMinutes").value || 25);
  const breakMinutes = Number(document.getElementById("pomodoroBreakMinutes").value || 5);
  const state = await window.assistantApi.startPomodoro(workMinutes, breakMinutes);
  renderPomodoro(state);
});

document.getElementById("stopPomodoro").addEventListener("click", async () => {
  const state = await window.assistantApi.stopPomodoro();
  renderPomodoro(state);
});

document.getElementById("addTask").addEventListener("click", async () => {
  const input = document.getElementById("taskInput");
  const text = (input.value || "").trim();
  if (!text) {
    return;
  }

  await window.assistantApi.addTask(text);
  input.value = "";
  await refreshDashboardData();
});

taskListEl.addEventListener("click", async (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  const action = target.getAttribute("data-action");
  if (!action) {
    return;
  }

  const row = target.closest("li[data-id]");
  if (!row) {
    return;
  }

  const id = row.getAttribute("data-id");
  if (!id) {
    return;
  }

  if (action === "toggle") {
    await window.assistantApi.toggleTask(id);
  }

  if (action === "delete") {
    await window.assistantApi.deleteTask(id);
  }

  await refreshDashboardData();
});

document.getElementById("saveDaily").addEventListener("click", async () => {
  const payload = {
    planText: document.getElementById("dailyPlan").value,
    reviewText: document.getElementById("dailyReview").value,
    mood: document.getElementById("mood").value,
  };
  await window.assistantApi.saveDailyCheckIn(payload);
  await refreshDashboardData();
});

if (themeToggleEl) {
  themeToggleEl.addEventListener("click", () => {
    const isCalm = document.body.classList.contains(calmThemeClass);
    applyTheme(isCalm ? "playful" : "calm");
  });
}

boot();
