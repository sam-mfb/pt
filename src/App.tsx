import { useState, useEffect } from 'react';
import { TimerProvider } from './components/TimerProvider';
import { ExerciseList } from './components/ExerciseList';
import { History } from './components/History';
import { DateNavigator } from './components/DateNavigator';
import { DataControls } from './components/DataControls';
import { useAppSelector } from './hooks/useAppSelector';
import { useAppDispatch } from './hooks/useAppDispatch';
import { setActiveTab } from './store/slices/uiSlice';
import { resetToToday } from './store/slices/sessionSlice';

export const App = () => {
  const activeTab = useAppSelector((state) => state.ui.activeTab);
  const dispatch = useAppDispatch();
  
  // Always reset to today's date when the app loads
  useEffect(() => {
    dispatch(resetToToday());
  }, [dispatch]);

  const handleTabChange = (tab: 'exercises' | 'history'): void => {
    dispatch(setActiveTab(tab));
  };
  
  return (
    <TimerProvider>
      <div className="app">
        <header>
          <h1>PT Exercise Tracker</h1>
          <nav>
            <button
              className={`tab-button ${activeTab === 'exercises' ? 'active' : ''}`}
              onClick={() => handleTabChange('exercises')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-xs">
                <path d="M18 5H6C4.89543 5 4 5.89543 4 7V19C4 20.1046 4.89543 21 6 21H18C19.1046 21 20 20.1046 20 19V7C20 5.89543 19.1046 5 18 5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 2V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 2V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4 11H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Today's Exercises
            </button>
            <button
              className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
              onClick={() => handleTabChange('history')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-xs">
                <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3.05078 11.0002C3.27939 8.18472 4.76423 5.61542 7.12561 3.99503C9.48699 2.37465 12.4699 1.86328 15.2973 2.61326C18.1247 3.36324 20.4841 5.30431 21.7501 7.89063C23.0162 10.477 23.0592 13.4857 21.8672 16.1072C20.6751 18.7287 18.3701 20.7288 15.5633 21.5485C12.7565 22.3683 9.73852 21.9291 7.34563 20.3418C4.95274 18.7546 3.41062 16.1884 3.05078 13.371" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              History
            </button>
          </nav>
        </header>
        
        <main className="container">
          {activeTab === 'exercises' && (
            <>
              <DateNavigator />
              <ExerciseList />
            </>
          )}
          
          {activeTab === 'history' && (
            <>
              <History />
              <DataControls />
            </>
          )}
        </main>
        
        <footer>
          <p>PT Exercise Tracker &copy; {new Date().getFullYear()}</p>
        </footer>
      </div>
    </TimerProvider>
  );
};

// We're exporting App as a named export above