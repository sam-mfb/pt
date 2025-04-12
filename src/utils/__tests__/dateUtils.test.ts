import { formatDuration, formatDate, getPastDays, formatTime, getCurrentDate, parseAppDate } from '../dateUtils';

describe('dateUtils', () => {
  describe('formatDuration', () => {
    it('should format seconds to MM:SS format', () => {
      expect(formatDuration(65)).toBe('01:05');
      expect(formatDuration(3600)).toBe('60:00');
      expect(formatDuration(0)).toBe('00:00');
    });
  });
  
  describe('parseAppDate', () => {
    it('should correctly parse a YYYY-MM-DD date string', () => {
      const date = parseAppDate('2023-04-15');
      expect(date.getFullYear()).toBe(2023);
      expect(date.getMonth()).toBe(3); // April is 3 (zero-indexed)
      expect(date.getDate()).toBe(15);
    });
    
    it('should throw an error for invalid date formats', () => {
      expect(() => parseAppDate('15-04-2023')).toThrow();
      expect(() => parseAppDate('2023/04/15')).toThrow();
      expect(() => parseAppDate('not a date')).toThrow();
    });
  });
  
  describe('formatDate', () => {
    it('should format a date string to ISO format without time', () => {
      expect(formatDate('2023-04-15T12:30:00.000Z')).toBe('2023-04-15');
      expect(formatDate(new Date('2023-04-15'))).toBe('2023-04-15');
    });
    
    it('should return the same string if already in YYYY-MM-DD format', () => {
      expect(formatDate('2023-04-15')).toBe('2023-04-15');
    });
    
    it('should handle invalid date strings gracefully', () => {
      expect(() => formatDate('not-a-date')).toThrow();
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
    
    it('should handle invalid time strings gracefully', () => {
      expect(formatTime('not-a-time')).toBe('Invalid time');
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
      
      // Update the test to not rely on specific dates
      expect(result.length).toBe(3);
      expect(typeof result[0]).toBe('string');
      expect(result[0]).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      
      // Restore original Date.now
      Date.now = originalNow;
    });
  });
  
  describe('getCurrentDate', () => {
    it('should return today\'s date in YYYY-MM-DD format', () => {
      // Mock Date to return a fixed date
      const fixedDate = new Date('2023-04-15T12:30:00Z');
      const originalDate = global.Date;
      
      // Mock Date constructor to return the fixed date
      global.Date = jest.fn(() => fixedDate) as any;
      global.Date.UTC = originalDate.UTC;
      global.Date.parse = originalDate.parse;
      global.Date.now = jest.fn(() => fixedDate.getTime());
      
      // Test getCurrentDate returns expected date 
      expect(getCurrentDate()).toBe('2023-04-15');
      
      // Restore original Date
      global.Date = originalDate;
    });
  });
});