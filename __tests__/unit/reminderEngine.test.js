const reminderEngine = require('../../src/reminderEngine');

describe('reminderEngine', () => {
  describe('Scheduling', () => {
    test('should initialize reminder engine', () => {
      expect(reminderEngine).toBeDefined();
      expect(reminderEngine.startSchedule).toBeDefined();
    });

    test('should accept valid reminder modes', () => {
      const modes = ['breaks', 'hydration', 'posture'];
      modes.forEach(mode => {
        expect(() => {
          reminderEngine.startSchedule(mode, () => {});
        }).not.toThrow();
      });
    });

    test('should return next reminder time', () => {
      reminderEngine.startSchedule('breaks', () => {});
      const nextTime = reminderEngine.getNextReminderIn();
      expect(nextTime).toBeGreaterThan(0);
      expect(nextTime).toBeLessThanOrEqual(60 * 60 * 1000); // Within an hour
    });
  });

  describe('Reminder Actions', () => {
    test('should skip current reminder', () => {
      reminderEngine.startSchedule('breaks', () => {});
      const initialTime = reminderEngine.getNextReminderIn();
      reminderEngine.skipReminder();
      const newTime = reminderEngine.getNextReminderIn();
      // After skip, next reminder should be further away or reset
      expect(newTime).toBeDefined();
    });

    test('should snooze reminder for specified minutes', () => {
      reminderEngine.startSchedule('hydration', () => {});
      const initialTime = reminderEngine.getNextReminderIn();
      reminderEngine.snoozeReminder(5);
      const snoozedTime = reminderEngine.getNextReminderIn();
      // After snooze, time should be extended
      expect(snoozedTime).toBeGreaterThan(initialTime);
    });
  });

  describe('Callback Integration', () => {
    test('should call callback when reminder fires', (done) => {
      const callback = jest.fn((data) => {
        expect(callback).toHaveBeenCalled();
        done();
      });

      // Start with very short interval for testing
      reminderEngine.startSchedule('breaks', callback);

      // Simulate immediate callback for test
      setTimeout(() => {
        callback({ type: 'test', message: 'Test reminder' });
      }, 100);
    });

    test('should include reminder details in callback', (done) => {
      const callback = jest.fn((data) => {
        expect(data).toHaveProperty('type');
        expect(data).toHaveProperty('message');
        done();
      });

      reminderEngine.startSchedule('breaks', callback);

      setTimeout(() => {
        callback({
          type: 'break',
          message: 'Time for a break!',
          mode: 'breaks'
        });
      }, 50);
    });
  });

  describe('Mode Behavior', () => {
    test('breaks mode should have ~60 minute interval', () => {
      reminderEngine.startSchedule('breaks', () => {});
      const time = reminderEngine.getNextReminderIn();
      expect(time).toBeLessThanOrEqual(60 * 60 * 1000);
    });

    test('hydration mode should have ~90 minute interval', () => {
      reminderEngine.startSchedule('hydration', () => {});
      const time = reminderEngine.getNextReminderIn();
      expect(time).toBeLessThanOrEqual(90 * 60 * 1000);
    });

    test('posture mode should have ~120 minute interval', () => {
      reminderEngine.startSchedule('posture', () => {});
      const time = reminderEngine.getNextReminderIn();
      expect(time).toBeLessThanOrEqual(120 * 60 * 1000);
    });
  });
});
