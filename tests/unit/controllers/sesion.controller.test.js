const usuariosBD = require("../../../modelos/usuariosBD");
const { sesionUsuario } = require("../../../constroladores/controlador_sesion");

jest.mock("../../modelos/usuariosBD");

describe("Controlador Sesión", () => {

  it("no permite login si usuario no existe", async () => {
    usuariosBD.findOne.mockResolvedValue(null);

    const req = {
      body: { correo: "x@test.com", password: "123" },
      flash: jest.fn()
    };

    const res = { redirect: jest.fn() };

    await sesionUsuario(req, res);

    expect(res.redirect).toHaveBeenCalledWith("/sesion/login");
  });

});