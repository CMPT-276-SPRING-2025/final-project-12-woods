import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import GoogleMaps from '../pages/GoogleMaps';

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

describe('GoogleMaps Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the map component', () => {
    render(<GoogleMaps />);
    expect(screen.getByTestId('google-map')).toBeInTheDocument();
  });

  it('renders all required controls', () => {
    render(<GoogleMaps />);
    expect(screen.getByTestId('google-map')).toBeInTheDocument();
    // Check for both autocomplete components
    const autocompleteComponents = screen.getAllByTestId('autocomplete');
    expect(autocompleteComponents).toHaveLength(2);
    expect(screen.getByRole('spinbutton', { name: /radius/i })).toBeInTheDocument();
  });

  it('handles radius input changes', () => {
    render(<GoogleMaps />);
    const radiusInput = screen.getByRole('spinbutton', { name: /radius/i });
    fireEvent.change(radiusInput, { target: { value: '5' } });
    expect(radiusInput.value).toBe('5');
  });

  it('validates radius input values', () => {
    render(<GoogleMaps />);
    const radiusInput = screen.getByRole('spinbutton', { name: /radius/i });
    
    // Test invalid input
    fireEvent.change(radiusInput, { target: { value: '0' } });
    expect(radiusInput.value).toBe('1'); // Should default to 1

    // Test negative input
    fireEvent.change(radiusInput, { target: { value: '-1' } });
    expect(radiusInput.value).toBe('1'); // Should default to 1
  });

  it('handles restaurant search input', () => {
    render(<GoogleMaps />);
    const restaurantInput = screen.getByPlaceholderText(/search for a restaurant/i);
    fireEvent.change(restaurantInput, { target: { value: 'Pizza Place' } });
    expect(restaurantInput.value).toBe('Pizza Place');
  });
}); 