// main.jsx

// Suppress Google Maps Legacy API warnings in production code
// This is a workaround, since they have chaged the Places API on March 1, 2025
// To enable console logs for development, set logs to true 
const logs = false;

if (!logs) {
  console.log = () => {};
  console.info = () => {};
  console.warn = () => {};
  console.error = () => {};
}

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
