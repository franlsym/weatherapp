import React, { useState, useEffect } from 'react';

const WeatherApp = () => {
  const [weather, setWeather] = useState(null);
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (isLoggedIn && location) {
      fetch(`http://localhost:3000/weather?lat=${location.latitude}&lon=${location.longitude}`)
        .then(response => response.json())
        .then(setWeather)
        .catch(err => setError(err.message));
    }
  }, [location, isLoggedIn]);

  const handleLogin = async (username, password) => {
    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (data.success) {
        setIsLoggedIn(true);
        navigator.geolocation.getCurrentPosition(
          (position) => setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }),
          (err) => setError(err.message)
        );
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Login failed');
    }
  };

  if (!isLoggedIn) {
    return <LoginForm onLogin={handleLogin} error={error} />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!weather) {
    return <div>Loading weather data...</div>;
  }

  return (
    <div>
      <h1>Current Weather</h1>
      <p>Temperature: {weather.temperature}°C</p>
      <p>Condition: {weather.condition}</p>
    </div>
  );
};

const LoginForm = ({ onLogin, error }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(username, password);
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p style={{color: 'red'}}>{error}</p>}
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default WeatherApp;
