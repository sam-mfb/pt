import { useState } from 'react';
import { Exercise } from '../types';
import { useAppSelector } from '../hooks/useAppSelector';
import { ExerciseForm } from './ExerciseForm';
import { ExerciseItem } from './ExerciseItem';

export const ExerciseList = () => {
  const exercises = useAppSelector((state) => state.exercises.items);
  const currentDate = useAppSelector((state) => state.sessions.currentDate);
  const history = useAppSelector((state) => state.sessions.history);
  
  const [showForm, setShowForm] = useState(false);
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
  
  // Add new exercise
  const handleAddNew = (): void => {
    setEditingExercise(undefined);
    setShowForm(true);
  };
  
  return (
    <div className="exercise-list">
      <div className="exercise-list-header">
        <h2 className="text-xl font-semibold">Your Exercises</h2>
        <button onClick={handleAddNew} className="btn btn-primary">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-xs">
            <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Add New Exercise
        </button>
      </div>
      
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <ExerciseForm exercise={editingExercise} onClose={handleCloseForm} />
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