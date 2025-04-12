import { formatDate, getRelativeDay, getCurrentDate } from '../utils/dateUtils';

describe('Date Formatting Bug Tests', () => {
  it('examines potential timezone issues in formatting', () => {
    // Current date from our function
    const today = getCurrentDate();
    console.log('getCurrentDate() returns:', today);
    
    // Current date using standard JS Date
    const jsDate = new Date();
    const jsDateISO = jsDate.toISOString().split('T')[0];
    console.log('JavaScript Date ISO:', jsDateISO);
    console.log('Raw JavaScript Date:', jsDate.toString());
    
    // The potential issue is in the formatDate function which uses toISOString()
    // Let's check what happens with various input formats
    
    // 1. Using current date string directly
    const formattedToday = formatDate(today);
    console.log('formatDate(today) returns:', formattedToday);
    console.log('Are they the same?', today === formattedToday);
    
    // 2. Create a Date object with just the date portion
    const dateFromToday = new Date(today);
    console.log('Date object created from today string:', dateFromToday.toString());
    const formattedFromDateObj = formatDate(dateFromToday);
    console.log('formatDate(dateFromToday) returns:', formattedFromDateObj);
    
    // 3. Let's look at getRelativeDay and see what it returns
    const relativeDay = getRelativeDay(today);
    console.log('getRelativeDay(today) returns:', relativeDay);
    
    // 4. What happens when we use yesterday's date?
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
    console.log('Yesterday string:', yesterdayString);
    
    const relativeYesterday = getRelativeDay(yesterdayString);
    console.log('getRelativeDay(yesterdayString) returns:', relativeYesterday);
    
    // 5. What happens with formatted dates?
    const formattedYesterday = formatDate(yesterday);
    console.log('formatDate(yesterday) returns:', formattedYesterday);
    
    // 6. Check what getRelativeDay returns for the formatted yesterday
    const relativeFormattedYesterday = getRelativeDay(formattedYesterday);
    console.log('getRelativeDay(formattedYesterday) returns:', relativeFormattedYesterday);
  });
});