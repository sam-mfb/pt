import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import exerciseReducer from '../store/slices/exerciseSlice';
import sessionReducer from '../store/slices/sessionSlice';
import uiReducer from '../store/slices/uiSlice';
import { App } from '../App';
import { getCurrentDate } from '../utils/dateUtils';

describe('LocalStorage Date Bug', () => {
  it('checks app date after simulating localStorage with yesterday date', () => {
    // Create a yesterday date
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayFormatted = yesterday.toISOString().split('T')[0];
    console.log('Yesterday date:', yesterdayFormatted);
    
    // Current date for comparison
    const today = getCurrentDate();
    console.log('Today date:', today);
    
    // 1. First set localStorage with yesterday's date
    localStorage.setItem('pt_tracker_data', JSON.stringify({
      exercises: [],
      history: [],
      currentDate: yesterdayFormatted,
    }));
    
    // 2. Verify localStorage contains the expected value
    const storedData = JSON.parse(localStorage.getItem('pt_tracker_data') || '{}');
    console.log('Data in localStorage after setting:', storedData);
    
    // 3. Create a new store (fresh, to simulate app starting)
    const testStore = configureStore({
      reducer: {
        exercises: exerciseReducer,
        sessions: sessionReducer,
        ui: uiReducer,
      }
    });
    
    // 4. Render the app with this fresh store
    render(
      <Provider store={testStore}>
        <App />
      </Provider>
    );
    
    // 5. Check what date is displayed
    const dateHeading = screen.getByRole('heading', { level: 3 });
    console.log('Date displayed on app startup:', dateHeading.textContent);
    
    // 6. Check if the full date is displayed correctly
    const dateText = screen.getByText(/\w+, \w+ \d+, \d{4}/);
    console.log('Full date displayed:', dateText.textContent);
    
    // 7. Check store state to see what date it's using
    console.log('Date in Redux store:', testStore.getState().sessions.currentDate);
  });
});