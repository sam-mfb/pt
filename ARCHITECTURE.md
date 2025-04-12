# Physical Therapy Exercise Tracker - Architecture

This document describes the architecture of the PT Exercise Tracker application to help developers quickly understand and work with the codebase.

## Overview

The PT Exercise Tracker is a React application built with TypeScript that helps users track their physical therapy exercises. The app stores all data locally in the browser's localStorage and allows users to:

- Create and manage exercise routines
- Start and time exercise sessions
- Track completion of daily exercises
- View exercise history
- Import/export all data as JSON

## Project Structure

```
pt/
├── public/             # Static assets
├── src/
│   ├── components/     # React components
│   ├── hooks/          # Custom React hooks
│   ├── middleware/     # Redux middleware
│   ├── store/          # Redux store configuration
│   │   ├── index.ts    # Store setup and configuration
│   │   └── slices/     # Redux Toolkit slices
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # Utility functions
│   ├── __tests__/      # Test files
│   ├── App.tsx         # Main App component
│   ├── index.css       # Global styles
│   └── main.tsx        # Entry point
├── index.html          # HTML template
├── vite.config.ts      # Vite configuration
├── tsconfig.json       # TypeScript configuration
├── package.json        # Dependencies and scripts
```

## Core Architecture

The application follows a functional programming approach with React hooks and context for state management. The architecture promotes:

1. **Loose coupling** - Components depend on interfaces, not implementations
2. **Immutable state** - State is never directly mutated
3. **Pure functions** - Functions produce the same output for the same input
4. **Component composition** - Smaller, focused components combined to create features

### State Management

The application uses Redux Toolkit to manage global state:

- Store is configured in `src/store/index.ts`
- State is organized into three main slices:
  - `exerciseSlice` - Manages exercise data (add, update, delete)
  - `sessionSlice` - Manages exercise sessions and history
  - `uiSlice` - Manages UI state like active tab and modals

Redux Toolkit's slice pattern is used for each state domain:

1. Each slice defines its own reducers and actions
2. `createSlice` automatically generates action creators
3. Components use typed hooks (`useAppSelector` and `useAppDispatch`)

Timer functionality is still managed via React Context because it's UI-specific and doesn't need to be persisted.

### Data Flow

1. User interactions dispatch Redux actions via `useAppDispatch`
2. Reducers defined in slices process these actions and update store state
3. Selectors (via `useAppSelector`) extract data from the store 
4. Components re-render with the new state
5. A custom Redux middleware (`persistMiddleware`) automatically saves state to localStorage

### Data Model

The core data model consists of:

- `Exercise` - Represents an exercise with name, sets, reps, and duration
- `ExerciseSession` - Records a single completed exercise session
- `DailyRecord` - Collects sessions for a specific date
- `AppState` - The root state containing exercises, history, and current date

## Key Components

- `ExerciseList` - Displays all available exercises
- `ExerciseItem` - Individual exercise with controls
- `ExerciseForm` - Form for adding/editing exercises
- `History` - Shows past exercise records
- `DateNavigator` - Controls for navigating between dates
- `DataControls` - Import/export functionality

## Storage

All application data is stored in the browser's localStorage. The storage module (`utils/storage.ts`) handles:

- Loading state from localStorage on app init
- Saving state to localStorage when state changes
- Importing/exporting state as JSON

## Testing

The application uses Jest and ts-jest for testing, focusing on:

- Unit tests for utility functions
- Business logic tests

## Build and Deployment

The application uses:

- Vite for the build system and development server
- TypeScript for static typing
- ESLint and Prettier for code quality and formatting

## Future Considerations

1. **Data Synchronization** - Currently all data is local, but could be extended to sync with a backend
2. **Offline Support** - Already works offline by design
3. **Progress Tracking** - Additional statistics and progress visualization could be implemented
4. **Mobile Optimization** - The UI is responsive but could be further optimized for mobile