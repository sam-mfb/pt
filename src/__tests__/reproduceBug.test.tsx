import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import exerciseReducer from '../store/slices/exerciseSlice';
import sessionReducer from '../store/slices/sessionSlice';
import uiReducer from '../store/slices/uiSlice';
import { App } from '../App';
import { formatDateFull } from '../utils/dateUtils';

// Mock the store instead of using the real one
jest.mock('../store', () => {
  // Actual implementation will be defined in the test
  const mockStore = { getState: jest.fn(), dispatch: jest.fn(), subscribe: jest.fn() };
  return { store: mockStore };
});

// Create a yesterday date
const createYesterdayDate = (): string => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const year = yesterday.getFullYear();
  const month = String(yesterday.getMonth() + 1).padStart(2, '0');
  const day = String(yesterday.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('Bug Reproduction - App shows yesterday\'s date', () => {
  beforeEach(() => {
    localStorageMock.clear();
    jest.clearAllMocks();
  });

  it('should always reset to today\'s date on app startup, ignoring stored date', () => {
    // Note: This test confirms the CORRECT behavior - the app should always start with today's date
    // regardless of what was stored in localStorage
    
    // Set up localStorage with yesterday's date
    const yesterdayDate = createYesterdayDate();
    const todayFullDate = formatDateFull(new Date()); // Current date is what should be shown
    
    const mockState = {
      exercises: [],
      history: [],
      currentDate: yesterdayDate, // Set to yesterday in localStorage
    };
    
    // Mock localStorage to return yesterday's date
    localStorageMock.setItem('pt_tracker_data', JSON.stringify(mockState));
    
    // Create a store with preset state
    const testStore = configureStore({
      reducer: {
        exercises: exerciseReducer,
        sessions: sessionReducer,
        ui: uiReducer,
      },
      preloadedState: {
        exercises: { items: [] },
        sessions: {
          history: [],
          currentDate: yesterdayDate, // Ensure we have yesterday's date in the initial store
        },
        ui: { activeTab: 'exercises' as const, importDialogOpen: false },
      }
    });
    
    // Replace the mocked store with our test store
    const mockedStore = require('../store').store;
    Object.defineProperty(mockedStore, 'getState', {
      value: testStore.getState
    });
    Object.defineProperty(mockedStore, 'dispatch', {
      value: testStore.dispatch
    });
    Object.defineProperty(mockedStore, 'subscribe', {
      value: testStore.subscribe
    });
    
    // Render the app with the test store
    render(
      <Provider store={testStore}>
        <App />
      </Provider>
    );

    // Log what's displayed on screen for debugging
    console.log('Current date in store:', testStore.getState().sessions.currentDate);
    console.log('Current heading displayed:', screen.getByRole('heading', { level: 3 }).textContent);
    
    // The app should always reset to "Today" on startup (by design)
    const dateHeading = screen.getByRole('heading', { level: 3 });
    expect(dateHeading.textContent).toBe('Today');
    
    // Check if the displayed full date matches today's date
    expect(screen.getByText(todayFullDate)).toBeInTheDocument();
    
    // The Today button should be disabled (since we're on today)
    const todayButton = screen.getByRole('button', { name: 'Today' });
    // Note: We expect the button to be disabled when we're on Today
    expect(todayButton).toBeDisabled();
  });
});