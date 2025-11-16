const express=require("express")
const ruta=express.Router();

ruta.get("/",(req,res)=>{
    res.render("componentes/form")
})

module.exports=ruta;