const usuariosBD = require("../modelos/usuariosBD")
const {validationResult} = require("express-validator")
const {nanoid}=require("nanoid")
const nodemailer=require("nodemailer")
require("dotenv").config()


const formularioRegistro=(req,res)=>{
    res.render("registro",{ocultarMenu: true})
}

const registroUsuario=async(req,res)=>{

    const errors=validationResult(req)
    if(!errors.isEmpty()){
        req.flash("mensajes",errors.array());
        return res.redirect("/sesion/registro")
    }
    
    const {userName,correo,password} =req.body
    try {
        let usuario = await usuariosBD.findOne({correo:correo})
        if(usuario) throw new Error ("ya existe usuario")

        usuario= new usuariosBD({userName:userName,correo:correo,password:password, tokenConfirm:nanoid()})   
       await usuario.save();

       //enviar correo electronico de confirmacion 
       
            const transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: process.env.USERMAIL,
                pass: process.env.PASSEMAIL
            }
            });

        await transport.sendMail({
            from: '"Fred Foo 👻" <foo@example.com>',
            to: usuario.correo,
            subject: "verifique cuenta de correo",
            // html: `<a href="http://localhost:5000/sesion/confirmarCuenta/${usuario.tokenConfirm}">verificar cuenta aquí</a>`,
            html: `<a href="${process.env.PATHHEROKU || 'http://localhost:5000'}sesion/confirmarCuenta/${usuario.tokenConfirm}">verificar cuenta aquí</a>`,
        });


        req.flash("mensajes",[{msg:"Revisa tu correo electrónico y valida tu cuenta"}]);
        res.redirect("/sesion/login")
    

    } catch (error) {
        req.flash("mensajes",[{msg:error.message}]);
        return res.redirect("/sesion/registro")
        
    }
   
}

const confirmarCuenta=async(req,res)=>{
    const {token}=req.params;

    try {
        const usuario=await usuariosBD.findOne({tokenConfirm:token})
        if(!usuario) throw new Error("No existe este usuario") 

        usuario.cuentaConfirmada=true;
        usuario.tokenConfirm=null

        await usuario.save();

        req.flash("mensajes",[{msg:"Cuenta verificada, ya puedes iniciar sesión"}]);
        return res.redirect("/sesion/login")

    } catch (error) {
        req.flash("mensajes",[{msg:error.message}]);
        return res.redirect("/sesion/login")
        //res.json({error:error.message})
    }


}

const formularioSesion =(req,res)=>{
    res.render("login",{ocultarMenu: true})
}

const sesionUsuario=async(req,res)=>{

    const errors=validationResult(req)
    if(!errors.isEmpty()){
        req.flash("mensajes",errors.array())
        return res.redirect("/sesion/login")
    }
    const {correo,password}=req.body
    try {
        const usuario=await usuariosBD.findOne({correo})
        if(!usuario) throw new Error("Este correo no esta registrado")

        if(!usuario.cuentaConfirmada) throw new Error("Falta confirmar cuenta")
        
        if(!(await usuario.comparePassword(password))) throw new Error("Contraseña incorrecta")

        //me crea la sesion del usuario a traves de passport
        req.login(usuario,function(err){
            if (err) throw new Error("Error al crear el usuario")
            //res.redirect("/") 
            res.redirect("/sesion/intermedio") 
        })
          
        
    } catch (error) {
        //console.log(error)
        req.flash("mensajes",[{msg:error.message}]);
        return res.redirect("/sesion/login")
       // res.send(error.message)
    }
}

const cerrarSesion=(req,res,next)=>{
    req.logout(function(err){
        if(err){
            return next(err);
        }
         return res.redirect("/sesion/login")    
    });
}
   

module.exports={
    formularioSesion,
    formularioRegistro,
    registroUsuario,
    confirmarCuenta,
    sesionUsuario,
    cerrarSesion
}

