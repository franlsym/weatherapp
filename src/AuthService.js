class AuthService {
  login() {
    throw new Error("AuthService is abstract");
  }
}

export class AuthServiceApi extends AuthService {
  async login(username, password) {
    const response = await fetch("http://localhost:4000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(`Login failed: ${data.message}`);
    }
  }
}

export class AuthServiceFake extends AuthService {
  async login(username, password) {}
}
