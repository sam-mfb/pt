import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { ExerciseSession, DailyRecord } from '../../types';
import { getCurrentDate, formatDate } from '../../utils/dateUtils';

// Initial state
interface SessionState {
  history: DailyRecord[];
  currentDate: string;
}

// Always use today's date regardless of what might be in localStorage
const initialState: SessionState = {
  history: [],
  currentDate: getCurrentDate(),
};

// Create the session slice
export const sessionSlice = createSlice({
  name: 'sessions',
  initialState,
  reducers: {
    // Reset to today's date
    resetToToday: (state) => {
      state.currentDate = getCurrentDate();
    },
    
    // Clear all history
    clearHistory: (state) => {
      state.history = [];
      state.currentDate = getCurrentDate();
    },
    
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
        // Create a new session with a timestamp that explicitly records the time
        // Using toISOString() ensures consistent timestamp format in UTC for timestamps
        const session: ExerciseSession = {
          id: uuidv4(),
          exerciseId,
          startTime: new Date().toISOString(), // ISO format for precise timestamps
          endTime: '',
          completed: false,
          completedReps: 0,
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
          endTime: new Date().toISOString(), // ISO format for precise timestamps
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

    // Mark a rep as completed in a session
    completeRep: (state, action: PayloadAction<{ sessionId: string }>) => {
      const { sessionId } = action.payload;
      
      // Find the session in today's record
      const todayRecord = state.history.find((record) => record.date === state.currentDate);
      if (!todayRecord) return;
      
      const sessionIndex = todayRecord.sessions.findIndex(
        (session) => session.id === sessionId
      );
      
      if (sessionIndex !== -1) {
        const session = todayRecord.sessions[sessionIndex];
        
        // Find the related exercise to check rep count limit
        const exercise = session.exerciseId;
        
        // Increment the rep count
        todayRecord.sessions[sessionIndex] = {
          ...session,
          completedReps: session.completedReps + 1
        };
      }
    },
    
    // Set current date - ensure proper date format is used
    setCurrentDate: (state, action: PayloadAction<string>) => {
      // Ensure the passed date is in YYYY-MM-DD format
      if (action.payload.match(/^\d{4}-\d{2}-\d{2}$/)) {
        state.currentDate = action.payload;
      } else {
        // Try to convert the date to our standard format
        try {
          state.currentDate = formatDate(new Date(action.payload));
        } catch (e) {
          // Fallback to today's date if the date is invalid
          state.currentDate = getCurrentDate();
        }
      }
    },
    
    // Import history from backup
    importHistory: (state, action: PayloadAction<{ history: DailyRecord[]; currentDate: string }>) => {
      state.history = action.payload.history;
      
      // Validate the date format from the import
      if (action.payload.currentDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
        state.currentDate = action.payload.currentDate;
      } else {
        // Default to today's date if the imported date is invalid
        state.currentDate = getCurrentDate();
      }
    },
  },
});

// Export actions
export const {
  resetToToday,
  clearHistory,
  startSession,
  completeSession,
  completeRep,
  cancelSession,
  setCurrentDate,
  importHistory,
} = sessionSlice.actions;

// Export the reducer
export default sessionSlice.reducer;