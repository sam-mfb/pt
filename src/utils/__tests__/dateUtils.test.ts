import { formatDuration, formatDate, getPastDays, formatTime } from '../dateUtils';

describe('dateUtils', () => {
  describe('formatDuration', () => {
    it('should format seconds to MM:SS format', () => {
      expect(formatDuration(65)).toBe('01:05');
      expect(formatDuration(3600)).toBe('60:00');
      expect(formatDuration(0)).toBe('00:00');
    });
  });
  
  describe('formatDate', () => {
    it('should format a date string to a human-readable format', () => {
      const mockDate = new Date('2023-04-15');
      const originalDateToLocale = Date.prototype.toLocaleDateString;
      
      // Mock the toLocaleDateString function to return a consistent output for testing
      Date.prototype.toLocaleDateString = jest.fn(() => 'Saturday, April 15, 2023');
      
      expect(formatDate('2023-04-15')).toBe('Saturday, April 15, 2023');
      
      // Restore original function
      Date.prototype.toLocaleDateString = originalDateToLocale;
    });
  });
  
  describe('formatTime', () => {
    it('should format a time string to a human-readable format', () => {
      const mockDate = new Date('2023-04-15T14:30:00');
      const originalTimeToLocale = Date.prototype.toLocaleTimeString;
      
      // Mock the toLocaleTimeString function to return a consistent output for testing
      Date.prototype.toLocaleTimeString = jest.fn(() => '2:30 PM');
      
      expect(formatTime('2023-04-15T14:30:00')).toBe('2:30 PM');
      
      // Restore original function
      Date.prototype.toLocaleTimeString = originalTimeToLocale;
    });
  });
  
  describe('getPastDays', () => {
    it('should return an array of dates for the past X days', () => {
      // Mock the Date object to return a consistent date
      const fixedDate = new Date('2023-04-15');
      const originalNow = Date.now;
      
      // Mock Date.now to return a fixed date
      Date.now = jest.fn(() => fixedDate.getTime());
      
      const result = getPastDays(3);
      
      expect(result).toEqual(['2023-04-15', '2023-04-14', '2023-04-13']);
      
      // Restore original Date.now
      Date.now = originalNow;
    });
  });
});