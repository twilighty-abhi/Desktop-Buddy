const dataStore = require('../../src/dataStore');
const fs = require('fs');
const path = require('path');

// Mock storage location
const testDataFile = path.join(__dirname, '../../test-data.json');

describe('dataStore', () => {
  before(() => {
    // Override data file path for testing
    dataStore.setDataFile(testDataFile);
  });

  after(() => {
    // Cleanup
    if (fs.existsSync(testDataFile)) {
      fs.unlinkSync(testDataFile);
    }
  });

  describe('Task Management', () => {
    test('should add a new task', () => {
      const task = dataStore.addTask('Complete project documentation');
      expect(task).toBeDefined();
      expect(task.text).toBe('Complete project documentation');
      expect(task.completed).toBe(false);
    });

    test('should retrieve tasks for a given date', () => {
      dataStore.addTask('Task 1');
      dataStore.addTask('Task 2');
      const today = new Date().toISOString().split('T')[0];
      const tasks = dataStore.getTasks(today);
      expect(tasks.length).toBeGreaterThanOrEqual(2);
    });

    test('should toggle task completion status', () => {
      const task = dataStore.addTask('Test task');
      expect(task.completed).toBe(false);
      const updated = dataStore.updateTask(task.id, { completed: true });
      expect(updated.completed).toBe(true);
    });

    test('should delete a task', () => {
      const task = dataStore.addTask('Task to delete');
      const today = new Date().toISOString().split('T')[0];
      const initialCount = dataStore.getTasks(today).length;
      dataStore.deleteTask(task.id);
      const finalCount = dataStore.getTasks(today).length;
      expect(finalCount).toBe(initialCount - 1);
    });
  });

  describe('Daily Check-in', () => {
    test('should save daily check-in', () => {
      const today = new Date().toISOString().split('T')[0];
      const checkIn = dataStore.saveDailyCheckIn(today, 'Plan: finish report', 'Review: made progress', 'neutral');
      expect(checkIn.plan).toBe('Plan: finish report');
      expect(checkIn.review).toBe('Review: made progress');
      expect(checkIn.mood).toBe('neutral');
    });

    test('should retrieve daily check-in', () => {
      const today = new Date().toISOString().split('T')[0];
      dataStore.saveDailyCheckIn(today, 'Test plan', 'Test review', 'happy');
      const checkIn = dataStore.getDailyCheckIn(today);
      expect(checkIn).toBeDefined();
      expect(checkIn.mood).toBe('happy');
    });
  });

  describe('Activity History', () => {
    test('should add history entry', () => {
      dataStore.addHistory('reminder-fired', { type: 'break', message: 'Time for a break' });
      const history = dataStore.getActivityHistory(10);
      expect(history.length).toBeGreaterThan(0);
    });

    test('should limit history to specified count', () => {
      // Add multiple entries
      for (let i = 0; i < 20; i++) {
        dataStore.addHistory('test-event', { index: i });
      }
      const history = dataStore.getActivityHistory(5);
      expect(history.length).toBeLessThanOrEqual(5);
    });

    test('should default to 150 entries', () => {
      const history = dataStore.getActivityHistory();
      expect(history.length).toBeLessThanOrEqual(150);
    });
  });
});
