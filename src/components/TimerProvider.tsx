import { ReactNode, useState, useCallback, useEffect } from 'react';
import { createContext, useContext } from 'react';
import { TimerContextType } from '../types';

const TimerContext = createContext<TimerContextType | undefined>(undefined);

interface TimerProviderProps {
  children: ReactNode;
}

export const TimerProvider = ({ children }: TimerProviderProps): JSX.Element => {
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [duration, setDuration] = useState(0);
  
  // Reset timer
  const resetTimer = useCallback((): void => {
    setIsRunning(false);
    setSeconds(0);
    setDuration(0);
  }, []);
  
  // Start timer with a specified duration
  const startTimer = useCallback((newDuration: number): void => {
    setDuration(newDuration);
    setSeconds(newDuration);
    setIsRunning(true);
  }, []);
  
  // Stop timer
  const stopTimer = useCallback((): void => {
    setIsRunning(false);
  }, []);
  
  // Timer effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    
    if (isRunning && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);
    } else if (isRunning && seconds === 0) {
      setIsRunning(false);
      
      // Notify user that the timer is complete
      if ('Notification' in window && Notification.permission === 'granted') {
        // eslint-disable-next-line no-new
        new Notification('PT Exercise Timer', {
          body: 'Time\'s up! Exercise complete.',
        });
      } else if ('Notification' in window && Notification.permission !== 'denied') {
        Notification.requestPermission();
      }
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning, seconds]);
  
  return (
    <TimerContext.Provider value={{ isRunning, seconds, startTimer, stopTimer, resetTimer }}>
      {children}
    </TimerContext.Provider>
  );
};

// Custom hook to use the TimerContext
export const useTimer = (): TimerContextType => {
  const context = useContext(TimerContext);
  
  if (context === undefined) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  
  return context;
};