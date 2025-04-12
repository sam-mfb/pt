import { useRef } from 'react';
import { useAppSelector } from '../hooks/useAppSelector';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { exportState, importState } from '../utils/storage';
import { importExercises } from '../store/slices/exerciseSlice';
import { importHistory } from '../store/slices/sessionSlice';

export const DataControls = (): JSX.Element => {
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
    <div className="data-controls">
      <h3>Data Management</h3>
      <div className="control-buttons">
        <button onClick={handleExport} className="btn-secondary">
          Export Data
        </button>
        <button onClick={handleImportClick} className="btn-secondary">
          Import Data
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImportFile}
          accept=".json"
          style={{ display: 'none' }}
        />
      </div>
    </div>
  );
};