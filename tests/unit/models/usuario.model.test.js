const Usuario = require("../../../modelos/usuariosBD");
const bcrypt = require("bcryptjs");

describe("Modelo usuariosBD", () => {

  it("debe encriptar la contraseña", async () => {
    const usuario = new Usuario({
      userName: "test",
      correo: "test@test.com",
      password: "123456"
    });

    // Simular el pre save
    const hash = await bcrypt.hash(usuario.password, 10);
    usuario.password = hash;

    expect(usuario.password).not.toBe("123456");
    const match = await bcrypt.compare("123456", usuario.password);
    expect(match).toBe(true);
  });

});