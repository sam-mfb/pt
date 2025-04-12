import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { store } from '../store';
import { App } from '../App';
import { getCurrentDate } from '../utils/dateUtils';

describe('Date display check', () => {
  it('checks what date is displayed on app startup', () => {
    // Get today's actual date for comparison
    const today = getCurrentDate();
    console.log('Current system date (formatDate):', today);
    console.log('Raw JS Date:', new Date().toISOString());
    
    // Render the app with the real store
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    // Find the date display in the DateNavigator component
    const dateHeading = screen.getByRole('heading', { level: 3 });
    
    // Log the actual date shown for verification
    console.log('Date displayed on app startup:', dateHeading.textContent);

    // Also log the date paragraph text
    const dateParagraph = screen.getByText(/\w+, \w+ \d+, \d{4}/); // Matches date format like "Monday, April 12, 2025"
    console.log('Full date displayed:', dateParagraph.textContent);
    
    // Check if the "Today" button is disabled (which indicates we're on today's date)
    const todayButton = screen.getByRole('button', { name: 'Today' });
    console.log('Today button disabled:', todayButton.hasAttribute('disabled'));
    
    // Let's try navigating to yesterday and back
    // Click on previous day button
    const prevButton = screen.getByRole('button', { name: 'Previous day' });
    fireEvent.click(prevButton);
    
    // Check what date is displayed now
    console.log('After clicking previous: Date heading is now', screen.getByRole('heading', { level: 3 }).textContent);
    
    // Now the Today button should be enabled
    console.log('Today button disabled after clicking previous:', 
      screen.getByRole('button', { name: 'Today' }).hasAttribute('disabled'));
  });
});