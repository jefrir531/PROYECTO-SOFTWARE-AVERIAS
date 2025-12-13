// module.exports=(req,res,next)=>{
//     if(req.isAuthenticated()){
//         res.locals.imagenPerfil = req.user.imagen;
//         return next();
//     }
//     res.redirect("/sesion/login")

// }

const usuariosBD = require("../modelos/usuariosBD");

module.exports = async (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.redirect("/sesion/login");
    }

    try {
        const user = await usuariosBD.findById(req.user.id);
        res.locals.imagenPerfil = user?.imagen || null;
    } catch (error) {
        res.locals.imagenPerfil = null;
    }

    next();
};