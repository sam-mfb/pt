import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Initial state
interface UiState {
  activeTab: 'exercises' | 'history';
  importDialogOpen: boolean;
}

const initialState: UiState = {
  activeTab: 'exercises',
  importDialogOpen: false,
};

// Create the UI slice
export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Set active tab
    setActiveTab: (state, action: PayloadAction<'exercises' | 'history'>) => {
      state.activeTab = action.payload;
    },
    
    // Set import dialog open state
    setImportDialogOpen: (state, action: PayloadAction<boolean>) => {
      state.importDialogOpen = action.payload;
    },
  },
});

// Export actions
export const { setActiveTab, setImportDialogOpen } = uiSlice.actions;

// Export the reducer
export default uiSlice.reducer;