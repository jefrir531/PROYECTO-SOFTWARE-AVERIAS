const AveriaBD = require("../../modelos/AveriaBD");
const {
  leerAveria,
  agregarAveria,
  eliminarAveria
} = require("../../constroladores/controlador_home");

jest.mock("../../modelos/AveriaBD");

describe("Controlador Averías", () => {

  it("leerAveria debe renderizar home con averías", async () => {
    AveriaBD.find.mockResolvedValue([{ asunto: "Test" }]);

    const req = { user: { id: "123" }, flash: jest.fn() };
    const res = { render: jest.fn() };

    await leerAveria(req, res);

    expect(res.render).toHaveBeenCalledWith("home", {
      lista_tickets: [{ asunto: "Test" }]
    });
  });

  it("agregarAveria debe guardar y redirigir", async () => {
    AveriaBD.mockImplementation(() => ({
      save: jest.fn()
    }));

    const req = {
      body: {},
      user: { id: "123" },
      flash: jest.fn()
    };

    const res = { redirect: jest.fn() };

    await agregarAveria(req, res);

    expect(res.redirect).toHaveBeenCalledWith("/");
  });

  it("eliminarAveria debe eliminar si es dueño", async () => {
    AveriaBD.findById.mockResolvedValue({
      usuario: { equals: () => true },
      deleteOne: jest.fn()
    });

    const req = { params: { id: "1" }, user: { id: "1" }, flash: jest.fn() };
    const res = { redirect: jest.fn() };

    await eliminarAveria(req, res);

    expect(res.redirect).toHaveBeenCalledWith("/");
  });

});