import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { Exercise } from '../../types';

// Initial state
interface ExerciseState {
  items: Exercise[];
}

const initialState: ExerciseState = {
  items: [],
};

// Create the exercise slice
export const exerciseSlice = createSlice({
  name: 'exercises',
  initialState,
  reducers: {
    // Add a new exercise
    addExercise: {
      reducer: (state, action: PayloadAction<Exercise>) => {
        state.items.push(action.payload);
      },
      // Prepare callback to generate the ID
      prepare: (exercise: Omit<Exercise, 'id'>) => {
        const id = uuidv4();
        return { payload: { id, ...exercise } };
      },
    },
    
    // Update an existing exercise
    updateExercise: (state, action: PayloadAction<Exercise>) => {
      const index = state.items.findIndex((exercise) => exercise.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    
    // Delete an exercise
    deleteExercise: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((exercise) => exercise.id !== action.payload);
    },
    
    // Import exercises from backup
    importExercises: (state, action: PayloadAction<Exercise[]>) => {
      state.items = action.payload;
    },
  },
});

// Export actions
export const { addExercise, updateExercise, deleteExercise, importExercises } = exerciseSlice.actions;

// Export the reducer
export default exerciseSlice.reducer;