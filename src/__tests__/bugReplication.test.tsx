import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { App } from '../App';
import { getCurrentDate } from '../utils/dateUtils';
import * as storeImport from '../store';
import * as storageUtils from '../utils/storage';

// Target the actual bug: The store's preloaded state is supposed to use getCurrentDate,
// but something is causing it to load yesterday's date instead

describe('Bug Replication Test', () => {
  it('replicates bug where app loads with yesterday date', () => {
    // The actual behavior that must be happening:
    // 1. Create yesterday's date
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayFormatted = yesterday.toISOString().split('T')[0];
    
    // Today's date
    const today = getCurrentDate();
    
    console.log('Yesterday date:', yesterdayFormatted);
    console.log('Today date:', today);
    
    // Mock the loadState function to return yesterday's date
    // This is what would happen if localStorage contained yesterday's date
    jest.spyOn(storageUtils, 'loadState').mockImplementation(() => ({
      exercises: [],
      history: [],
      currentDate: yesterdayFormatted
    }));
    
    // Check what date the store has
    const storeState = storeImport.store.getState();
    console.log('Date in store after initialization:', storeState.sessions.currentDate);
    
    // Render the app
    render(
      <Provider store={storeImport.store}>
        <App />
      </Provider>
    );
    
    // Check what date is displayed
    const dateHeading = screen.getByRole('heading', { level: 3 });
    console.log('Date displayed in UI:', dateHeading.textContent);
    
    // Check what date text is displayed
    const fullDate = screen.getByText(/\w+, \w+ \d+, \d{4}/);
    console.log('Full date displayed:', fullDate.textContent);
    
    // Check if today button is disabled (indicating we're on today's date)
    const todayButton = screen.getByRole('button', { name: 'Today' });
    console.log('Today button disabled:', todayButton.hasAttribute('disabled'));
  });
});