import { useState } from 'react';
import { useAppSelector } from '../hooks/useAppSelector';
import { formatDate, formatTime, formatDuration } from '../utils/dateUtils';

export const History = (): JSX.Element => {
  const exercises = useAppSelector((state) => state.exercises.items);
  const history = useAppSelector((state) => state.sessions.history);
  
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  
  // Sort history by date (most recent first)
  const sortedHistory = [...history].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  // Get the selected record or the first one
  const selectedRecord = selectedDate 
    ? sortedHistory.find((record) => record.date === selectedDate)
    : sortedHistory[0];
  
  // Calculate statistics for the selected day
  const calculateStats = (): { totalSessions: number; totalTime: number } => {
    if (!selectedRecord) {
      return { totalSessions: 0, totalTime: 0 };
    }
    
    const completedSessions = selectedRecord.sessions.filter((session) => session.completed);
    
    const totalTime = completedSessions.reduce((total, session) => {
      const startTime = new Date(session.startTime).getTime();
      const endTime = new Date(session.endTime).getTime();
      return total + (endTime - startTime) / 1000; // Convert to seconds
    }, 0);
    
    return {
      totalSessions: completedSessions.length,
      totalTime: Math.round(totalTime),
    };
  };
  
  const stats = calculateStats();
  
  return (
    <div className="history-view">
      <h2>Exercise History</h2>
      
      {sortedHistory.length === 0 ? (
        <div className="empty-state">
          <p>No exercise history found. Start your first exercise session to track your progress!</p>
        </div>
      ) : (
        <div className="history-content">
          <div className="date-selector">
            <h3>Select Date</h3>
            <div className="date-list">
              {sortedHistory.map((record) => (
                <button
                  key={record.date}
                  onClick={() => setSelectedDate(record.date)}
                  className={`date-button ${record.date === (selectedDate || sortedHistory[0].date) ? 'active' : ''}`}
                >
                  {formatDate(record.date)}
                </button>
              ))}
            </div>
          </div>
          
          {selectedRecord && (
            <div className="day-details">
              <div className="day-header">
                <h3>{formatDate(selectedRecord.date)}</h3>
                <div className="day-stats">
                  <div className="stat">
                    <span className="stat-label">Completed Sessions:</span>
                    <span className="stat-value">{stats.totalSessions}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Total Time:</span>
                    <span className="stat-value">{formatDuration(stats.totalTime)}</span>
                  </div>
                </div>
              </div>
              
              <div className="sessions-list">
                <h4>Sessions</h4>
                {selectedRecord.sessions.length === 0 ? (
                  <p>No sessions recorded for this day.</p>
                ) : (
                  <table className="sessions-table">
                    <thead>
                      <tr>
                        <th>Exercise</th>
                        <th>Start Time</th>
                        <th>End Time</th>
                        <th>Duration</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedRecord.sessions.map((session) => {
                        // Find the exercise name
                        const exercise = exercises.find((ex) => ex.id === session.exerciseId);
                        
                        // Calculate duration
                        let duration = 0;
                        if (session.completed) {
                          const startTime = new Date(session.startTime).getTime();
                          const endTime = new Date(session.endTime).getTime();
                          duration = Math.round((endTime - startTime) / 1000); // Convert to seconds
                        }
                        
                        return (
                          <tr key={session.id} className={session.completed ? 'completed' : 'in-progress'}>
                            <td>{exercise ? exercise.name : 'Unknown Exercise'}</td>
                            <td>{formatTime(session.startTime)}</td>
                            <td>{session.completed ? formatTime(session.endTime) : '-'}</td>
                            <td>{session.completed ? formatDuration(duration) : '-'}</td>
                            <td>{session.completed ? 'Completed' : 'In Progress'}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};