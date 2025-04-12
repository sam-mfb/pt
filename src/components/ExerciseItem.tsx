import { Exercise } from '../types';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useTimer } from './TimerProvider';
import { formatDuration } from '../utils/dateUtils';
import { deleteExercise } from '../store/slices/exerciseSlice';
import { startSession, completeSession, cancelSession } from '../store/slices/sessionSlice';

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
}: ExerciseItemProps): JSX.Element => {
  const dispatch = useAppDispatch();
  const { startTimer, stopTimer, isRunning, seconds } = useTimer();
  
  // Calculate progress percentage
  const progressPercentage = (completedCount / exercise.sets) * 100;
  
  // Start a new session for this exercise
  const handleStart = (): void => {
    if (inProgressSessionId) {
      return; // Already in progress
    }
    
    dispatch(startSession(exercise.id));
    startTimer(exercise.duration);
  };
  
  // Complete the current session
  const handleComplete = (): void => {
    if (!inProgressSessionId) {
      return; // No session in progress
    }
    
    dispatch(completeSession({ sessionId: inProgressSessionId }));
    stopTimer();
  };
  
  // Cancel the current session
  const handleCancel = (): void => {
    if (!inProgressSessionId) {
      return; // No session in progress
    }
    
    dispatch(cancelSession({ sessionId: inProgressSessionId }));
    stopTimer();
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
          <span>{exercise.reps}</span>
        </div>
        <div className="flex justify-between mb-sm">
          <span className="font-medium">Duration:</span>
          <span>{formatDuration(exercise.duration)}</span>
        </div>
        {exercise.description && (
          <p className="description mt-md">{exercise.description}</p>
        )}
      </div>
      
      <div className="progress-bar" role="progressbar" aria-valuenow={progressPercentage} aria-valuemin={0} aria-valuemax={100}>
        <div
          className="progress-fill"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      
      <div className="exercise-controls">
        {inProgressSessionId ? (
          <>
            <div className="timer">{formatDuration(seconds)}</div>
            <div className="control-buttons">
              <button
                onClick={handleComplete}
                className="btn btn-success"
                disabled={!isRunning && seconds === 0}
              >
                Complete
              </button>
              <button onClick={handleCancel} className="btn btn-danger">
                Cancel
              </button>
            </div>
          </>
        ) : (
          <button
            onClick={handleStart}
            className="btn btn-primary w-full"
            disabled={completedCount >= exercise.sets}
          >
            {completedCount >= exercise.sets ? 'All Sets Completed' : 'Start Exercise'}
          </button>
        )}
      </div>
    </div>
  );
};