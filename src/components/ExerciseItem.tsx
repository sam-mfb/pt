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
    <div className="exercise-item card">
      <div className="exercise-header">
        <h3>{exercise.name}</h3>
        <div className="exercise-actions">
          <button
            onClick={() => onEdit(exercise)}
            className="btn-icon"
            aria-label="Edit exercise"
          >
            ✏️
          </button>
          <button
            onClick={handleDelete}
            className="btn-icon"
            aria-label="Delete exercise"
          >
            🗑️
          </button>
        </div>
      </div>
      
      <div className="exercise-details">
        <p>
          <strong>Sets:</strong> {completedCount} / {exercise.sets}
        </p>
        <p>
          <strong>Reps:</strong> {exercise.reps}
        </p>
        <p>
          <strong>Duration:</strong> {formatDuration(exercise.duration)}
        </p>
        {exercise.description && <p className="description">{exercise.description}</p>}
      </div>
      
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${progressPercentage}%` }}
          aria-valuenow={progressPercentage}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      
      <div className="exercise-controls">
        {inProgressSessionId ? (
          <>
            <div className="timer">{formatDuration(seconds)}</div>
            <div className="control-buttons">
              <button
                onClick={handleComplete}
                className="btn-success"
                disabled={!isRunning && seconds === 0}
              >
                Complete
              </button>
              <button onClick={handleCancel} className="btn-danger">
                Cancel
              </button>
            </div>
          </>
        ) : (
          <button
            onClick={handleStart}
            className="btn-primary"
            disabled={completedCount >= exercise.sets}
          >
            {completedCount >= exercise.sets ? 'All Sets Completed' : 'Start Exercise'}
          </button>
        )}
      </div>
    </div>
  );
};