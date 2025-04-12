import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import exerciseReducer from '../../store/slices/exerciseSlice';
import sessionReducer from '../../store/slices/sessionSlice';
import { ExerciseItem } from '../ExerciseItem';
import { Exercise } from '../../types';
import { TimerProvider } from '../TimerProvider';
// Mock TimerProvider
const mockStartTimer = jest.fn();
const mockResetTimer = jest.fn();

let mockTimerState = {
  isRunning: false,
  seconds: 30,
  pauseTimer: jest.fn(),
  resumeTimer: jest.fn(),
};

jest.mock('../TimerProvider', () => ({
  TimerProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useTimer: () => ({
    isRunning: mockTimerState.isRunning,
    seconds: mockTimerState.seconds,
    startTimer: mockStartTimer,
    pauseTimer: mockTimerState.pauseTimer,
    resumeTimer: mockTimerState.resumeTimer,
    resetTimer: mockResetTimer,
  }),
}));

// Mock dispatch
const mockDispatch = jest.fn();
jest.mock('../../hooks/useAppDispatch', () => ({
  useAppDispatch: () => mockDispatch,
}));

// Mock selector
const mockAppSelector = jest.fn();
jest.mock('../../hooks/useAppSelector', () => ({
  useAppSelector: (selector: (state: any) => any) => mockAppSelector(selector),
}));

// Mock window.confirm
window.confirm = jest.fn();

