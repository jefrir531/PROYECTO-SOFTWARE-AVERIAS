const express=require("express");
const {body} =require("express-validator")
const { formularioSesion, formularioRegistro, registroUsuario,confirmarCuenta,sesionUsuario, cerrarSesion } = require("../constroladores/controlador_sesion");
const { ExpressValidator } = require("express-validator");
const verificarUsuario = require("../middlewares/verificarUsuario");
const ruta=express.Router();


ruta.get("/registro",formularioRegistro)
ruta.post("/registro",[ //middleware
    body("userName", "Ingrese un nombre valido").trim().notEmpty().escape(),
    body("correo", "Ingrese un correo valido").trim().isEmail().normalizeEmail(),
    body("password", "Ingrese una contraseña de minimo 6 caracteres").trim().isLength({min:6}).escape().custom((value,{req})=>{
        if (value!==req.body.repassword){
            throw new Error("No coinciden las contraseñas")
        } else{
            return value;
        }
       

    })
],
    registroUsuario)
ruta.get("/confirmarCuenta/:token", confirmarCuenta)
ruta.get("/login",formularioSesion);    
ruta.post("/login", [
            body("correo", "Ingrese un correo valido").trim().isEmail().normalizeEmail(),
            body("password", "Ingrese una contraseña de minimo 6 caracteres").trim().isLength({min:6}).escape()
            ],sesionUsuario);


ruta.get("/intermedio",verificarUsuario, (req, res) => {
    res.render("intermedio"); 
});

ruta.get("/logout",cerrarSesion)

module.exports=ruta;