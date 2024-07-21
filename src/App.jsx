import React, { useState, useEffect } from "react";
import { CompassNavigator } from "./Compass";
import { WeatherServiceApi } from "./WeatherService";
import { AuthServiceApi } from "./AuthService";

export const WeatherApp = ({
  compass = new CompassNavigator(),
  weatherService = new WeatherServiceApi(),
  authService = new AuthServiceApi(),
} = {}) => {
  const [weather, setWeather] = useState(null);
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (isLoggedIn && location) {
      weatherService
        .getWeather(location)
        .then(setWeather)
        .catch((err) => setError(err.message));
    }
  }, [location, isLoggedIn]);

  const handleLogin = async (username, password) => {
    authService
      .login(username, password)
      .then(() => setIsLoggedIn(true))
      .then(() => compass.getCurrentPosition())
      .then(setLocation)
      .catch((err) => setError(err.message));
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

export const LoginForm = ({ onLogin, error }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(username, password);
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p style={{ color: "red" }}>{error}</p>}
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
