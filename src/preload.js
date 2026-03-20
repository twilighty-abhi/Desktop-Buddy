const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("assistantApi", {
  getSettings: () => ipcRenderer.invoke("assistant:getSettings"),
  updateSettings: (partial) => ipcRenderer.invoke("assistant:updateSettings", partial),
  getReminderState: () => ipcRenderer.invoke("assistant:getReminderState"),
  getDashboardData: () => ipcRenderer.invoke("assistant:getDashboardData"),
  getPomodoroState: () => ipcRenderer.invoke("assistant:getPomodoroState"),
  startPomodoro: (workMinutes, breakMinutes) =>
    ipcRenderer.invoke("assistant:startPomodoro", { workMinutes, breakMinutes }),
  stopPomodoro: () => ipcRenderer.invoke("assistant:stopPomodoro"),
  addTask: (text) => ipcRenderer.invoke("assistant:addTask", text),
  toggleTask: (id) => ipcRenderer.invoke("assistant:toggleTask", id),
  deleteTask: (id) => ipcRenderer.invoke("assistant:deleteTask", id),
  saveDailyCheckIn: (payload) => ipcRenderer.invoke("assistant:saveDailyCheckIn", payload),
  snoozeBreak: (minutes) => ipcRenderer.invoke("assistant:snoozeBreak", minutes),
  skipBreak: () => ipcRenderer.invoke("assistant:skipBreak"),
  openDashboard: () => ipcRenderer.invoke("assistant:openDashboard"),
  testNotification: () => ipcRenderer.invoke("assistant:testNotification"),
  onReminderStateChanged: (listener) => {
    const wrapped = (_, payload) => listener(payload);
    ipcRenderer.on("assistant:reminderStateChanged", wrapped);
    return () => ipcRenderer.removeListener("assistant:reminderStateChanged", wrapped);
  },
  onNotificationStatus: (listener) => {
    const wrapped = (_, payload) => listener(payload);
    ipcRenderer.on("assistant:notificationStatus", wrapped);
    return () => ipcRenderer.removeListener("assistant:notificationStatus", wrapped);
  },
  onDataChanged: (listener) => {
    const wrapped = (_, payload) => listener(payload);
    ipcRenderer.on("assistant:dataChanged", wrapped);
    return () => ipcRenderer.removeListener("assistant:dataChanged", wrapped);
  },
  onPomodoroTick: (listener) => {
    const wrapped = (_, payload) => listener(payload);
    ipcRenderer.on("assistant:pomodoroTick", wrapped);
    return () => ipcRenderer.removeListener("assistant:pomodoroTick", wrapped);
  },
});
