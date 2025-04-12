import React, { createContext, useReducer, useEffect, useContext, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { AppState, AppAction, Exercise, ExerciseSession, DailyRecord } from '../types';
import { loadState, saveState } from '../utils/storage';
import { getCurrentDate } from '../utils/dateUtils';

// Initial state
const initialState: AppState = {
  exercises: [],
  history: [],
  currentDate: getCurrentDate(),
};

// Create context
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | undefined>(undefined);

// Reducer function
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'ADD_EXERCISE': {
      const newExercise: Exercise = {
        id: uuidv4(),
        ...action.payload,
      };
      
      return {
        ...state,
        exercises: [...state.exercises, newExercise],
      };
    }
    
    case 'UPDATE_EXERCISE': {
      return {
        ...state,
        exercises: state.exercises.map((exercise) =>
          exercise.id === action.payload.id ? action.payload : exercise
        ),
      };
    }
    
    case 'DELETE_EXERCISE': {
      return {
        ...state,
        exercises: state.exercises.filter((exercise) => exercise.id !== action.payload),
      };
    }
    
    case 'START_SESSION': {
      const { exerciseId } = action.payload;
      const newSession: ExerciseSession = {
        id: uuidv4(),
        exerciseId,
        startTime: new Date().toISOString(),
        endTime: '', // Will be set when completed
        completed: false,
        completedReps: 0,
      };
      
      // Find or create today's record
      const todayRecord = state.history.find((record) => record.date === state.currentDate);
      
      if (todayRecord) {
        // Update existing record
        const updatedHistory = state.history.map((record) =>
          record.date === state.currentDate
            ? { ...record, sessions: [...record.sessions, newSession] }
            : record
        );
        
        return {
          ...state,
          history: updatedHistory,
        };
      } else {
        // Create new record for today
        const newRecord: DailyRecord = {
          date: state.currentDate,
          sessions: [newSession],
        };
        
        return {
          ...state,
          history: [...state.history, newRecord],
        };
      }
    }
    
    case 'COMPLETE_SESSION': {
      const { sessionId, notes } = action.payload;
      
      const updatedHistory = state.history.map((record) => {
        // Only update today's record
        if (record.date !== state.currentDate) return record;
        
        const updatedSessions = record.sessions.map((session) =>
          session.id === sessionId
            ? {
                ...session,
                endTime: new Date().toISOString(),
                completed: true,
                notes: notes,
              }
            : session
        );
        
        return {
          ...record,
          sessions: updatedSessions,
        };
      });
      
      return {
        ...state,
        history: updatedHistory,
      };
    }
    
    case 'CANCEL_SESSION': {
      const { sessionId } = action.payload;
      
      const updatedHistory = state.history.map((record) => {
        // Only update today's record
        if (record.date !== state.currentDate) return record;
        
        // Filter out the session that's being cancelled
        const updatedSessions = record.sessions.filter(
          (session) => session.id !== sessionId
        );
        
        return {
          ...record,
          sessions: updatedSessions,
        };
      });
      
      return {
        ...state,
        history: updatedHistory,
      };
    }
    
    case 'SET_DATE': {
      return {
        ...state,
        currentDate: action.payload,
      };
    }
    
    case 'IMPORT_STATE': {
      return action.payload;
    }
    
    default:
      return state;
  }
};

// Provider component
interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps): JSX.Element => {
  const [state, dispatch] = useReducer(appReducer, initialState, () => {
    const persistedState = loadState();
    return persistedState || initialState;
  });
  
  // Save state to localStorage whenever it changes
  useEffect(() => {
    saveState(state);
  }, [state]);
  
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the AppContext
export const useAppContext = (): {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} => {
  const context = useContext(AppContext);
  
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  
  return context;
};