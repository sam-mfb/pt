import { useState } from 'react';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { setCurrentDate } from '../store/slices/sessionSlice';
import { formatDateFull, formatDate, getRelativeDay } from '../utils/dateUtils';

export const DateNavigator = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const currentDate = useAppSelector((state) => state.sessions.currentDate);
  const [showCalendar, setShowCalendar] = useState(false);
  
  // Navigate to previous day
  const handlePrevDay = (): void => {
    const date = new Date(currentDate);
    date.setDate(date.getDate() - 1);
    dispatch(setCurrentDate(formatDate(date)));
  };
  
  // Navigate to next day
  const handleNextDay = (): void => {
    const date = new Date(currentDate);
    date.setDate(date.getDate() + 1);
    dispatch(setCurrentDate(formatDate(date)));
  };
  
  // Navigate to today
  const handleToday = (): void => {
    dispatch(setCurrentDate(formatDate(new Date())));
  };
  
  // Get relative day name (Today, Yesterday, etc)
  const relativeDay = getRelativeDay(currentDate);
  
  return (
    <div className="date-navigator card mb-lg">
      <div className="flex justify-between items-center">
        <button onClick={handlePrevDay} className="btn-icon" aria-label="Previous day">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        
        <div className="date-display text-center" onClick={() => setShowCalendar(!showCalendar)}>
          <h3 className="text-lg font-medium">{relativeDay}</h3>
          <p className="text-md text-primary font-semibold">{formatDateFull(new Date(currentDate))}</p>
        </div>
        
        <button onClick={handleNextDay} className="btn-icon" aria-label="Next day">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
      
      {/* Quick Navigation */}
      <div className="date-shortcuts mt-md flex gap-sm justify-center">
        <button
          onClick={handleToday}
          className="btn btn-secondary text-sm"
          disabled={relativeDay === 'Today'}
        >
          Today
        </button>
      </div>
    </div>
  );
};