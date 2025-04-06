import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Gemini from '../pages/Gemini';
import GoogleMaps from '../pages/GoogleMaps';
import axios from 'axios';

// Mock axios
vi.mock('axios');

// Mock the Google Maps API
vi.mock('@react-google-maps/api', () => ({
  GoogleMap: ({ children }) => <div data-testid="google-map">{children}</div>,
  LoadScript: ({ children }) => <div data-testid="load-script">{children}</div>,
  Marker: () => <div data-testid="marker">Marker</div>,
  Autocomplete: ({ children }) => <div data-testid="autocomplete">{children}</div>,
  InfoWindow: () => <div data-testid="info-window">InfoWindow</div>,
  Circle: () => <div data-testid="circle">Circle</div>
}));

// Mock geolocation
const mockGeolocation = {
  getCurrentPosition: vi.fn()
    .mockImplementation((success) => 
      success({
        coords: {
          latitude: 49.2827,
          longitude: -123.1207
        }
      })
    )
};

Object.defineProperty(global.navigator, 'geolocation', {
  value: mockGeolocation,
});

// Mock window.google
global.window.google = {
  maps: {
    places: {
      PlacesService: vi.fn().mockImplementation(() => ({
        nearbySearch: vi.fn().mockImplementation((request, callback) => {
          callback([], 'OK', { hasNextPage: false });
        })
      })),
      PlacesServiceStatus: {
        OK: 'OK'
      }
    },
    geometry: {
      spherical: {
        computeDistanceBetween: vi.fn().mockReturnValue(100)
      }
    },
    LatLng: vi.fn()
  }
};

describe('Integration Tests', () => {
  describe('Gemini API Tests', () => {
    beforeEach(() => {
      vi.clearAllMocks();
      // Mock successful API response for Gemini
      axios.post.mockResolvedValue({
        data: {
          candidates: [{
            content: {
              parts: [{ text: 'Here are some restaurant recommendations...' }]
            }
          }]
        }
      });
    });

    it('renders the chat interface', () => {
      render(<Gemini />);
      
      // Check for essential chat elements
      expect(screen.getByPlaceholderText(/type your message/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
    });

    it('sends a message and receives a response', async () => {
      // Mock the API response
      axios.post.mockResolvedValueOnce({
        data: {
          candidates: [{
            content: {
              parts: [{ text: 'Here are some restaurant recommendations in your area:\n\n1. Green Leaf Cafe\n2. Fresh Bites\n3. Healthy Bowl' }]
            }
          }]
        }
      });

      render(<Gemini />);

      // Send a message
      const input = screen.getByPlaceholderText(/type your message/i);
      const sendButton = screen.getByRole('button', { name: /send/i });

      fireEvent.change(input, { target: { value: 'What are some healthy restaurants near me?' } });
      fireEvent.click(sendButton);

      // Verify the message and response
      await waitFor(() => {
        expect(screen.getByText('What are some healthy restaurants near me?')).toBeInTheDocument();
        expect(screen.getByText(/Here are some restaurant recommendations in your area/i)).toBeInTheDocument();
      });
    });

    it('shows loading state while waiting for response', async () => {
      // Mock delayed API response
      axios.post.mockImplementation(() => new Promise(resolve => 
        setTimeout(() => resolve({
          data: {
            candidates: [{
              content: {
                parts: [{ text: 'Here are some restaurant recommendations...' }]
              }
            }]
          }
        }), 100)
      ));

      render(<Gemini />);

      // Send a message
      const input = screen.getByPlaceholderText(/type your message/i);
      const sendButton = screen.getByRole('button', { name: /send/i });

      fireEvent.change(input, { target: { value: 'Hello' } });
      fireEvent.click(sendButton);

      // Verify loading state appears
      expect(screen.getByRole('status')).toBeInTheDocument();
    });
  });

  describe('Google Maps Integration Tests', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('renders map with all controls', async () => {
      render(<GoogleMaps />);
      
      // Check for essential map elements
      expect(screen.getByTestId('google-map')).toBeInTheDocument();
      expect(screen.getByRole('spinbutton', { name: /radius/i })).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/search for any restaurant/i)).toBeInTheDocument();
    });

    it('handles radius input changes', async () => {
      render(<GoogleMaps />);
      
      const radiusInput = screen.getByRole('spinbutton', { name: /radius/i });
      fireEvent.change(radiusInput, { target: { value: '5' } });
      
      // Just verify the input value changes
      expect(radiusInput.value).toBe('5');
    });

    it('handles restaurant search input', async () => {
      render(<GoogleMaps />);
      
      const searchInput = screen.getByPlaceholderText(/search for any restaurant/i);
      fireEvent.change(searchInput, { target: { value: 'Pizza' } });
      
      // Just verify the input value changes
      expect(searchInput.value).toBe('Pizza');
    });
  });
});
