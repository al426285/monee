import {UserService} from "../../../src/domain/service/UserService";
import { describe, it, expect, beforeAll, beforeEach, afterAll, afterEach,test } from 'vitest';

let userService;
beforeAll(async () => {
    userService = UserService.getInstance();
});

beforeEach(async () => {
  await userService.signUp("al123456@uji.es", "Maria", "MiContrasena64");
});

describe("HU04 - Eliminación de cuenta", () => {
  test("E1 - Válido: elimina la cuenta con sesión abierta", async () => {
    await userService.logIn("al123456@uji.es", "MiContrasena64");
    const result = await userService.deleteUser("al123456@uji.es");
    expect(result).toBe(true);
    const users = await userService.getRegisteredUsers();
    expect(users.some(u => u.email === "al123456@uji.es")).toBe(false);
  });

  test("E3 - Inválido: correo no encontrado", async () => {
    await expect(userService.deleteUser("al654321@uji.es"))
      .rejects.toThrow("EmailNotFoundException");
  });
});
