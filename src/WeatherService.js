class WeatherService {
  /**
   * Gets the weather
   * @param {{latitude: number, longitude: number}} position
   */
  async getWeather(position) {
    throw new Error("WeatherService is abstract");
  }
}

export class WeatherServiceApi {
  /**
   * Gets the weather
   * @param {{latitude: number, longitude: number}} position
   * @returns {Promise<{temperature: number, condition: string}>}
   */
  async getWeather(position) {
    const response = await fetch(
      `http://localhost:4000/weather?lat=${position.latitude}&lon=${position.longitude}`
    );

    return response.json();
  }
}

export class WeatherServiceFake {
  /**
   * Gets the weather
   * @param {{latitude: number, longitude: number}} position
   * @returns {Promise<{temperature: number, condition: string}>}
   */
  async getWeather(position) {
    return { temperature: 20, condition: "Sunny" };
  }
}
