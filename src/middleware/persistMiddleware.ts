import { saveState } from '../utils/storage';
import { RootState } from '../store';

// Create a middleware that persists state to localStorage
export const persistMiddleware = (store: any) => (next: any) => (action: any) => {
  // First, dispatch the action to update the state
  const result = next(action);
  
  // After state is updated, save to localStorage
  const state = store.getState() as RootState;
  
  saveState({
    exercises: state.exercises.items,
    history: state.sessions.history,
    currentDate: state.sessions.currentDate,
  });
  
  return result;
};