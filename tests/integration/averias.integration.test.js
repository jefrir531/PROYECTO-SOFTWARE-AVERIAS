const request = require("supertest");
const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const rutasHome = require("../../rutas/home");
const Averia = require("../../modelos/AveriaBD");
const { connect, close } = require("../setupTestDB");

const app = express();

beforeAll(async () => {
  await connect();

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  // Simular sesión y usuario autenticado
  app.use(session({ secret: "test", resave: false, saveUninitialized: false }));
  app.use((req, res, next) => {
    req.user = { id: new mongoose.Types.ObjectId() };
    next();
  });

  app.use("/", rutasHome);
});

afterAll(async () => {
  await close();
});

describe("Integración Averías", () => {

  it("POST / debe crear una avería y redirigir", async () => {
    const res = await request(app)
      .post("/")
      .send({
        asunto: "Error",
        codigo: "A123",
        solicitante: "Juan",
        descripcion: "No funciona",
        fecha: "2025-01-01"
      });

    const averias = await Averia.find();
    expect(averias.length).toBe(1);
    expect(res.statusCode).toBe(302); // redirect
  });

});