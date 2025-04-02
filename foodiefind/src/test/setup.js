import '@testing-library/jest-dom';
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extend Vitest's expect method with methods from react-testing-library
expect.extend(matchers);

// Cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
});

// Mock Google Maps API
global.google = {
  maps: {
    Map: class {},
    Marker: class {},
    LatLng: class {},
    places: {
      Autocomplete: class {},
      AutocompleteService: class {},
      PlacesService: class {},
      PlacesServiceStatus: {
        OK: 'OK',
        ZERO_RESULTS: 'ZERO_RESULTS',
        OVER_QUERY_LIMIT: 'OVER_QUERY_LIMIT',
        REQUEST_DENIED: 'REQUEST_DENIED',
        INVALID_REQUEST: 'INVALID_REQUEST',
        UNKNOWN_ERROR: 'UNKNOWN_ERROR'
      }
    }
  }
};

// Mock Gemini API
global.google = {
  ...global.google,
  ai: {
    gemini: {
      GenerativeModel: class {
        generateContent() {
          return Promise.resolve({
            response: {
              text: () => 'Mocked Gemini response'
            }
          });
        }
      }
    }
  }
}; 