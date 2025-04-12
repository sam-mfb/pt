#!/bin/bash

echo "Running app health check..."

# Start the app in the background and redirect output to a file
npm run dev > app_output.log 2>&1 &
APP_PID=$!

# Give it a moment to start
sleep 5

# Check if the app started successfully by looking for the ready message
if grep -q "VITE.*ready" app_output.log && grep -q "Local:" app_output.log; then
  echo "✅ App started successfully!"
  grep -A 2 "VITE.*ready" app_output.log
  # Kill the app
  kill $APP_PID
  wait $APP_PID 2>/dev/null
  rm app_output.log
  exit 0
else
  echo "❌ App failed to start properly"
  cat app_output.log
  # Kill the app
  kill $APP_PID
  wait $APP_PID 2>/dev/null
  rm app_output.log
  exit 1
fi