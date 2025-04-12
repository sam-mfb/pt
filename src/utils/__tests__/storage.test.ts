import { loadState, saveState, importState } from '../storage';
import { AppState } from '../../types';

describe('storage utilities', () => {
  const mockState: AppState = {
    exercises: [
      { id: '1', name: 'Squat', sets: 3, reps: 10, duration: 30 }
    ],
    history: [
      {
        date: '2023-04-15',
        sessions: [
          {
            id: 'session1',
            exerciseId: '1',
            startTime: '2023-04-15T10:00:00.000Z',
            endTime: '2023-04-15T10:01:30.000Z',
            completed: true
          }
        ]
      }
    ],
    currentDate: '2023-04-15'
  };

  beforeEach(() => {
    // Mock localStorage
    Storage.prototype.getItem = jest.fn();
    Storage.prototype.setItem = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('loadState', () => {
    it('should return undefined if localStorage is empty', () => {
      (localStorage.getItem as jest.Mock).mockReturnValue(null);
      
      const result = loadState();
      
      expect(result).toBeUndefined();
      expect(localStorage.getItem).toHaveBeenCalledWith('pt_tracker_data');
    });

    it('should parse and return state from localStorage', () => {
      (localStorage.getItem as jest.Mock).mockReturnValue(JSON.stringify(mockState));
      
      const result = loadState();
      
      expect(result).toEqual(mockState);
      expect(localStorage.getItem).toHaveBeenCalledWith('pt_tracker_data');
    });

    it('should handle JSON parse errors and return undefined', () => {
      (localStorage.getItem as jest.Mock).mockReturnValue('invalid json');
      
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      const result = loadState();
      
      expect(result).toBeUndefined();
      expect(consoleSpy).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });
  });

  describe('saveState', () => {
    it('should stringify and save state to localStorage', () => {
      saveState(mockState);
      
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'pt_tracker_data',
        JSON.stringify(mockState)
      );
    });

    it('should handle stringify errors', () => {
      const circularObj: any = {};
      circularObj.self = circularObj;
      
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      saveState(circularObj as AppState);
      
      expect(consoleSpy).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });
  });

  describe('importState', () => {
    it('should parse and validate a valid JSON string', () => {
      const result = importState(JSON.stringify(mockState));
      
      expect(result).toEqual(mockState);
    });

    it('should return null for invalid JSON', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      const result = importState('invalid json');
      
      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });

    it('should return null for JSON with missing required properties', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      const invalidState = { exercises: [] }; // Missing history and currentDate
      const result = importState(JSON.stringify(invalidState));
      
      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });
  });
});