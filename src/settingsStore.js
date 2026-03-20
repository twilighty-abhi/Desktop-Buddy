const fs = require("fs");
const path = require("path");
const { app } = require("electron");

const DEFAULT_SETTINGS = {
  breakIntervalMinutes: 25,
  notificationsEnabled: true,
  soundEnabled: true,
  autoRepeatAllDay: true,
  snoozeMinutes: 5,
  hydrationIntervalMinutes: 60,
  postureIntervalMinutes: 45,
};

function getSettingsPath() {
  return path.join(app.getPath("userData"), "settings.json");
}

function readSettings() {
  const filePath = getSettingsPath();

  if (!fs.existsSync(filePath)) {
    return { ...DEFAULT_SETTINGS };
  }

  try {
    const raw = fs.readFileSync(filePath, "utf8");
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch (error) {
    return { ...DEFAULT_SETTINGS };
  }
}

function writeSettings(partial) {
  const filePath = getSettingsPath();
  const current = readSettings();
  const merged = { ...current, ...partial };

  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(merged, null, 2), "utf8");

  return merged;
}

module.exports = {
  DEFAULT_SETTINGS,
  readSettings,
  writeSettings,
};
