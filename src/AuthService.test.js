import { AuthServiceApi } from "./AuthService";

test("works with the right username and password", async () => {
  const authService = new AuthServiceApi();

  const result = authService.login("user", "password");

  await expect(result).resolves.not.toThrow();
});

test("fails with the wrong password", async () => {
  const authService = new AuthServiceApi();

  const result = authService.login("user", "wrongpassword");

  await expect(result).rejects.toThrow("Login failed: Invalid credentials");
});
