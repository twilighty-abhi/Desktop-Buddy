const settingsStore = require('../../src/settingsStore');
const fs = require('fs');
const path = require('path');

// Mock storage location
const testSettingsFile = path.join(__dirname, '../../test-settings.json');

describe('settingsStore', () => {
  before(() => {
    // Override settings file path for testing
    settingsStore.setSettingsFile(testSettingsFile);
  });

  after(() => {
    // Cleanup
    if (fs.existsSync(testSettingsFile)) {
      fs.unlinkSync(testSettingsFile);
    }
  });

  describe('Default Settings', () => {
    test('should load default settings', () => {
      const settings = settingsStore.loadSettings();
      expect(settings.reminders).toBeDefined();
      expect(settings.theme).toBeDefined();
    });

    test('should have reminders enabled by default', () => {
      const reminders = settingsStore.getSetting('reminders');
      expect(reminders.enabled).toBe(true);
    });

    test('should have playful theme by default', () => {
      const theme = settingsStore.getSetting('theme');
      expect(theme).toBe('playful');
    });
  });

  describe('Setting Retrieval & Updates', () => {
    test('should get a setting by key', () => {
      const breaks = settingsStore.getSetting('breaks');
      expect(breaks).toBeDefined();
      expect(breaks.enabled).toBeDefined();
      expect(breaks.interval).toBeDefined();
    });

    test('should update a setting', () => {
      settingsStore.setSetting('theme', 'calm');
      const theme = settingsStore.getSetting('theme');
      expect(theme).toBe('calm');
    });

    test('should persist settings to file', () => {
      settingsStore.setSetting('custom_key', 'custom_value');
      expect(fs.existsSync(testSettingsFile)).toBe(true);
    });

    test('should update nested object settings', () => {
      const currentBreaks = settingsStore.getSetting('breaks');
      const updated = { ...currentBreaks, interval: 50 };
      settingsStore.setSetting('breaks', updated);
      const newBreaks = settingsStore.getSetting('breaks');
      expect(newBreaks.interval).toBe(50);
    });
  });

  describe('Theme Settings', () => {
    test('should switch to calm theme', () => {
      settingsStore.setSetting('theme', 'calm');
      expect(settingsStore.getSetting('theme')).toBe('calm');
    });

    test('should switch back to playful theme', () => {
      settingsStore.setSetting('theme', 'playful');
      expect(settingsStore.getSetting('theme')).toBe('playful');
    });
  });

  describe('Reminder Intervals', () => {
    test('should update break interval', () => {
      const breaks = settingsStore.getSetting('breaks');
      breaks.interval = 45;
      settingsStore.setSetting('breaks', breaks);
      expect(settingsStore.getSetting('breaks').interval).toBe(45);
    });

    test('should disable reminders', () => {
      const reminders = settingsStore.getSetting('reminders');
      reminders.enabled = false;
      settingsStore.setSetting('reminders', reminders);
      expect(settingsStore.getSetting('reminders').enabled).toBe(false);
    });

    test('should re-enable reminders', () => {
      const reminders = settingsStore.getSetting('reminders');
      reminders.enabled = true;
      settingsStore.setSetting('reminders', reminders);
      expect(settingsStore.getSetting('reminders').enabled).toBe(true);
    });
  });
});
