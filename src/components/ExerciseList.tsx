import { useState } from 'react';
import { Exercise } from '../types';
import { useAppSelector } from '../hooks/useAppSelector';
import { ExerciseForm } from './ExerciseForm';
import { ExerciseItem } from './ExerciseItem';
import { ExerciseLibrary } from './ExerciseLibrary';

export const ExerciseList = () => {
  const exercises = useAppSelector((state) => state.exercises.items);
  const currentDate = useAppSelector((state) => state.sessions.currentDate);
  const history = useAppSelector((state) => state.sessions.history);
  
  const [showForm, setShowForm] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | undefined>(undefined);
  
  // Get today's record
  const todayRecord = history.find((record: any) => record.date === currentDate);
  const todaySessions = todayRecord ? todayRecord.sessions : [];
  
  // Handle edit exercise
  const handleEdit = (exercise: Exercise): void => {
    setEditingExercise(exercise);
    setShowForm(true);
  };
  
  // Close form and reset state
  const handleCloseForm = (): void => {
    setShowForm(false);
    setEditingExercise(undefined);
  };
  
  // Close library
  const handleCloseLibrary = (): void => {
    setShowLibrary(false);
  };
  
  // Add new exercise
  const handleAddNew = (): void => {
    setEditingExercise(undefined);
    setShowForm(true);
  };
  
  // Open exercise library
  const handleOpenLibrary = (): void => {
    setShowLibrary(true);
  };
  
  return (
    <div className="exercise-list">
      <div className="exercise-list-header">
        <h2 className="text-xl font-semibold">Your Exercises</h2>
        <div className="flex gap-sm">
          <button onClick={handleOpenLibrary} className="btn btn-secondary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-xs">
              <path d="M4 19.5C4 18.837 4.26339 18.2011 4.73223 17.7322C5.20107 17.2634 5.83696 17 6.5 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6.5 2H20V22H6.5C5.83696 22 5.20107 21.7366 4.73223 21.2678C4.26339 20.7989 4 20.163 4 19.5V4.5C4 3.83696 4.26339 3.20107 4.73223 2.73223C5.20107 2.26339 5.83696 2 6.5 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Exercise Library
          </button>
          <button onClick={handleAddNew} className="btn btn-primary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-xs">
              <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Add New Exercise
          </button>
        </div>
      </div>
      
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <ExerciseForm exercise={editingExercise} onClose={handleCloseForm} />
          </div>
        </div>
      )}
      
      {showLibrary && (
        <div className="modal-overlay">
          <div className="modal-content">
            <ExerciseLibrary onClose={handleCloseLibrary} />
          </div>
        </div>
      )}
      
      {exercises.length === 0 ? (
        <div className="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-lg opacity-50">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 8V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 16H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <p className="mb-md">You haven't added any exercises yet.</p>
          <button onClick={handleAddNew} className="btn btn-primary">
            Get Started
          </button>
        </div>
      ) : (
        <div className="exercise-grid">
          {exercises.map((exercise: any) => {
            // Check how many times this exercise has been completed today
            const completedSessions = todaySessions.filter(
              (session: any) => session.exerciseId === exercise.id && session.completed
            );
            
            // Is this exercise currently in progress?
            const inProgressSession = todaySessions.find(
              (session: any) => session.exerciseId === exercise.id && !session.completed
            );
            
            return (
              <ExerciseItem
                key={exercise.id}
                exercise={exercise}
                completedCount={completedSessions.length}
                inProgressSessionId={inProgressSession?.id}
                onEdit={handleEdit}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};