import { useState } from 'react';
import { Exercise } from '../types';
import { useAppSelector } from '../hooks/useAppSelector';
import { ExerciseForm } from './ExerciseForm';
import { ExerciseItem } from './ExerciseItem';

export const ExerciseList = (): JSX.Element => {
  const exercises = useAppSelector((state) => state.exercises.items);
  const currentDate = useAppSelector((state) => state.sessions.currentDate);
  const history = useAppSelector((state) => state.sessions.history);
  
  const [showForm, setShowForm] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | undefined>(undefined);
  
  // Get today's record
  const todayRecord = history.find((record) => record.date === currentDate);
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
        <h2>Your Exercises</h2>
        <button onClick={handleAddNew} className="btn-primary">
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
          <p>You haven't added any exercises yet. Get started by adding your first exercise!</p>
        </div>
      ) : (
        <div className="exercise-grid">
          {exercises.map((exercise) => {
            // Check how many times this exercise has been completed today
            const completedSessions = todaySessions.filter(
              (session) => session.exerciseId === exercise.id && session.completed
            );
            
            // Is this exercise currently in progress?
            const inProgressSession = todaySessions.find(
              (session) => session.exerciseId === exercise.id && !session.completed
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