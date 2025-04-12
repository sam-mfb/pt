import { addExercise, updateExercise, deleteExercise, importExercises } from '../exerciseSlice';
import { configureStore } from '@reduxjs/toolkit';
import exerciseReducer from '../exerciseSlice';
import { Exercise } from '../../../types';

describe('Exercise Slice', () => {
  let store: ReturnType<typeof configureStore>;
  let mockExercise: Omit<Exercise, 'id'>;
  
  beforeEach(() => {
    store = configureStore({
      reducer: {
        exercises: exerciseReducer,
      },
    });
    
    mockExercise = {
      name: 'Shoulder Press',
      sets: 3,
      reps: 12,
      duration: 45,
      description: 'Lift weights above your head',
    };
  });
  
  describe('addExercise', () => {
    it('should add a new exercise to the state', () => {
      store.dispatch(addExercise(mockExercise));
      
      const state = store.getState().exercises as { items: Exercise[] };
      expect(state.items.length).toBe(1);
      expect(state.items[0].name).toBe('Shoulder Press');
      expect(state.items[0].sets).toBe(3);
      expect(state.items[0].reps).toBe(12);
      expect(state.items[0].duration).toBe(45);
      expect(state.items[0].description).toBe('Lift weights above your head');
      expect(state.items[0].id).toBeDefined();
    });
  });
  
  describe('updateExercise', () => {
    it('should update an existing exercise', () => {
      // First add an exercise
      store.dispatch(addExercise(mockExercise));
      const addedExercise = (store.getState().exercises as { items: Exercise[] }).items[0];
      
      // Update the exercise
      const updatedExercise: Exercise = {
        ...addedExercise,
        name: 'Modified Shoulder Press',
        sets: 4,
      };
      
      store.dispatch(updateExercise(updatedExercise));
      
      // Check if exercise was updated
      const state = store.getState().exercises as { items: Exercise[] };
      expect(state.items.length).toBe(1);
      expect(state.items[0].name).toBe('Modified Shoulder Press');
      expect(state.items[0].sets).toBe(4);
      expect(state.items[0].id).toBe(addedExercise.id);
    });
    
    it('should not update if exercise id does not exist', () => {
      // Add an exercise
      store.dispatch(addExercise(mockExercise));
      
      // Try to update non-existent exercise
      const nonExistentExercise: Exercise = {
        id: 'non-existent-id',
        name: 'Some Exercise',
        sets: 3,
        reps: 10,
        duration: 30,
      };
      
      store.dispatch(updateExercise(nonExistentExercise));
      
      // State should be unchanged
      const state = store.getState().exercises as { items: Exercise[] };
      expect(state.items.length).toBe(1);
      expect(state.items[0].name).toBe('Shoulder Press');
    });
  });
  
  describe('deleteExercise', () => {
    it('should delete an exercise by id', () => {
      // Add some exercises
      store.dispatch(addExercise(mockExercise));
      store.dispatch(addExercise({
        name: 'Squat',
        sets: 4,
        reps: 8,
        duration: 60,
      }));
      
      const initialState = store.getState().exercises;
      expect(initialState.items.length).toBe(2);
      
      // Delete the first exercise
      store.dispatch(deleteExercise(initialState.items[0].id));
      
      // Verify it was deleted
      const stateAfterDelete = store.getState().exercises;
      expect(stateAfterDelete.items.length).toBe(1);
      expect(stateAfterDelete.items[0].name).toBe('Squat');
    });
    
    it('should do nothing if exercise id does not exist', () => {
      // Add an exercise
      store.dispatch(addExercise(mockExercise));
      
      // Try to delete non-existent exercise
      store.dispatch(deleteExercise('non-existent-id'));
      
      // State should be unchanged
      const state = store.getState().exercises as { items: Exercise[] };
      expect(state.items.length).toBe(1);
    });
  });
  
  describe('importExercises', () => {
    it('should replace all exercises with the imported ones', () => {
      // Add an initial exercise
      store.dispatch(addExercise(mockExercise));
      
      // Import new exercises
      const importedExercises: Exercise[] = [
        {
          id: 'imported-1',
          name: 'Lunges',
          sets: 3,
          reps: 10,
          duration: 30,
        },
        {
          id: 'imported-2',
          name: 'Push-ups',
          sets: 3,
          reps: 15,
          duration: 45,
        },
      ];
      
      store.dispatch(importExercises(importedExercises));
      
      // Verify the state was replaced
      const state = store.getState().exercises as { items: Exercise[] };
      expect(state.items.length).toBe(2);
      expect(state.items[0].id).toBe('imported-1');
      expect(state.items[0].name).toBe('Lunges');
      expect(state.items[1].id).toBe('imported-2');
      expect(state.items[1].name).toBe('Push-ups');
    });
    
    it('should handle empty array import', () => {
      // Add some initial exercises
      store.dispatch(addExercise(mockExercise));
      
      // Import empty array
      store.dispatch(importExercises([]));
      
      // Verify all exercises were removed
      const state = store.getState().exercises as { items: Exercise[] };
      expect(state.items.length).toBe(0);
    });
  });
});