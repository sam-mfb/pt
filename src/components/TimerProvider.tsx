import { ReactNode, useState, useCallback, useEffect } from 'react';
import { createContext, useContext } from 'react';
import { TimerContextType } from '../types';

const TimerContext = createContext<TimerContextType | undefined>(undefined);

interface TimerProviderProps {
  children: ReactNode;
}

export const TimerProvider = ({ children }: TimerProviderProps) => {
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [duration, setDuration] = useState(0);
  // Add a callback for when timer completes
  const [onComplete, setOnComplete] = useState<(() => void) | null>(null);
  
  // Reset timer to zero without changing duration
  const resetTimer = useCallback((): void => {
    setIsRunning(false);
    setSeconds(0);
    setOnComplete(null);
  }, []);
  
  // Start timer with a specified duration and optional completion callback
  const startTimer = useCallback((newDuration: number, completeCallback?: () => void): void => {
    setDuration(newDuration);
    setSeconds(newDuration);
    setIsRunning(true);
    if (completeCallback) {
      setOnComplete(() => completeCallback);
    } else {
      setOnComplete(null);
    }
  }, []);
  
  // Pause the current timer without resetting
  const pauseTimer = useCallback((): void => {
    setIsRunning(false);
  }, []);
  
  // Resume the current timer
  const resumeTimer = useCallback((): void => {
    if (seconds > 0) {
      setIsRunning(true);
    }
  }, [seconds]);
  
  // Restart the timer with the current duration
  const restartTimer = useCallback((): void => {
    setSeconds(duration);
    setIsRunning(true);
  }, [duration]);
  
  // Timer effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    
    if (isRunning && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);
    } else if (isRunning && seconds === 0) {
      setIsRunning(false);
      
      // Execute callback when timer reaches zero
      if (onComplete) {
        onComplete();
      }
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning, seconds, onComplete]);
  
  return (
    <TimerContext.Provider value={{ 
      isRunning, 
      seconds, 
      duration,
      startTimer, 
      pauseTimer, 
      resumeTimer, 
      resetTimer,
      restartTimer 
    }}>
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