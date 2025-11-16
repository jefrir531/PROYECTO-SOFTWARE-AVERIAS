const express=require("express")
const ruta=express.Router();

ruta.get("/login",(req,res)=>{
    res.render("login")
})

module.exports=ruta;