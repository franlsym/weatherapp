import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { WeatherApp } from './App';

// Mock the fetch function
global.fetch = jest.fn();

describe('WeatherApp Integration Test', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('logs in successfully and displays weather data', async () => {
    // Mock successful login response
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve({ success: true, message: 'Login successful' }),
      })
    );

    // Mock successful weather data response
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve({ temperature: 25, condition: 'Sunny' }),
      })
    );

    // Mock geolocation
    const mockGeolocation = {
      getCurrentPosition: jest.fn().mockImplementationOnce((success) =>
        success({ coords: { latitude: 40.7128, longitude: -74.0060 } })
      ),
    };
    global.navigator.geolocation = mockGeolocation;

    render(<WeatherApp />);

    // Check if login form is displayed
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();

    // Fill in login form and submit
    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password' } });
    fireEvent.click(screen.getByText('Login'));

    // Wait for weather data to be displayed
    await waitFor(async () => {
      await expect(screen.getByText('Current Weather')).toBeInTheDocument();
      await expect(screen.getByText('Temperature: 25°C')).toBeInTheDocument();
      await expect(screen.getByText('Condition: Sunny')).toBeInTheDocument();
    });

    // Verify that fetch was called twice (once for login, once for weather)
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it('displays error message on login failure', async () => {
    // Mock failed login response
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve({ success: false, message: 'Invalid credentials' }),
      })
    );

    render(<WeatherApp />);

    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'wronguser' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'wrongpass' } });
    fireEvent.click(screen.getByText('Login'));

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });

    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('handles geolocation error', async () => {
    // Mock successful login response
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve({ success: true, message: 'Login successful' }),
      })
    );

    // Mock geolocation error
    const mockGeolocation = {
      getCurrentPosition: jest.fn().mockImplementationOnce((success, error) =>
        error({ message: 'Geolocation error' })
      ),
    };
    global.navigator.geolocation = mockGeolocation;

    render(<WeatherApp />);

    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password' } });
    fireEvent.click(screen.getByText('Login'));

    await waitFor(() => {
      expect(screen.getByText('Error: Geolocation error')).toBeInTheDocument();
    });

    expect(fetch).toHaveBeenCalledTimes(1);
  });
});
