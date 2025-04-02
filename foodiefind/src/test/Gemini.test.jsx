import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Gemini from '../pages/Gemini';
import axios from 'axios';

// Mock axios
vi.mock('axios');

describe('Gemini Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    axios.post.mockReset();
  });

  it('renders the chat interface', () => {
    render(<Gemini />);
    expect(screen.getByPlaceholderText(/type your message/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
  });

  it('handles user input', () => {
    render(<Gemini />);
    const input = screen.getByPlaceholderText(/type your message/i);
    fireEvent.change(input, { target: { value: 'Hello, Gemini!' } });
    expect(input.value).toBe('Hello, Gemini!');
  });

  it('sends message and displays response', async () => {
    const mockResponse = {
      data: {
        candidates: [{
          content: {
            parts: [{
              text: 'Mocked Gemini response'
            }]
          }
        }]
      }
    };

    axios.post.mockResolvedValueOnce(mockResponse);

    render(<Gemini />);
    
    const input = screen.getByPlaceholderText(/type your message/i);
    const sendButton = screen.getByRole('button', { name: /send/i });
    
    fireEvent.change(input, { target: { value: 'Hello, Gemini!' } });
    fireEvent.click(sendButton);
    
    await waitFor(() => {
      expect(screen.getByText('Hello, Gemini!')).toBeInTheDocument();
      expect(screen.getByText('Mocked Gemini response')).toBeInTheDocument();
    });
  });

  it('displays loading state while waiting for response', async () => {
    // Create a promise that resolves after a delay
    const delayedPromise = new Promise(resolve => setTimeout(resolve, 100));
    axios.post.mockImplementationOnce(() => delayedPromise);

    render(<Gemini />);
    
    const input = screen.getByPlaceholderText(/type your message/i);
    const sendButton = screen.getByRole('button', { name: /send/i });
    
    fireEvent.change(input, { target: { value: 'Hello, Gemini!' } });
    fireEvent.click(sendButton);
    
    // Check for loading spinner
    expect(screen.getByRole('status')).toBeInTheDocument();
    
    // Wait for the promise to resolve
    await delayedPromise;
    
    // Wait for the loading state to be removed
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
  });

  it('handles API errors gracefully', async () => {
    axios.post.mockRejectedValueOnce(new Error('API Error'));

    render(<Gemini />);
    
    const input = screen.getByPlaceholderText(/type your message/i);
    const sendButton = screen.getByRole('button', { name: /send/i });
    
    fireEvent.change(input, { target: { value: 'Hello, Gemini!' } });
    fireEvent.click(sendButton);
    
    await waitFor(() => {
      expect(screen.getByText(/error: could not get response from ai/i)).toBeInTheDocument();
    });
  });

  it('sends message on Enter key press', async () => {
    const mockResponse = {
      data: {
        candidates: [{
          content: {
            parts: [{
              text: 'Mocked Gemini response'
            }]
          }
        }]
      }
    };

    axios.post.mockResolvedValueOnce(mockResponse);

    render(<Gemini />);
    
    const input = screen.getByPlaceholderText(/type your message/i);
    
    fireEvent.change(input, { target: { value: 'Hello, Gemini!' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    
    await waitFor(() => {
      expect(screen.getByText('Hello, Gemini!')).toBeInTheDocument();
      expect(screen.getByText('Mocked Gemini response')).toBeInTheDocument();
    });
  });
}); 