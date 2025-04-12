import { useState } from 'react';
import { TimerProvider } from './components/TimerProvider';
import { ExerciseList } from './components/ExerciseList';
import { History } from './components/History';
import { DateNavigator } from './components/DateNavigator';
import { DataControls } from './components/DataControls';
import { useAppSelector } from './hooks/useAppSelector';
import { useAppDispatch } from './hooks/useAppDispatch';
import { setActiveTab } from './store/slices/uiSlice';

const App = (): JSX.Element => {
  const activeTab = useAppSelector((state) => state.ui.activeTab);
  const dispatch = useAppDispatch();

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
              Today's Exercises
            </button>
            <button
              className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
              onClick={() => handleTabChange('history')}
            >
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

export default App;