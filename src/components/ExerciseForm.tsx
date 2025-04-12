import { useState, useEffect } from 'react';
import { Exercise } from '../types';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { addExercise, updateExercise } from '../store/slices/exerciseSlice';

interface ExerciseFormProps {
  exercise?: Exercise;
  onClose: () => void;
}

export const ExerciseForm = ({ exercise, onClose }: ExerciseFormProps) => {
  const dispatch = useAppDispatch();
  const [name, setName] = useState('');
  const [sets, setSets] = useState(3);
  const [reps, setReps] = useState(10);
  const [duration, setDuration] = useState(30);
  const [description, setDescription] = useState('');
  const [formError, setFormError] = useState('');
  
  // If editing an existing exercise, populate form fields
  useEffect(() => {
    if (exercise) {
      setName(exercise.name);
      setSets(exercise.sets);
      setReps(exercise.reps);
      setDuration(exercise.duration);
      setDescription(exercise.description || '');
    }
  }, [exercise]);
  
  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    
    // Form validation
    if (name.trim() === '') {
      setFormError('Exercise name is required');
      return;
    }
    
    if (sets < 1) {
      setFormError('Sets must be at least 1');
      return;
    }
    
    if (reps < 1) {
      setFormError('Reps must be at least 1');
      return;
    }
    
    if (duration < 1) {
      setFormError('Duration must be at least 1 second');
      return;
    }
    
    // Clear any previous errors
    setFormError('');
    
    // If editing existing exercise
    if (exercise) {
      dispatch(updateExercise({
        ...exercise,
        name,
        sets,
        reps,
        duration,
        description: description || undefined,
      }));
    } else {
      // Adding new exercise
      dispatch(addExercise({
        name,
        sets,
        reps,
        duration,
        description: description || undefined,
      }));
    }
    
    // Close the form
    onClose();
  };
  
  return (
    <form onSubmit={handleSubmit} className="exercise-form card">
      <h2 className="text-xl font-semibold mb-lg">{exercise ? 'Edit Exercise' : 'Add New Exercise'}</h2>
      
      {formError && <div className="error-message mb-lg" role="alert" data-testid="form-error">{formError}</div>}
      
      <div className="form-group">
        <label htmlFor="name">
          Exercise Name
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Shoulder Stretch"
            className="mt-sm"
            required
          />
        </label>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
        <div className="form-group">
          <label htmlFor="sets">
            Sets
            <input
              id="sets"
              type="number"
              min="1"
              value={sets}
              onChange={(e) => setSets(parseInt(e.target.value, 10))}
              className="mt-sm"
              required
            />
          </label>
        </div>
        
        <div className="form-group">
          <label htmlFor="reps">
            Reps
            <input
              id="reps"
              type="number"
              min="1"
              value={reps}
              onChange={(e) => setReps(parseInt(e.target.value, 10))}
              className="mt-sm"
              required
            />
          </label>
        </div>
        
        <div className="form-group">
          <label htmlFor="duration">
            Duration (seconds)
            <input
              id="duration"
              type="number"
              min="1"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value, 10))}
              className="mt-sm"
              required
            />
          </label>
        </div>
      </div>
      
      <div className="form-group">
        <label htmlFor="description">
          Description (optional)
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add exercise instructions or notes..."
            className="mt-sm"
            rows={3}
          />
        </label>
      </div>
      
      <div className="form-actions">
        <button type="button" onClick={onClose} className="btn btn-secondary">
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          {exercise ? 'Update' : 'Add'} Exercise
        </button>
      </div>
    </form>
  );
};