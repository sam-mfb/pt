import { configureStore } from '@reduxjs/toolkit';
import exerciseReducer from '../slices/exerciseSlice';
import sessionReducer, { resetToToday } from '../slices/sessionSlice';
import uiReducer from '../slices/uiSlice';
import { getCurrentDate } from '../../utils/dateUtils';

describe('Store Initialization', () => {
  it('should set currentDate to today when resetToToday action is dispatched', () => {
    // Mock preloaded state with yesterday's date
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayFormatted = yesterday.toISOString().split('T')[0];
    
    const preloadedState = {
      exercises: { items: [] },
      sessions: {
        history: [],
        currentDate: yesterdayFormatted, // Using yesterday's date
      },
      ui: { activeTab: 'exercises' as const, importDialogOpen: false },
    };
    
    // Create store with preloaded state
    const store = configureStore({
      reducer: {
        exercises: exerciseReducer,
        sessions: sessionReducer,
        ui: uiReducer,
      },
      preloadedState,
    });
    
    // Verify initial state has yesterday's date
    let state = store.getState();
    expect(state.sessions.currentDate).toBe(yesterdayFormatted);
    
    // Dispatch resetToToday action (this simulates what the App component does on load)
    store.dispatch(resetToToday());
    
    // Get the updated state
    state = store.getState();
    
    // Verify that currentDate is now today's date
    expect(state.sessions.currentDate).toBe(getCurrentDate());
    expect(state.sessions.currentDate).not.toBe(yesterdayFormatted);
  });
});