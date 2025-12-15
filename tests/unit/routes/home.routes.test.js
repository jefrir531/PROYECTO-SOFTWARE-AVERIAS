const request = require("supertest");
const express = require("express");
const rutas = require("../../../rutas/home");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use("/", rutas);

describe("Rutas Home", () => {
  it("GET / debe existir", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
  });
});