import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { WeatherApp } from "./App";
import { CompassFake } from "./Compass";
import { WeatherServiceFake } from "./WeatherService";
import { AuthServiceFake } from "./AuthService";

test("calls onLogin with username and password", async () => {
  const user = userEvent.setup();

  render(
    <WeatherApp
      compass={new CompassFake()}
      weatherService={new WeatherServiceFake()}
      authService={new AuthServiceFake()}
    />
  );

  await user.type(screen.getByPlaceholderText(/Username/i), "user");
  await user.type(screen.getByPlaceholderText(/Password/i), "password");
  await user.click(screen.getByText(/Login/i));

  expect(
    await screen.findByRole("heading", { name: /Current Weather/ })
  ).toBeInTheDocument();
  expect(await screen.findByText(/Temperature: 20°C/i)).toBeInTheDocument();
  // Temperature: 24°C
  // Condition: Sunny
});
