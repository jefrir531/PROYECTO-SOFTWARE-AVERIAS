const request = require("supertest");
const express = require("express");
const session = require("express-session");
const rutasSesion = require("../../rutas/sesion");
const Usuario = require("../../modelos/usuariosBD");
const { connect, close } = require("../setupTestDB");

const app = express();

beforeAll(async () => {
  await connect();

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(session({ secret: "test", resave: false, saveUninitialized: false }));

  app.use("/sesion", rutasSesion);
});

afterAll(async () => {
  await close();
});

describe("Integración Sesión", () => {

  it("registra un usuario", async () => {
    const res = await request(app)
      .post("/sesion/registro")
      .send({
        userName: "test",
        correo: "test@test.com",
        password: "123456",
        repassword: "123456"
      });

    const usuarios = await Usuario.find();
    expect(usuarios.length).toBe(1);
    expect(res.statusCode).toBe(302);
  });

});