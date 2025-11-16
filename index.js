const express=require("express")
const {create} = require("express-handlebars")
const path=require("path")
require("dotenv").config()
require("./base_datos/bd")

const app=express();
const hbs=create({
    extname:".hbs",
    partialsDir:["vistas/componentes"],
});

app.engine(".hbs",hbs.engine);
app.set("view engine",".hbs")
app.set("views","./vistas")




const puerto=5000;




app.use(express.urlencoded({extended:true}))
app.use("/",require("./rutas/home"))
app.use("/sesion",require("./rutas/sesion"))
app.use("/formato_creaAveria",require("./rutas/agregarAverias"))

app.use(express.static(path.join(__dirname + "/public")))

const PORT=process.env.PORT||5000;
app.listen(PORT,()=>{
    console.log("servidor iniciado " + PORT)
})