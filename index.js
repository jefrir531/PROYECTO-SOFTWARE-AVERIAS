const express=require("express")
const session=require("express-session")
const MongoStore=require("connect-mongo")
const flash=require("connect-flash")
const passport=require("passport")
const csrf=require("csurf")
const crypto = require("crypto");
const cors=require("cors")

const {create} = require("express-handlebars")
const path=require("path")
const usuariosBD = require("./modelos/usuariosBD")
require("dotenv").config()
// require("./base_datos/bd")
const clientDB=require("./base_datos/bd")

const app=express();


const corsOptions={
    credentials:true,
    origin:process.env.PATHHEROKU || "*",
    methods:["GET","POST"]
}
app.use(cors())


app.use(session({
    secret:process.env.SECRETSESSION,
    resave:false,
    saveUninitialized:false,
    name:"session-user",
    store:MongoStore.create({
        clientPromise: clientDB,
        dbName: process.env.DBNAME,
    }),
    cookie :{secure:process.env.MODO==="production", maxAge:30*24*60*60*1000},
}))

//app.use(express.urlencoded({extended:true}))

app.use(flash())

app.use(passport.initialize())
app.use(passport.session())

passport.serializeUser((usuario,done)=>
    done(null,{id:usuario._id,userName:usuario.userName}))
passport.deserializeUser(async (usuario,done)=>{
    const userDB=await usuariosBD.findById(usuario.id);
    return done(null,{id:userDB._id,userName:userDB.userName})
})



const hbs=create({
    extname:".hbs",
    partialsDir:["vistas/componentes"],
});

app.engine(".hbs",hbs.engine);
app.set("view engine",".hbs")
app.set("views","./vistas")





const puerto=5000;




app.use(express.urlencoded({extended:true}))

app.use(csrf())

//original:
//  app.use((req,res,next)=>{
//     res.locals.csrfToken=req.csrfToken();
//     res.locals.mensajes=req.flash("mensajes");
//     next();
// })

app.use((req, res, next) => {
    try {
        res.locals.csrfToken = req.csrfToken();
    } catch (error) {
        res.locals.csrfToken = null; 
    }
    res.locals.mensajes = req.flash("mensajes");
    next();
});


// -----
// app.use((req, res, next) => {
//     if (!req.session.csrfToken) {
//         req.session.csrfToken = crypto.randomBytes(32).toString("hex");
//     }

//     res.locals.csrfToken = req.session.csrfToken;
//     res.locals.mensajes = req.flash("mensajes");
//     next();
// });

// //  PROTECCIÓN CSRF (POST, PUT, DELETE)
// function csrfProtection(req, res, next) {
//     if (req.method === "GET") return next();

//     const tokenCliente = req.body._csrf || req.headers["x-csrf-token"];
//     const tokenServidor = req.session.csrfToken;

//     if (!tokenCliente || tokenCliente !== tokenServidor) {
//         return res.status(403).send("Token CSRF inválido");
//     }

//     next();
// }

// app.use("/sesion", require("./rutas/sesion"));
// app.use(csrfProtection);


app.use("/",require("./rutas/home"))
app.use("/sesion",require("./rutas/sesion"))
app.use("/formato_creaAveria",require("./rutas/agregarAverias"))

app.use(express.static(path.join(__dirname + "/public")))

const PORT=process.env.PORT||5000;
app.listen(PORT,()=>{
    console.log("servidor iniciado " + PORT)
})

//csrfToken:req.csrfToken()