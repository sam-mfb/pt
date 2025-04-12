import { useAppSelector } from '../hooks/useAppSelector';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { setCurrentDate } from '../store/slices/sessionSlice';
import { formatDate, getCurrentDate } from '../utils/dateUtils';

export const DateNavigator = (): JSX.Element => {
  const currentDate = useAppSelector((state) => state.sessions.currentDate);
  const dispatch = useAppDispatch();
  
  // Go to previous day
  const goToPreviousDay = (): void => {
    const date = new Date(currentDate);
    date.setDate(date.getDate() - 1);
    const previousDay = date.toISOString().split('T')[0];
    
    dispatch(setCurrentDate(previousDay));
  };
  
  // Go to next day (but not beyond today)
  const goToNextDay = (): void => {
    const date = new Date(currentDate);
    date.setDate(date.getDate() + 1);
    const nextDay = date.toISOString().split('T')[0];
    const today = getCurrentDate();
    
    // Don't allow going beyond today
    if (nextDay <= today) {
      dispatch(setCurrentDate(nextDay));
    }
  };
  
  // Go to today
  const goToToday = (): void => {
    const today = getCurrentDate();
    dispatch(setCurrentDate(today));
  };
  
  // Check if current date is today
  const isToday = currentDate === getCurrentDate();
  
  return (
    <div className="date-navigator">
      <button onClick={goToPreviousDay} className="btn-icon" aria-label="Previous day">
        ←
      </button>
      
      <div className="current-date">
        <button
          onClick={goToToday}
          className={`today-button ${isToday ? 'disabled' : ''}`}
          disabled={isToday}
        >
          {isToday ? 'Today' : 'Go to Today'}
        </button>
        <h2>{formatDate(currentDate)}</h2>
      </div>
      
      <button
        onClick={goToNextDay}
        className={`btn-icon ${isToday ? 'disabled' : ''}`}
        disabled={isToday}
        aria-label="Next day"
      >
        →
      </button>
    </div>
  );
};