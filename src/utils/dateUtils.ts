/**
 * Standard date format used throughout the application: YYYY-MM-DD
 */
export const DATE_FORMAT = 'YYYY-MM-DD';

/**
 * Parse a string in the app's standard YYYY-MM-DD format to a Date object
 * This explicitly handles the expected format to avoid timezone/browser inconsistencies
 */
export const parseAppDate = (dateString: string): Date => {
  if (!dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
    throw new Error(`Invalid date format: ${dateString}. Expected YYYY-MM-DD`);
  }
  
  const [year, month, day] = dateString.split('-').map(Number);
  // Create date in local timezone (months are 0-indexed in JS Date)
  return new Date(year, month - 1, day);
};

/**
 * Gets the current date in YYYY-MM-DD format
 */
export const getCurrentDate = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Formats a date in YYYY-MM-DD format
 * This standardizes handling of both Date objects and datestrings
 */
export const formatDate = (date: Date | string): string => {
  let dateObj: Date;
  
  if (typeof date === 'string') {
    // Handle the case when the string is already in our format
    if (date.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return date;
    }
    // Otherwise parse it safely to get the local date
    try {
      dateObj = new Date(date);
      // Check if the date is valid
      if (isNaN(dateObj.getTime())) {
        throw new Error(`Invalid date: ${date}`);
      }
    } catch (e) {
      throw new Error(`Invalid date: ${date}`);
    }
  } else {
    dateObj = date;
  }
  
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Formats a date in a full human-readable format (e.g., Monday, January 1, 2023)
 */
export const formatDateFull = (date: Date | string): string => {
  let dateObj: Date;
  
  if (typeof date === 'string') {
    // If it's in our standard format, parse it correctly
    if (date.match(/^\d{4}-\d{2}-\d{2}$/)) {
      dateObj = parseAppDate(date);
    } else {
      dateObj = new Date(date);
    }
  } else {
    dateObj = date;
  }
  
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  
  return dateObj.toLocaleDateString(undefined, options);
};

/**
 * Gets a relative day name (Today, Yesterday, Tomorrow) if applicable
 */
export const getRelativeDay = (dateString: string): string => {
  // Always use the app's standard date parsing
  const date = parseAppDate(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  // Reset time portions for comparison
  const dateClean = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const todayClean = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const yesterdayClean = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());
  const tomorrowClean = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate());
  
  if (dateClean.getTime() === todayClean.getTime()) {
    return 'Today';
  } else if (dateClean.getTime() === yesterdayClean.getTime()) {
    return 'Yesterday';
  } else if (dateClean.getTime() === tomorrowClean.getTime()) {
    return 'Tomorrow';
  }
  
  // Otherwise return the day of week
  const options: Intl.DateTimeFormatOptions = { weekday: 'long' };
  return date.toLocaleDateString(undefined, options);
};

/**
 * Formats time in a human-readable format (HH:MM AM/PM)
 * Takes ISO timestamp strings (like those from toISOString())
 */
export const formatTime = (timeString: string): string => {
  // ISO timestamp strings are always in UTC, so we need to ensure
  // they're displayed in the user's local time
  try {
    const date = new Date(timeString);
    
    // If the date is invalid, throw an error
    if (isNaN(date.getTime())) {
      throw new Error(`Invalid date: ${timeString}`);
    }
    
    return date.toLocaleTimeString(undefined, { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  } catch (e) {
    return 'Invalid time';
  }
};

/**
 * Formats duration in MM:SS format
 */
export const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

/**
 * Gets an array of dates for the past X days
 */
export const getPastDays = (days: number): string[] => {
  const dates: string[] = [];
  const today = new Date();
  
  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    dates.push(`${year}-${month}-${day}`);
  }
  
  return dates;
};