const fs = require("fs");
const path = require("path");
const { app } = require("electron");

const DEFAULT_DATA = {
  tasks: [],
  daily: {
    date: "",
    planText: "",
    reviewText: "",
    mood: "",
  },
  history: [],
};

function getDataPath() {
  return path.join(app.getPath("userData"), "assistant-data.json");
}

function readAssistantData() {
  const filePath = getDataPath();

  if (!fs.existsSync(filePath)) {
    return { ...DEFAULT_DATA };
  }

  try {
    const raw = fs.readFileSync(filePath, "utf8");
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_DATA,
      ...parsed,
      tasks: Array.isArray(parsed.tasks) ? parsed.tasks : [],
      history: Array.isArray(parsed.history) ? parsed.history : [],
      daily: {
        ...DEFAULT_DATA.daily,
        ...(parsed.daily || {}),
      },
    };
  } catch (error) {
    return { ...DEFAULT_DATA };
  }
}

function writeAssistantData(next) {
  const filePath = getDataPath();

  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(next, null, 2), "utf8");

  return next;
}

module.exports = {
  readAssistantData,
  writeAssistantData,
};
