// main.jsx

// Override console.warn and console.error to suppress specific Google Maps warnings.
const originalWarn = console.warn;
const originalError = console.error;
console.warn = (...args) => {
  if (
    args[0] &&
    typeof args[0] === "string" &&
    (args[0].includes("google.maps") ||
      args[0].includes("gmp-internal") ||
      args[0].includes("gmp-map") ||
      args[0].includes("gmp-place-autocomplete"))
  ) {
    return;
  }
  originalWarn(...args);
};
console.error = (...args) => {
  if (
    args[0] &&
    typeof args[0] === "string" &&
    (args[0].includes("google.maps") ||
      args[0].includes("gmp-internal") ||
      args[0].includes("gmp-map") ||
      args[0].includes("gmp-place-autocomplete"))
  ) {
    return;
  }
  originalError(...args);
};

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
