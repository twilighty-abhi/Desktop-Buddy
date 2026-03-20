class ReminderEngine {
  constructor(onStateChange, onReminder) {
    this.onStateChange = onStateChange;
    this.onReminder = onReminder;
    this.settings = null;
    this.breakTimer = null;
    this.hydrationTimer = null;
    this.postureTimer = null;
    this.nextBreakAt = null;
    this.latestState = {
      status: "idle",
      message: "Assistant is idle",
      nextBreakAt: null,
      updatedAt: new Date().toISOString(),
    };
  }

  start(settings) {
    this.settings = settings;
    this.stop();

    if (!settings.notificationsEnabled) {
      this.pushState("idle", "Notifications are disabled");
      return;
    }

    this.scheduleBreakCycle(settings.breakIntervalMinutes * 60 * 1000);
    this.scheduleHydrationCycle(settings.hydrationIntervalMinutes * 60 * 1000);
    this.schedulePostureCycle(settings.postureIntervalMinutes * 60 * 1000);
    this.pushState("running", this.buildStatusMessage());
  }

  stop() {
    if (this.breakTimer) {
      clearTimeout(this.breakTimer);
      this.breakTimer = null;
    }

    if (this.hydrationTimer) {
      clearInterval(this.hydrationTimer);
      this.hydrationTimer = null;
    }

    if (this.postureTimer) {
      clearInterval(this.postureTimer);
      this.postureTimer = null;
    }
  }

  updateSettings(settings) {
    this.start(settings);
  }

  snoozeBreak(minutes) {
    if (!this.settings) {
      return;
    }

    this.scheduleBreakCycle(minutes * 60 * 1000);
    this.pushState("snoozed", `Break snoozed for ${minutes} minutes`);
  }

  skipBreak() {
    if (!this.settings) {
      return;
    }

    this.scheduleBreakCycle(this.settings.breakIntervalMinutes * 60 * 1000);
    this.pushState("skipped", "Skipped current break reminder");
  }

  getState() {
    return { ...this.latestState };
  }

  scheduleBreakCycle(delayMs) {
    if (this.breakTimer) {
      clearTimeout(this.breakTimer);
    }

    this.nextBreakAt = new Date(Date.now() + delayMs).toISOString();

    this.breakTimer = setTimeout(() => {
      this.sendReminder({
        title: "Time for a screen break",
        body: "Look 20 feet away for 20 seconds, stretch, and relax your shoulders.",
      });

      if (this.settings.autoRepeatAllDay) {
        this.scheduleBreakCycle(this.settings.breakIntervalMinutes * 60 * 1000);
      }
    }, delayMs);
  }

  scheduleHydrationCycle(intervalMs) {
    this.hydrationTimer = setInterval(() => {
      this.sendReminder({
        title: "Hydration check",
        body: "Take a few sips of water.",
      });
    }, intervalMs);
  }

  schedulePostureCycle(intervalMs) {
    const prompts = [
      "Relax your neck and drop your shoulders.",
      "Sit tall with your lower back supported.",
      "Roll your shoulders backward 5 times.",
    ];

    this.postureTimer = setInterval(() => {
      const body = prompts[Math.floor(Math.random() * prompts.length)];
      this.sendReminder({
        title: "Posture check",
        body,
      });
    }, intervalMs);
  }

  sendReminder({ title, body }) {
    if (!this.settings.notificationsEnabled) {
      return;
    }

    if (typeof this.onReminder === "function") {
      this.onReminder({
        title,
        body,
        silent: !this.settings.soundEnabled,
      });
    }

    this.pushState("triggered", `${title}: ${body}`);
  }

  buildStatusMessage() {
    if (!this.settings || !this.nextBreakAt) {
      return "Assistant is idle";
    }

    return `Next break at ${new Date(this.nextBreakAt).toLocaleTimeString()}`;
  }

  pushState(status, message) {
    this.latestState = {
      status,
      message,
      nextBreakAt: this.nextBreakAt,
      updatedAt: new Date().toISOString(),
    };

    if (typeof this.onStateChange === "function") {
      this.onStateChange({ ...this.latestState });
    }
  }
}

module.exports = {
  ReminderEngine,
};