describe('ExerciseItem Component', () => {
  // Setup fake timers
  beforeEach(() => {
    jest.useFakeTimers();
  });
  
  afterEach(() => {
    jest.useRealTimers();
  });
  const mockExercise: Exercise = {
    id: 'test-id',
    name: 'Test Exercise',
    sets: 3,
    reps: 10,
    duration: 45,
    description: 'Test description',
  };
  
  const renderExerciseItem = ({
    exercise = mockExercise,
    completedCount = 0,
    inProgressSessionId = undefined,
  } = {}) => {
    const store = configureStore({
      reducer: {
        exercises: exerciseReducer,
        sessions: sessionReducer,
      },
    });
    
    const onEdit = jest.fn();
    
    return {
      onEdit,
      ...render(
        <Provider store={store}>
          <TimerProvider>
            <ExerciseItem
              exercise={exercise}
              completedCount={completedCount}
              inProgressSessionId={inProgressSessionId}
              onEdit={onEdit}
            />
          </TimerProvider>
        </Provider>
      ),
    };
  };
  
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset mock timer state before each test
    mockTimerState = {
      isRunning: false,
      seconds: 30,
      pauseTimer: jest.fn(),
      resumeTimer: jest.fn(),
    };
  });
  
  it('should render exercise details correctly', () => {
    renderExerciseItem();
    
    expect(screen.getByText('Test Exercise')).toBeInTheDocument();
    expect(screen.getByText('0 / 3')).toBeInTheDocument();
    // Using getByText with regex to match the exact text since it might be part of another element
    expect(screen.getByText(/10/)).toBeInTheDocument();
    expect(screen.getByText('00:45')).toBeInTheDocument(); // Duration formatted
    expect(screen.getByText('Test description')).toBeInTheDocument();
    expect(screen.getByText('Start Exercise')).toBeInTheDocument();
  });
  
  it('should show correct progress when some sets are completed', () => {
    renderExerciseItem({ completedCount: 2 });
    
    expect(screen.getByText('2 / 3')).toBeInTheDocument();
    
    // Progress bar should be visible (style properties not directly testable in JSDOM)
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toBeInTheDocument();
  });
  
  it('should disable start button when all sets are completed', () => {
    renderExerciseItem({ completedCount: 3 });
    
    expect(screen.getByText('All Sets Completed')).toBeInTheDocument();
    expect(screen.getByText('All Sets Completed')).toBeDisabled();
  });
  
  it('should show in-progress controls when exercise is in progress', () => {
    // Set seconds to 0 to match the Start Rep Timer button text
    mockTimerState.seconds = 0;
    
    renderExerciseItem({ inProgressSessionId: 'session-id' });
    
    expect(screen.getByText('00:00')).toBeInTheDocument(); // Timer
    expect(screen.getByText('Start Rep Timer')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });
  
  it('should change button text from Cancel to Pause when timer is running', () => {
    // Set timer as running
    mockTimerState.isRunning = true;
    
    renderExerciseItem({ inProgressSessionId: 'session-id' });
    expect(screen.getByText('Pause')).toBeInTheDocument();
  });
  
  it('should call onEdit when edit button is clicked', () => {
    const { onEdit } = renderExerciseItem();
    
    fireEvent.click(screen.getByLabelText('Edit exercise'));
    
    expect(onEdit).toHaveBeenCalledWith(mockExercise);
  });
  
  it('should dispatch deleteExercise when delete is confirmed', () => {
    (window.confirm as jest.Mock).mockReturnValue(true);
    
    renderExerciseItem();
    
    fireEvent.click(screen.getByLabelText('Delete exercise'));
    
    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this exercise?');
    expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({
      payload: 'test-id',
      type: expect.any(String),
    }));
  });
  
  it('should not dispatch deleteExercise when delete is cancelled', () => {
    (window.confirm as jest.Mock).mockReturnValue(false);
    
    renderExerciseItem();
    
    fireEvent.click(screen.getByLabelText('Delete exercise'));
    
    expect(window.confirm).toHaveBeenCalled();
    expect(mockDispatch).not.toHaveBeenCalled();
  });
  
  it('should dispatch startSession but not auto-start timer when start button is clicked', () => {
    renderExerciseItem();
    
    // Clear previous calls
    mockStartTimer.mockClear();
    
    fireEvent.click(screen.getByText('Start Exercise'));
    
    // Should dispatch startSession
    expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({
      payload: expect.any(Object),
      type: expect.stringContaining('startSession'),
    }));
    
    // Timer should not auto-start
    jest.advanceTimersByTime(1000); // Advance past what would have been a delay
    expect(mockStartTimer).not.toHaveBeenCalled();
  });
  
  it('should start timer when timer button is clicked', () => {
    // Set seconds to 0 to get "Start Rep Timer" button text
    mockTimerState.seconds = 0;
    renderExerciseItem({ inProgressSessionId: 'session-id' });
    
    // Clear previous calls
    mockStartTimer.mockClear();
    
    // Find the button using regex to handle various button text
    const timerButton = screen.getByRole('button', { 
      name: /start rep timer|resume timer/i 
    });
    fireEvent.click(timerButton);
    
    // Should start the timer
    expect(mockStartTimer).toHaveBeenCalled();
  });
  
  it('should dispatch cancelSession when cancel button is clicked', () => {
    renderExerciseItem({ inProgressSessionId: 'session-id' });
    
    fireEvent.click(screen.getByText('Cancel'));
    
    // Should dispatch cancelSession
    expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({
      payload: { sessionId: 'session-id' },
      type: expect.stringContaining('cancelSession'),
    }));
  });
  
  it('should call pauseTimer when Pause button is clicked', () => {
    // Set timer as running
    mockTimerState.isRunning = true;
    
    renderExerciseItem({ inProgressSessionId: 'session-id' });
    
    fireEvent.click(screen.getByText('Pause'));
    
    // Should call pauseTimer
    expect(mockTimerState.pauseTimer).toHaveBeenCalled();
  });
  
  it('should show Resume Timer button when timer is paused', () => {
    // Set timer as paused with time remaining
    mockTimerState.isRunning = false;
    mockTimerState.seconds = 15; // Time remaining
    
    renderExerciseItem({ inProgressSessionId: 'session-id' });
    
    expect(screen.getByText('Resume Timer')).toBeInTheDocument();
  });
  
  it('should call resumeTimer when Resume Timer button is clicked', () => {
    // Set timer as paused with time remaining
    mockTimerState.isRunning = false;
    mockTimerState.seconds = 15; // Time remaining
    
    renderExerciseItem({ inProgressSessionId: 'session-id' });
    
    fireEvent.click(screen.getByText('Resume Timer'));
    
    // Should call resumeTimer
    expect(mockTimerState.resumeTimer).toHaveBeenCalled();
  });
  
  it('should not auto-start timer when exercise is resumed', () => {
    renderExerciseItem();
    
    // Clear previous calls
    mockStartTimer.mockClear();
    
    // Click Resume Exercise
    fireEvent.click(screen.getByText('Start Exercise'));
    
    // Timer should not auto-start
    jest.advanceTimersByTime(1000);
    expect(mockStartTimer).not.toHaveBeenCalled();
  });
  
});