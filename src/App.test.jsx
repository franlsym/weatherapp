import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import {LoginForm} from './App'; 

test('renders login form', () => {
  render(<LoginForm onLogin={jest.fn()} error={null} />);
  expect(screen.getByPlaceholderText(/Username/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
  expect(screen.getByText(/Login/i)).toBeInTheDocument();
});

test('displays error message', () => {
  const errorMessage = 'Invalid credentials';
  render(<LoginForm onLogin={jest.fn()} error={errorMessage} />);
  expect(screen.getByText(errorMessage)).toBeInTheDocument();
});

test('calls onLogin with username and password', () => {
  const mockOnLogin = jest.fn();
  render(<LoginForm onLogin={mockOnLogin} error={null} />);

  fireEvent.change(screen.getByPlaceholderText(/Username/i), { target: { value: 'testuser' } });
  fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: 'password' } });
  fireEvent.click(screen.getByText(/Login/i));

  expect(mockOnLogin).toHaveBeenCalledWith('testuser', 'password');
});
