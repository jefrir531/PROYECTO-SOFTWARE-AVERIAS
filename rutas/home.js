const express=require("express");
const { leerAveria, agregarAveria, eliminarAveria, editarAveria, editarAveriaForm, descargar } = require("../constroladores/controlador_home");
const verificarUsuario = require("../middlewares/verificarUsuario");
const { formulario_perfil, editarFotoPerfil, editarPerfil } = require("../constroladores/controlador_perfil");
const { buscarAveria } = require("../constroladores/controlador_rastreo");
const { rastreo } = require("../constroladores/controlador_rastreo");

const ruta=express.Router();

ruta.get("/",verificarUsuario,leerAveria)
ruta.post("/",verificarUsuario,agregarAveria)
ruta.get("/eliminar/:id",verificarUsuario,eliminarAveria) //el params es el id que se le esta pasando
ruta.get("/editar/:id",verificarUsuario,editarAveria)
ruta.post("/editar/:id",verificarUsuario,editarAveriaForm)
ruta.get("/descargar/:id",descargar)

ruta.get("/perfil",verificarUsuario,formulario_perfil)
ruta.post("/perfil",verificarUsuario,editarFotoPerfil)

ruta.get("/rastreo",verificarUsuario,rastreo)
ruta.post("/rastreo",verificarUsuario,buscarAveria)

module.exports=ruta;