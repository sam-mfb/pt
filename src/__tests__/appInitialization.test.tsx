import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { store } from '../store';
import { App } from '../App';
import { getCurrentDate } from '../utils/dateUtils';
import { formatDateFull } from '../utils/dateUtils';

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

// Create a yesterday date
const createYesterdayDate = (): string => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const year = yesterday.getFullYear();
  const month = String(yesterday.getMonth() + 1).padStart(2, '0');
  const day = String(yesterday.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

describe('App Initialization', () => {
  beforeEach(() => {
    localStorageMock.clear();
    jest.clearAllMocks();
  });

  it('should always display today\'s date regardless of what is stored in localStorage', () => {
    // Set up localStorage with yesterday's date
    const yesterdayDate = createYesterdayDate();
    const mockState = {
      exercises: [],
      history: [],
      currentDate: yesterdayDate, // Set to yesterday
    };
    
    localStorageMock.setItem('pt_tracker_data', JSON.stringify(mockState));
    
    // Render the app
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    // The DateNavigator should display "Today" as the date label
    expect(screen.getByRole('heading', { name: 'Today' })).toBeInTheDocument();
    
    // It should also show today's full date (not yesterday's)
    const todayFullDate = formatDateFull(new Date(getCurrentDate()));
    expect(screen.getByText(todayFullDate)).toBeInTheDocument();
    
    // The "Today" button should be disabled (because we're already on today)
    const todayButton = screen.getByRole('button', { name: 'Today' });
    expect(todayButton).toBeDisabled();
  });
});