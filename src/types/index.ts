export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  duration: number; // Duration in seconds
  description?: string;
}

export interface ExerciseSession {
  id: string;
  exerciseId: string;
  startTime: string; // ISO string
  endTime: string; // ISO string
  completed: boolean;
  completedReps: number; // Track how many reps were completed
  notes?: string;
}

export interface DailyRecord {
  date: string; // YYYY-MM-DD format
  sessions: ExerciseSession[];
}

export interface AppState {
  exercises: Exercise[];
  history: DailyRecord[];
  currentDate: string; // YYYY-MM-DD format
}

export type AppAction =
  | { type: 'ADD_EXERCISE'; payload: Omit<Exercise, 'id'> }
  | { type: 'UPDATE_EXERCISE'; payload: Exercise }
  | { type: 'DELETE_EXERCISE'; payload: string }
  | { type: 'START_SESSION'; payload: { exerciseId: string } }
  | { type: 'COMPLETE_SESSION'; payload: { sessionId: string; notes?: string } }
  | { type: 'CANCEL_SESSION'; payload: { sessionId: string } }
  | { type: 'SET_DATE'; payload: string }
  | { type: 'IMPORT_STATE'; payload: AppState };

export interface TimerContextType {
  isRunning: boolean;
  seconds: number;
  duration: number;
  startTimer: (duration: number, completeCallback?: () => void) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  resetTimer: () => void;
  restartTimer: () => void; // Reset and start again with same duration
}

// Enable JSX in TypeScript
declare global {
  namespace JSX {
    interface Element {}
  }
}