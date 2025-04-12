#!/usr/bin/env node

import { spawn } from 'child_process';
import http from 'http';

// Function to check if a port is already in use
function isPortInUse(port) {
  return new Promise((resolve) => {
    const server = http.createServer();
    server.once('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        resolve(true);
      } else {
        resolve(false);
      }
    });
    server.once('listening', () => {
      server.close();
      resolve(false);
    });
    server.listen(port);
  });
}

// Find an available port starting from 3000
async function findAvailablePort(startPort = 3000, maxAttempts = 10) {
  for (let i = 0; i < maxAttempts; i++) {
    const port = startPort + i;
    const inUse = await isPortInUse(port);
    if (!inUse) {
      return port;
    }
  }
  throw new Error(`Could not find an available port after ${maxAttempts} attempts`);
}

async function startApp() {
  try {
    const port = await findAvailablePort();
    console.log(`Starting app on port ${port} for health check...`);
    
    // Start the dev server with the available port
    const viteProcess = spawn('npx', ['vite', '--port', port.toString()], {
      stdio: 'pipe',
      shell: true,
      env: { ...process.env }
    });
    
    let output = '';
    let errorOutput = '';
    let serverStarted = false;
    
    viteProcess.stdout.on('data', (data) => {
      const chunk = data.toString();
      output += chunk;
      
      // Check if server started successfully
      if (chunk.includes('ready in') && chunk.includes('Local:')) {
        serverStarted = true;
        console.log('\n✅ App started successfully!');
        console.log('Server output:', chunk);
        
        // Kill the server after confirming it starts
        viteProcess.kill('SIGINT');
      }
    });
    
    viteProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });
    
    viteProcess.on('close', (code) => {
      if (!serverStarted) {
        console.error('\n❌ App failed to start properly');
        console.error('Error output:', errorOutput || 'No error output');
        console.error('Output:', output || 'No output');
        process.exit(1);
      } else {
        console.log('App health check completed successfully');
        process.exit(0);
      }
    });
    
    // Set a timeout to kill the process if it doesn't complete in time
    setTimeout(() => {
      if (!serverStarted) {
        console.error('\n❌ Timed out waiting for app to start');
        viteProcess.kill('SIGINT');
        process.exit(1);
      }
    }, 10000);
    
  } catch (error) {
    console.error('Failed to start app:', error.message);
    process.exit(1);
  }
}

// Run the app check
startApp();