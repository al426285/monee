import {loginUser, logoutUser} from "../src/domain/service/UserService.ts";

beforeEach(async () => {
  await registerUser("al123456@uji.es", "Maria", "MiContrasena64");
});

describe("HU03 - Cierre de sesión", () => {
  test("E1 - Válido: cierra la sesión abierta", async () => {
    await loginUser("al123456@uji.es", "MiContrasena64");
    const result = await logoutUser("al123456@uji.es");
    expect(result).toBe(true);
  });

  test("E2 - Inválido: sesión no abierta", async () => {
    await expect(logoutUser("al123456@uji.es"))
      .rejects.toThrow("SessionNotFoundException");
  });
});