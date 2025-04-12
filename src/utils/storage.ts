import { AppState } from '../types';

const STORAGE_KEY = 'pt_tracker_data';

/**
 * Loads the application state from localStorage
 */
export const loadState = (): AppState | undefined => {
  try {
    const serializedState = localStorage.getItem(STORAGE_KEY);
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState) as AppState;
  } catch (err) {
    console.error('Failed to load state from localStorage:', err);
    return undefined;
  }
};

/**
 * Saves the application state to localStorage
 */
export const saveState = (state: AppState): void => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serializedState);
  } catch (err) {
    console.error('Failed to save state to localStorage:', err);
  }
};

/**
 * Exports the current state as a JSON file for download
 */
export const exportState = (state: AppState): void => {
  try {
    const serializedState = JSON.stringify(state, null, 2);
    const blob = new Blob([serializedState], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    const date = new Date().toISOString().split('T')[0];
    link.download = `pt_tracker_backup_${date}.json`;
    link.href = url;
    link.click();
    
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error('Failed to export state:', err);
  }
};

/**
 * Imports state from a JSON file
 */
export const importState = (jsonString: string): AppState | null => {
  try {
    const parsedState = JSON.parse(jsonString) as AppState;
    
    // Validate if required properties exist
    if (
      !Array.isArray(parsedState.exercises) ||
      !Array.isArray(parsedState.history) ||
      typeof parsedState.currentDate !== 'string'
    ) {
      throw new Error('Invalid state format');
    }
    
    return parsedState;
  } catch (err) {
    console.error('Failed to import state:', err);
    return null;
  }
};