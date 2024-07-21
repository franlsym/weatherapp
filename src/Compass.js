class Compass {
  /**
   * @returns {Promise<{latitude: number, longitude: number}>} The current position
   */
  async getCurrentPosition() {
    throw new Error("Compass is abstract");
  }
}

export class CompassNavigator extends Compass {
  /**
   * @returns {Promise<{latitude: number, longitude: number}>} The current position
   */
  async getCurrentPosition() {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) =>
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }),
        (err) => reject(err)
      );
    });
  }
}

export class CompassFake extends Compass {
  async getCurrentPosition() {
    return Promise.resolve({ latitude: 28.133754, longitude: -15.438094 });
  }
}
