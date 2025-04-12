import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import exerciseReducer from '../../store/slices/exerciseSlice';
import sessionReducer from '../../store/slices/sessionSlice';
import { History } from '../History';
import { Exercise, DailyRecord, ExerciseSession } from '../../types';

// Mock formatDate
jest.mock('../../utils/dateUtils', () => ({
  formatDateFull: jest.fn((date) => `Formatted: ${typeof date === 'string' ? date : date.toISOString().split('T')[0]}`),
  formatTime: jest.fn(() => '10:00 AM'),
  formatDuration: jest.fn((seconds) => `${seconds} seconds`),
  getCurrentDate: jest.fn(() => '2023-05-16'),
  getRelativeDay: jest.fn(() => 'Today'),
}));

// Mock useAppSelector
jest.mock('../../hooks/useAppSelector', () => ({
  useAppSelector: (selector: any) => {
    // Return mock data based on the specific selector function
    if (selector.toString().includes('exercises.items')) {
      return mockExercises;
    } else if (selector.toString().includes('sessions.history')) {
      return mockHistory;
    }
    return null;
  },
}));

// Mock data
let mockExercises: Exercise[] = [];
let mockHistory: DailyRecord[] = [];

describe('History Component', () => {
  const renderHistory = () => {
    const store = configureStore({
      reducer: {
        exercises: exerciseReducer,
        sessions: sessionReducer,
      },
    });
    
    return render(
      <Provider store={store}>
        <History />
      </Provider>
    );
  };
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Initialize mock data
    mockExercises = [
      { id: 'exercise-1', name: 'Squats', sets: 3, reps: 10, duration: 45 },
      { id: 'exercise-2', name: 'Lunges', sets: 3, reps: 12, duration: 60 },
    ];
    
    mockHistory = [];
  });
  
  it('should show empty state message when no history exists', () => {
    renderHistory();
    
    expect(screen.getByText(/no exercise history found/i)).toBeInTheDocument();
    expect(screen.getByText(/start your first exercise session to track your progress/i)).toBeInTheDocument();
  });
  
  it('should display history for a single day', () => {
    // Set up mock data for a single day
    mockHistory = [
      {
        date: '2023-05-15',
        sessions: [
          {
            id: 'session-1',
            exerciseId: 'exercise-1',
            startTime: '2023-05-15T10:00:00.000Z',
            endTime: '2023-05-15T10:01:30.000Z',
            completed: true,
            completedReps: 10,
          },
          {
            id: 'session-2',
            exerciseId: 'exercise-2',
            startTime: '2023-05-15T11:00:00.000Z',
            endTime: '2023-05-15T11:02:00.000Z',
            completed: true,
            completedReps: 12,
            notes: 'Felt great!',
          },
        ],
      },
    ];
    
    renderHistory();
    
    // Should show date heading in the day details
    const dateHeading = screen.getByTestId('selected-date-heading');
    expect(dateHeading).toBeInTheDocument();
    expect(dateHeading).toHaveTextContent('Formatted: 2023-05-15');
    
    
    // Should show stats
    expect(screen.getByText('Completed Sessions')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();  // 2 completed sessions
    
    // Should show session table
    const table = screen.getByRole('table');
    expect(within(table).getByText('Squats')).toBeInTheDocument();
    expect(within(table).getByText('Lunges')).toBeInTheDocument();
    
    // Should show "Completed" status
    const completedTags = screen.getAllByText('Completed');
    expect(completedTags.length).toBe(2);
  });
  
  it('should allow switching between different days', () => {
    // Set up mock data for multiple days
    mockHistory = [
      {
        date: '2023-05-15',
        sessions: [
          {
            id: 'session-1',
            exerciseId: 'exercise-1', // This will correspond to 'Squats'
            startTime: '2023-05-15T10:00:00.000Z',
            endTime: '2023-05-15T10:01:30.000Z',
            completed: true,
            completedReps: 10,
          },
        ],
      },
      {
        date: '2023-05-16',
        sessions: [
          {
            id: 'session-2',
            exerciseId: 'exercise-2', // This will correspond to 'Lunges'
            startTime: '2023-05-16T11:00:00.000Z',
            endTime: '2023-05-16T11:02:00.000Z',
            completed: true,
            completedReps: 12,
          },
        ],
      },
    ];
    
    renderHistory();
    
    // Initially should show the most recent date (May 16)
    expect(screen.getByTestId('selected-date-heading')).toHaveTextContent('Formatted: 2023-05-16');
    
    // Table should show Lunges
    let table = screen.getByRole('table');
    expect(within(table).getByText('Lunges')).toBeInTheDocument();
    expect(within(table).queryByText('Squats')).not.toBeInTheDocument();
    
    // Find the button for May 15 by content and click it
    // First find all date selector buttons
    const dateButtons = screen.getAllByRole('button');
    // Then find the one for May 15
    const may15Button = dateButtons.find((button: any) => button.textContent === 'Formatted: 2023-05-15');
    fireEvent.click(may15Button);
    
    // Now should show May 15 content
    expect(screen.getByTestId('selected-date-heading')).toHaveTextContent('Formatted: 2023-05-15');
    
    // Table should show Squats
    table = screen.getByRole('table');
    expect(within(table).getByText('Squats')).toBeInTheDocument();
    expect(within(table).queryByText('Lunges')).not.toBeInTheDocument();
  });
  
  it('should handle unknown exercises gracefully', () => {
    // Set up mock data with an unknown exercise ID
    mockHistory = [
      {
        date: '2023-05-15',
        sessions: [
          {
            id: 'session-1',
            exerciseId: 'unknown-id', // This ID doesn't exist in mockExercises
            startTime: '2023-05-15T10:00:00.000Z',
            endTime: '2023-05-15T10:01:30.000Z',
            completed: true,
            completedReps: 10,
          },
        ],
      },
    ];
    
    renderHistory();
    
    // Should display placeholder for unknown exercise
    const table = screen.getByRole('table');
    expect(within(table).getByText('Unknown Exercise')).toBeInTheDocument();
  });
  
  it('should handle in-progress sessions correctly', () => {
    // Set up mock data with an in-progress session
    mockHistory = [
      {
        date: '2023-05-15',
        sessions: [
          {
            id: 'session-1',
            exerciseId: 'exercise-1',
            startTime: '2023-05-15T10:00:00.000Z',
            endTime: '',
            completed: false,
            completedReps: 0,
          },
        ],
      },
    ];
    
    renderHistory();
    
    // Should show "In Progress" status
    const table = screen.getByRole('table');
    expect(within(table).getByText('In Progress')).toBeInTheDocument();
    
    // Duration should be displayed as "-" since it's not completed
    expect(within(table).getByText('-')).toBeInTheDocument();
  });
  
  it('should calculate total time correctly for a day', () => {
    // Set up mock data with multiple completed sessions
    mockHistory = [
      {
        date: '2023-05-15',
        sessions: [
          {
            id: 'session-1',
            exerciseId: 'exercise-1',
            startTime: '2023-05-15T10:00:00.000Z',
            endTime: '2023-05-15T10:01:30.000Z', // 90 seconds
            completed: true,
            completedReps: 10,
          },
          {
            id: 'session-2',
            exerciseId: 'exercise-2',
            startTime: '2023-05-15T11:00:00.000Z',
            endTime: '2023-05-15T11:00:30.000Z', // 30 seconds
            completed: true,
            completedReps: 12,
          },
        ],
      },
    ];
    
    renderHistory();
    
    // Total time should be 120 seconds (90 + 30)
    expect(screen.getByText('120 seconds')).toBeInTheDocument();
  });
});