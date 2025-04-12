import { configureStore } from '@reduxjs/toolkit';
import exerciseReducer from './slices/exerciseSlice';
import sessionReducer from './slices/sessionSlice';
import uiReducer from './slices/uiSlice';
import { loadState } from '../utils/storage';
import { persistMiddleware } from '../middleware/persistMiddleware';

// Load state from localStorage
const preloadedState = loadState();

// Transform preloaded state to match the store structure
const transformedPreloadedState = preloadedState
  ? {
      exercises: { items: preloadedState.exercises },
      sessions: {
        history: preloadedState.history,
        currentDate: preloadedState.currentDate,
      },
      ui: { activeTab: 'exercises', importDialogOpen: false },
    }
  : undefined;

// Configure the Redux store
export const store = configureStore({
  reducer: {
    exercises: exerciseReducer,
    sessions: sessionReducer,
    ui: uiReducer,
  },
  preloadedState: transformedPreloadedState,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['ui/setImportDialogOpen'],
      },
    }).concat(persistMiddleware),
});

// Export types for state and dispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;