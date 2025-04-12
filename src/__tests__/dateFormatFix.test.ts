import { formatDate, getCurrentDate, getPastDays } from '../utils/dateUtils';

describe('Date Format Fix Tests', () => {
  it('verifies that formatDate works consistently across timezones', () => {
    // Get current date
    const today = getCurrentDate();
    console.log('getCurrentDate() returns:', today);
    
    // Use formatDate on a Date object
    const dateObj = new Date();
    const formattedDate = formatDate(dateObj);
    console.log('formatDate(new Date()) returns:', formattedDate);
    
    // They should match
    expect(formattedDate).toBe(today);
    
    // Check yesterday with both methods
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    const yesterdayFormatted = formatDate(yesterday);
    console.log('formatDate(yesterday) returns:', yesterdayFormatted);
    
    // Get yesterday using getPastDays
    const pastDays = getPastDays(2); // Today and yesterday
    console.log('getPastDays(2) returns:', pastDays);
    
    // The second item (index 1) should be yesterday
    expect(pastDays[1]).toBe(yesterdayFormatted);
  });
});