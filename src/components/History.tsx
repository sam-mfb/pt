import { useState } from 'react';
import { useAppSelector } from '../hooks/useAppSelector';
import { formatDateFull, formatTime, formatDuration } from '../utils/dateUtils';

export const History = () => {
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
    
    const completedSessions = selectedRecord.sessions.filter((session: any) => session.completed);
    
    const totalTime = completedSessions.reduce((total: number, session: any) => {
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
      <h2 className="text-xl font-semibold mb-lg">Exercise History</h2>
      
      {sortedHistory.length === 0 ? (
        <div className="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-lg opacity-50">
            <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3 10H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8 14H8.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 14H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 14H16.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8 18H8.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 18H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 18H16.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <p className="mb-md">No exercise history found. Start your first exercise session to track your progress!</p>
        </div>
      ) : (
        <div className="history-content grid grid-cols-1 md:grid-cols-3 gap-lg">
          <div className="date-selector card">
            <h3 className="font-medium mb-md">Select Date</h3>
            <div className="date-list flex flex-col gap-xs">
              {sortedHistory.map((record) => (
                <button
                  key={record.date}
                  onClick={() => setSelectedDate(record.date)}
                  className={`text-left p-sm rounded-md transition-colors ${record.date === (selectedDate || sortedHistory[0].date) ? 'bg-primary text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                >
                  {formatDateFull(record.date)}
                </button>
              ))}
            </div>
          </div>
          
          {selectedRecord && (
            <div className="day-details col-span-1 md:col-span-2 card">
              <div className="day-header border-b border-gray-200 dark:border-gray-700 pb-md mb-md">
                <h3 className="font-semibold mb-sm" data-testid="selected-date-heading">{formatDateFull(selectedRecord.date)}</h3>
                <div className="day-stats grid grid-cols-2 gap-md">
                  <div className="stat bg-gray-100 dark:bg-gray-800 p-md rounded-md">
                    <span className="stat-label block text-sm text-gray-600 dark:text-gray-400">Completed Sessions</span>
                    <span className="stat-value text-xl font-bold text-primary">{stats.totalSessions}</span>
                  </div>
                  <div className="stat bg-gray-100 dark:bg-gray-800 p-md rounded-md">
                    <span className="stat-label block text-sm text-gray-600 dark:text-gray-400">Total Time</span>
                    <span className="stat-value text-xl font-bold text-primary">{formatDuration(stats.totalTime)}</span>
                  </div>
                </div>
              </div>
              
              <div className="sessions-list">
                <h4 className="font-medium mb-sm">Sessions</h4>
                {selectedRecord.sessions.length === 0 ? (
                  <p className="text-gray-600 dark:text-gray-400 text-center py-md">No sessions recorded for this day.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead className="text-left text-sm bg-gray-100 dark:bg-gray-800">
                        <tr>
                          <th className="p-sm">Exercise</th>
                          <th className="p-sm">Start Time</th>
                          <th className="p-sm">Duration</th>
                          <th className="p-sm">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedRecord.sessions.map((session: any) => {
                          // Find the exercise name
                          const exercise = exercises.find((ex: any) => ex.id === session.exerciseId);
                          
                          // Calculate duration
                          let duration = 0;
                          if (session.completed) {
                            const startTime = new Date(session.startTime).getTime();
                            const endTime = new Date(session.endTime).getTime();
                            duration = Math.round((endTime - startTime) / 1000); // Convert to seconds
                          }
                          
                          return (
                            <tr 
                              key={session.id} 
                              className={`border-b border-gray-200 dark:border-gray-700 ${session.completed ? 'text-gray-800 dark:text-gray-200' : 'text-gray-500 dark:text-gray-400'}`}
                            >
                              <td className="p-sm font-medium">{exercise ? exercise.name : 'Unknown Exercise'}</td>
                              <td className="p-sm">{formatTime(session.startTime)}</td>
                              <td className="p-sm">{session.completed ? formatDuration(duration) : '-'}</td>
                              <td className="p-sm">
                                <span className={`inline-block px-2 py-1 rounded-full text-xs ${session.completed ? 'bg-success/20 text-success' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}>
                                  {session.completed ? 'Completed' : 'In Progress'}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};