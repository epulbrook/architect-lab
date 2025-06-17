#!/bin/bash

# Start the SEO analyser backend
cd src/seo-analyser/backend || exit 1
echo "[SEO Analyser] Installing backend dependencies..."
npm install

echo "[SEO Analyser] Starting backend server on port 3002..."
node server.js &
BACKEND_PID=$!

# Return to project root and start the frontend
cd ../../../..
echo "[SEO Analyser] Installing frontend dependencies..."
npm install

echo "[SEO Analyser] Starting frontend (open http://localhost:5173 or the URL shown below)..."
npm run dev

# When frontend stops, kill backend
kill $BACKEND_PID 

npm run build 