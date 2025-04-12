/**
 * Gets the current date in YYYY-MM-DD format
 */
export const getCurrentDate = (): string => {
  return new Date().toISOString().split('T')[0];
};

/**
 * Formats a date in a human-readable format
 */
export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toISOString().split('T')[0];
};

/**
 * Formats a date in a full human-readable format (e.g., Monday, January 1, 2023)
 */
export const formatDateFull = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
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
  const date = new Date(dateString);
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
 */
export const formatTime = (timeString: string): string => {
  const date = new Date(timeString);
  return date.toLocaleTimeString(undefined, { 
    hour: '2-digit', 
    minute: '2-digit'
  });
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
    dates.push(date.toISOString().split('T')[0]);
  }
  
  return dates;
};