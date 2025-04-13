import { useState } from 'react';
import { Exercise } from '../types';
import { useAppSelector } from '../hooks/useAppSelector';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { addExercise } from '../store/slices/exerciseSlice';

interface ExerciseLibraryProps {
  onClose: () => void;
}

export const ExerciseLibrary = ({ onClose }: ExerciseLibraryProps) => {
  const dispatch = useAppDispatch();
  const exercises = useAppSelector((state) => state.exercises.items);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter exercises based on search term
  const filteredExercises = exercises.filter((exercise) => 
    exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (exercise.description && exercise.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  // Reuse an exercise by creating a new instance with the same properties
  const handleReuseExercise = (exercise: Exercise) => {
    dispatch(addExercise({
      name: exercise.name,
      sets: exercise.sets,
      reps: exercise.reps,
      duration: exercise.duration,
      description: exercise.description,
    }));
    
    onClose();
  };
  
  return (
    <div className="exercise-library">
      <div className="exercise-library-header">
        <h2 className="text-xl font-semibold mb-lg">Exercise Library</h2>
        <p className="mb-md">Select a previously created exercise to reuse:</p>
        
        <div className="search-container mb-lg">
          <input
            type="text"
            placeholder="Search exercises..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>
      
      {filteredExercises.length === 0 ? (
        <div className="empty-state">
          <p className="mb-md">No exercises found. Try a different search term or create a new exercise.</p>
        </div>
      ) : (
        <div className="exercise-library-grid">
          {filteredExercises.map((exercise) => (
            <div key={exercise.id} className="exercise-library-item card">
              <div className="exercise-library-item-header">
                <h3>{exercise.name}</h3>
              </div>
              
              <div className="exercise-library-item-details">
                <div className="flex justify-between mb-sm">
                  <span className="font-medium">Sets:</span>
                  <span>{exercise.sets}</span>
                </div>
                <div className="flex justify-between mb-sm">
                  <span className="font-medium">Reps:</span>
                  <span>{exercise.reps}</span>
                </div>
                <div className="flex justify-between mb-sm">
                  <span className="font-medium">Duration:</span>
                  <span>{exercise.duration}s</span>
                </div>
                {exercise.description && (
                  <p className="description mt-md text-sm">{exercise.description}</p>
                )}
              </div>
              
              <button 
                onClick={() => handleReuseExercise(exercise)}
                className="btn btn-primary w-full mt-md"
              >
                Use This Exercise
              </button>
            </div>
          ))}
        </div>
      )}
      
      <div className="form-actions mt-lg">
        <button type="button" onClick={onClose} className="btn btn-secondary">
          Cancel
        </button>
      </div>
    </div>
  );
};