const Averia = require("../../../modelos/AveriaBD");

describe("Modelo AveriaBD", () => {

  it("debe requerir campos obligatorios", async () => {
    const averia = new Averia({});

    let error;
    try {
      await averia.validate();
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.errors.asunto).toBeDefined();
    expect(error.errors.codigo).toBeDefined();
    expect(error.errors.usuario).toBeDefined();
  });

});
