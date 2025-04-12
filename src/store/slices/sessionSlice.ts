import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { ExerciseSession, DailyRecord } from '../../types';
import { getCurrentDate } from '../../utils/dateUtils';

// Initial state
interface SessionState {
  history: DailyRecord[];
  currentDate: string;
}

const initialState: SessionState = {
  history: [],
  currentDate: getCurrentDate(),
};

// Create the session slice
export const sessionSlice = createSlice({
  name: 'sessions',
  initialState,
  reducers: {
    // Start a new exercise session
    startSession: {
      reducer: (state, action: PayloadAction<{ session: ExerciseSession }>) => {
        const { session } = action.payload;
        
        // Find or create today's record
        const todayRecord = state.history.find((record) => record.date === state.currentDate);
        
        if (todayRecord) {
          // Add session to existing record
          todayRecord.sessions.push(session);
        } else {
          // Create new record for today
          state.history.push({
            date: state.currentDate,
            sessions: [session],
          });
        }
      },
      prepare: (exerciseId: string) => {
        // Create a new session
        const session: ExerciseSession = {
          id: uuidv4(),
          exerciseId,
          startTime: new Date().toISOString(),
          endTime: '',
          completed: false,
        };
        
        return { payload: { session } };
      },
    },
    
    // Complete an exercise session
    completeSession: (
      state, 
      action: PayloadAction<{ sessionId: string; notes?: string }>
    ) => {
      const { sessionId, notes } = action.payload;
      
      // Find the session in today's record
      const todayRecord = state.history.find((record) => record.date === state.currentDate);
      if (!todayRecord) return;
      
      const sessionIndex = todayRecord.sessions.findIndex(
        (session) => session.id === sessionId
      );
      
      if (sessionIndex !== -1) {
        todayRecord.sessions[sessionIndex] = {
          ...todayRecord.sessions[sessionIndex],
          endTime: new Date().toISOString(),
          completed: true,
          notes,
        };
      }
    },
    
    // Cancel an exercise session
    cancelSession: (state, action: PayloadAction<{ sessionId: string }>) => {
      const { sessionId } = action.payload;
      
      // Find the session in today's record
      const todayRecord = state.history.find((record) => record.date === state.currentDate);
      if (!todayRecord) return;
      
      // Remove the session
      todayRecord.sessions = todayRecord.sessions.filter(
        (session) => session.id !== sessionId
      );
    },
    
    // Set current date
    setCurrentDate: (state, action: PayloadAction<string>) => {
      state.currentDate = action.payload;
    },
    
    // Import history from backup
    importHistory: (state, action: PayloadAction<{ history: DailyRecord[]; currentDate: string }>) => {
      state.history = action.payload.history;
      state.currentDate = action.payload.currentDate;
    },
  },
});

// Export actions
export const {
  startSession,
  completeSession,
  cancelSession,
  setCurrentDate,
  importHistory,
} = sessionSlice.actions;

// Export the reducer
export default sessionSlice.reducer;