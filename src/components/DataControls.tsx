import { useRef } from 'react';
import { useAppSelector } from '../hooks/useAppSelector';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { exportState, importState } from '../utils/storage';
import { importExercises } from '../store/slices/exerciseSlice';
import { importHistory, clearHistory } from '../store/slices/sessionSlice';

export const DataControls = () => {
  const exercises = useAppSelector((state) => state.exercises.items);
  const history = useAppSelector((state) => state.sessions.history);
  const currentDate = useAppSelector((state) => state.sessions.currentDate);
  
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Handle export data
  const handleExport = (): void => {
    exportState({
      exercises,
      history,
      currentDate,
    });
  };
  
  // Handle clearing all history
  const handleClearHistory = (): void => {
    if (window.confirm('This will delete all your exercise history. Are you sure?')) {
      dispatch(clearHistory());
    }
  };
  
  // Trigger file input click
  const handleImportClick = (): void => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  // Handle import data from file
  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    
    reader.onload = (event): void => {
      try {
        const jsonString = event.target?.result as string;
        const importedState = importState(jsonString);
        
        if (importedState) {
          if (window.confirm('This will replace all your current data. Are you sure?')) {
            // Import exercises
            dispatch(importExercises(importedState.exercises));
            
            // Import history and current date
            dispatch(importHistory({
              history: importedState.history,
              currentDate: importedState.currentDate,
            }));
          }
        } else {
          alert('Invalid data format. Import failed.');
        }
      } catch (err) {
        console.error('Error importing data:', err);
        alert('Error importing data. Please check the file format.');
      }
      
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };
    
    reader.readAsText(file);
  };
  
  return (
    <div className="data-controls card p-lg mt-lg">
      <h3 className="text-lg font-semibold mb-md">Data Management</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-md">
        Export your exercise data to back it up or import previously saved data.
      </p>
      <div className="control-buttons flex gap-md flex-wrap">
        <button onClick={handleExport} className="btn btn-primary flex items-center gap-sm">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Export Data
        </button>
        <button onClick={handleImportClick} className="btn btn-secondary flex items-center gap-sm">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M17 8L12 3L7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 3V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Import Data
        </button>
        <button onClick={handleClearHistory} className="btn btn-danger flex items-center gap-sm">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Clear History
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImportFile}
          accept=".json"
          className="hidden"
        />
      </div>
    </div>
  );
};