const AveriaBD = require("../../modelos/AveriaBD");
const { buscarAveria } = require("../../constroladores/controlador_rastreo");

jest.mock("../../modelos/AveriaBD");

describe("Controlador Rastreo", () => {

  it("redirige si no hay código", async () => {
    const req = {
      body: {},
      user: { id: "1" },
      flash: jest.fn()
    };
    const res = { redirect: jest.fn() };

    await buscarAveria(req, res);

    expect(res.redirect).toHaveBeenCalledWith("/rastreo");
  });

});