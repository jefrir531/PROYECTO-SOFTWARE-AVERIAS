const request = require("supertest");
const express = require("express");
const rutas = require("../../../rutas/sesion");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use("/sesion", rutas);

describe("Rutas Sesión", () => {
  it("GET /sesion/login responde", async () => {
    const res = await request(app).get("/sesion/login");
    expect(res.statusCode).toBe(200);
  });
});