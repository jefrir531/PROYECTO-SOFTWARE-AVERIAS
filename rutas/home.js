const express=require("express");
const { leerAveria, agregarAveria, eliminarAveria, editarAveria, editarAveriaForm, descargar } = require("../constroladores/controlador_home");

const ruta=express.Router();

ruta.get("/",leerAveria)
ruta.post("/",agregarAveria)
ruta.get("/eliminar/:id",eliminarAveria) //el params es el id que se le esta pasando
ruta.get("/editar/:id",editarAveria)
ruta.post("/editar/:id",editarAveriaForm)
ruta.get("/descargar/:id",descargar)

module.exports=ruta;