import React, { useCallback } from 'react';
import { Exercise } from '../types';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useTimer } from './TimerProvider';
import { formatDuration } from '../utils/dateUtils';
import { deleteExercise } from '../store/slices/exerciseSlice';
import { startSession, completeSession, completeRep, cancelSession } from '../store/slices/sessionSlice';
import { useAppSelector } from '../hooks/useAppSelector';

interface ExerciseItemProps {
  exercise: Exercise;
  completedCount: number;
  inProgressSessionId?: string;
  onEdit: (exercise: Exercise) => void;
}

export const ExerciseItem = ({
  exercise,
  completedCount,
  inProgressSessionId,
  onEdit,
}: ExerciseItemProps) => {
  const dispatch = useAppDispatch();
  // Get timer functions from context
  const timer = useTimer();
  const { 
    startTimer, 
    pauseTimer, 
    resumeTimer, 
    resetTimer, 
    restartTimer, 
    isRunning, 
    seconds 
  } = timer;
  
  // Get current session to access completedReps
  const currentSession = useAppSelector(state => {
    if (!inProgressSessionId) return null;
    
    const todayRecord = state.sessions.history.find(
      (record: any) => record.date === state.sessions.currentDate
    );
    
    if (!todayRecord) return null;
    
    return todayRecord.sessions.find((session: any) => session.id === inProgressSessionId);
  });
  
  // Calculate set progress percentage
  const progressPercentage = (completedCount / exercise.sets) * 100;
  
  // Calculate rep progress for current session
  const completedReps = currentSession?.completedReps || 0;
  const repProgressPercentage = currentSession 
    ? (completedReps / exercise.reps) * 100
    : 0;
  
  // Start a new session for this exercise
  const handleStart = (): void => {
    // If we have a session in progress but all reps are complete, cancel it
    // This happens when starting a new set
    if (inProgressSessionId && completedReps >= exercise.reps) {
      dispatch(completeSession({ sessionId: inProgressSessionId }));
    }
    
    if (inProgressSessionId && completedReps < exercise.reps) {
      return; // Already in progress with incomplete reps
    }
    
    // Start a new session without automatically starting the timer
    dispatch(startSession(exercise.id));
    // No automatic timer start - user must click the timer button
  };
  
  // Complete the current set - now only used internally
  const handleCompleteSet = useCallback((): void => {
    if (!inProgressSessionId) {
      return; // No session in progress
    }
    
    dispatch(completeSession({ sessionId: inProgressSessionId }));
    resetTimer(); // Reset timer for next set
  }, [inProgressSessionId, dispatch, resetTimer]);
  
  // Complete a rep when timer finishes
  const handleRepComplete = useCallback(() => {
    if (inProgressSessionId) {
      dispatch(completeRep({ sessionId: inProgressSessionId }));
      
      // If we've completed all reps for this set, automatically complete the set
      if (completedReps + 1 >= exercise.reps) {
        handleCompleteSet();
      } else {
        // Reset timer but don't start the next rep automatically
        resetTimer();
      }
    }
  }, [inProgressSessionId, dispatch, completedReps, exercise.reps, resetTimer, handleCompleteSet]);
  
  // Start/stop timer for individual rep
  const handleTimerControl = (): void => {
    if (!inProgressSessionId) {
      return; // No session in progress
    }
    
    if (isRunning) {
      pauseTimer();
    } else if (seconds === 0) {
      startTimer(exercise.duration, handleRepComplete);
    } else {
      resumeTimer();
    }
  };
  
  // Cancel the current session
  const handleCancel = (): void => {
    if (!inProgressSessionId) {
      return; // No session in progress
    }
    
    dispatch(cancelSession({ sessionId: inProgressSessionId }));
    resetTimer();
  };
  
  // Delete this exercise
  const handleDelete = (): void => {
    if (window.confirm('Are you sure you want to delete this exercise?')) {
      dispatch(deleteExercise(exercise.id));
    }
  };
  
  return (
    <div className="exercise-item card animate-fade-in">
      <div className="exercise-header">
        <h3>{exercise.name}</h3>
        <div className="exercise-actions">
          <button
            onClick={() => onEdit(exercise)}
            className="btn-icon"
            aria-label="Edit exercise"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11 4H4C3.44772 4 3 4.44772 3 5V20C3 20.5523 3.44772 21 4 21H19C19.5523 21 20 20.5523 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button
            onClick={handleDelete}
            className="btn-icon"
            aria-label="Delete exercise"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
      
      <div className="exercise-details">
        <div className="flex justify-between mb-sm">
          <span className="font-medium">Sets:</span>
          <span className="font-bold">{completedCount} / {exercise.sets}</span>
        </div>
        <div className="flex justify-between mb-sm">
          <span className="font-medium">Reps:</span>
          <span>{currentSession ? `${completedReps} / ${exercise.reps}` : `${exercise.reps}`}</span>
        </div>
        <div className="flex justify-between mb-sm">
          <span className="font-medium">Duration Per Rep:</span>
          <span>{formatDuration(exercise.duration)}</span>
        </div>
        {exercise.description && (
          <p className="description mt-md">{exercise.description}</p>
        )}
      </div>
      
      {/* Main progress bar for sets */}
      <div className="progress-bar" role="progressbar" aria-valuenow={progressPercentage} aria-valuemin={0} aria-valuemax={100}>
        <div
          className="progress-fill"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      
      {/* Show rep progress when a session is in progress */}
      {inProgressSessionId && (
        <div className="rep-progress mt-sm">
          <div className="text-sm text-center mb-xs">Rep Progress</div>
          <div className="progress-bar bg-gray-200" role="progressbar" aria-valuenow={repProgressPercentage} aria-valuemin={0} aria-valuemax={100}>
            <div
              className="progress-fill bg-green-500"
              style={{ width: `${repProgressPercentage}%` }}
            />
          </div>
        </div>
      )}
      
      <div className="exercise-controls">
        {inProgressSessionId ? (
          <>
            {/* Timer display and controls */}
            <div className="timer-section mb-md">
              <div className="timer-display flex justify-between items-center mb-sm">
                <div className="timer text-xl font-bold" data-testid="timer-display">{formatDuration(seconds)}</div>
                <button
                  onClick={handleTimerControl}
                  className={`btn ${isRunning ? 'btn-warning' : 'btn-primary'}`}
                >
                  {isRunning ? 'Pause Timer' : seconds > 0 ? 'Resume Timer' : 'Start Rep Timer'}
                </button>
              </div>
            </div>
            
            {/* Rep and set controls */}
            <div className="session-controls">
              <div className="flex justify-between gap-sm">
                {completedReps >= exercise.reps ? (
                  // All reps completed - show next set button
                  <>
                    <div className="flex-1 text-center bg-green-100 dark:bg-green-900 p-2 rounded-md">
                      <span className="text-green-600 dark:text-green-400">Set Complete!</span>
                    </div>
                    <button
                      onClick={handleStart}
                      className="btn btn-primary flex-1"
                    >
                      Start Next Set
                    </button>
                  </>
                ) : (
                  <>
                    <div className="flex-1 bg-blue-100 dark:bg-blue-900 p-2 rounded-md text-center">
                      <span className="text-blue-600 dark:text-blue-400">
                        {isRunning ? 'Rep in progress...' : 'Start timer for next rep'}
                      </span>
                    </div>
                  </>
                )}
                
                <button 
                  onClick={isRunning ? handleTimerControl : handleCancel} 
                  className={`btn ${isRunning ? 'btn-warning' : 'btn-danger'}`}
                >
                  {isRunning ? 'Pause' : 'Cancel'}
                </button>
              </div>
            </div>
          </>
        ) : (
          <button
            onClick={handleStart}
            className="btn btn-primary w-full"
            disabled={completedCount >= exercise.sets}
          >
            {completedCount >= exercise.sets ? 'All Sets Completed' : 
             (currentSession ? 'Resume Exercise' : 'Start Exercise')}
          </button>
        )}
      </div>
    </div>
  );
};