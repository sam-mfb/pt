import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import exerciseReducer from '../store/slices/exerciseSlice';
import sessionReducer from '../store/slices/sessionSlice';
import uiReducer from '../store/slices/uiSlice';
import { TimerProvider } from '../components/TimerProvider';
import { App } from '../App';

// Mock localStorage
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: jest.fn(() => null),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  },
});

// Mock Unique IDs
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'test-uuid'),
}));

// Mock for stable dates in tests
const mockDateISOString = '2023-05-15T10:00:00.000Z';

// Setup mock date
const RealDate = global.Date;
class MockDate extends RealDate {
  constructor(...args: any[]) {
    super(...args);
    return new RealDate(mockDateISOString);
  }
  
  toISOString() {
    return mockDateISOString;
  }
  
  toLocaleDateString() {
    return 'Monday, May 15, 2023';
  }
  
  toLocaleTimeString() {
    return '10:00 AM';
  }
}

global.Date = MockDate as DateConstructor;

describe('Integration Tests', () => {
  const createStore = () => {
    return configureStore({
      reducer: {
        exercises: exerciseReducer,
        sessions: sessionReducer,
        ui: uiReducer,
      },
    });
  };

  const renderApp = (store = createStore()) => {
    return render(
      <Provider store={store}>
        <TimerProvider>
          <App />
        </TimerProvider>
      </Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Adding Exercises', () => {
    it('should allow adding a new exercise', async () => {
      renderApp();

      // Initial state should show no exercises message
      expect(screen.getByText(/you haven't added any exercises yet/i)).toBeInTheDocument();

      // Click the Add New Exercise button
      fireEvent.click(screen.getByText('Add New Exercise'));

      // Fill out the form
      fireEvent.change(screen.getByLabelText(/exercise name/i), {
        target: { value: 'Shoulder Stretch' },
      });
      fireEvent.change(screen.getByLabelText(/sets/i), {
        target: { value: '3' },
      });
      fireEvent.change(screen.getByLabelText(/reps/i), {
        target: { value: '12' },
      });
      fireEvent.change(screen.getByLabelText(/duration/i), {
        target: { value: '45' },
      });
      fireEvent.change(screen.getByLabelText(/description/i), {
        target: { value: 'Stretch your shoulders carefully' },
      });

      // Submit the form
      fireEvent.click(screen.getByText('Add Exercise'));

      // Exercise should now be visible
      expect(screen.getByText('Shoulder Stretch')).toBeInTheDocument();
      expect(screen.getByText('0 / 3')).toBeInTheDocument();
    });

  });

  describe('Performing Exercises', () => {
  });

  describe('Editing and Deleting Exercises', () => {
    it('should allow editing an existing exercise', async () => {
      renderApp();

      // Add an exercise
      fireEvent.click(screen.getByText('Add New Exercise'));
      fireEvent.change(screen.getByLabelText(/exercise name/i), {
        target: { value: 'Lunges' },
      });
      fireEvent.click(screen.getByText('Add Exercise'));

      // Click the edit button
      const editButton = screen.getByLabelText('Edit exercise');
      fireEvent.click(editButton);

      // Update the exercise name
      fireEvent.change(screen.getByLabelText(/exercise name/i), {
        target: { value: 'Modified Lunges' },
      });
      
      // Submit the form
      fireEvent.click(screen.getByText('Update Exercise'));

      // Should show updated exercise
      expect(screen.getByText('Modified Lunges')).toBeInTheDocument();
    });

    it('should confirm and delete an exercise', async () => {
      renderApp();

      // Add an exercise
      fireEvent.click(screen.getByText('Add New Exercise'));
      fireEvent.change(screen.getByLabelText(/exercise name/i), {
        target: { value: 'Temporary Exercise' },
      });
      fireEvent.click(screen.getByText('Add Exercise'));

      // Mock window.confirm
      window.confirm = jest.fn(() => true);

      // Click delete button
      const deleteButton = screen.getByLabelText('Delete exercise');
      fireEvent.click(deleteButton);

      // Should prompt for confirmation
      expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this exercise?');

      // Exercise should be removed
      expect(screen.queryByText('Temporary Exercise')).not.toBeInTheDocument();
      expect(screen.getByText(/you haven't added any exercises yet/i)).toBeInTheDocument();
    });
  });

  describe('Viewing History', () => {
    it('should show empty history message when no exercises completed', async () => {
      renderApp();

      // Go to history tab
      fireEvent.click(screen.getByText('History'));

      // Should show empty message
      expect(screen.getByText(/no exercise history found/i)).toBeInTheDocument();
    });

  });
});