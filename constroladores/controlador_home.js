const AveriaBD =require("../modelos/AveriaBD")
const fs=require("fs")

const leerAveria=async(req,res)=>{
        try {
            const lista_tickets=await AveriaBD.find({usuario:req.user.id}).lean()
            res.render("home",{lista_tickets:lista_tickets})
        } catch (error) {
            // console.log(error)
            // res.send("algo fallo")
            req.flash("mensajes",[{msg:error.message}]);
            return res.redirect("/")
        }
       
};

const agregarAveria=async(req,res)=>{
        const {asunto,codigo,solicitante,descripcion,fecha}=req.body
    try {
        const averia=new AveriaBD({
            asunto:asunto,
            codigo:codigo,
            solicitante:solicitante,
            descripcion:descripcion,
            fecha:fecha,
            usuario:req.user.id
    })
        await averia.save()
        req.flash("mensajes",[{msg:"Averia agregada correctamente"}]);
        res.redirect("/")
    } catch (error) {
        req.flash("mensajes",[{msg:"Error al cargar la avería"}]);
        return res.redirect("/formato_creaAveria")
    }
}

const eliminarAveria=async(req,res)=>{
    const {id} =req.params
    try {
       // await AveriaBD.findByIdAndDelete(id)
        const averia=await AveriaBD.findById(id)
        if(!averia.usuario.equals(req.user.id)){
            throw new Error("No es tu averia")
        }
        await averia.deleteOne({_id:id})
        req.flash("mensajes",[{msg:"Averia eliminada correctamente"}]);
        return res.redirect("/");
    } catch (error) {
        req.flash("mensajes",[{msg:"Hubo una falla al eliminar"}]);
        return res.redirect("/")
    }
}

const editarAveria=async(req,res)=>{
        const{id}=req.params;
    try {
        const averia= await AveriaBD.findById(id).lean()
        res.render("componentes/form",{averia})
    } catch (error) {
            req.flash("mensajes",[{msg:"No se puedo editar"}]);
            return res.redirect("/")
    }
}

const editarAveriaForm=async(req,res)=>{
        const{id}=req.params;
        const{asunto,codigo,solicitante,descripcion,fecha} =req.body
    try {
        await AveriaBD.findByIdAndUpdate(id,{
            asunto:asunto,
            codigo:codigo,
            solicitante:solicitante,
            descripcion:descripcion,
            fecha:fecha
        })
        req.flash("mensajes",[{msg:"Averia editada correctamente"}]);
        res.redirect("/");
    } catch (error) {
            req.flash("mensajes",[{msg:error.message}]);
            return res.redirect("/")
        }
}

    const descargar=async(req,res)=>{
        const{id}=req.params; 
        try{
        const averia= await AveriaBD.findById(id).lean()  
        if(!averia) return res.send("averia no encontrada")
        const contenido=`
            asunto:${averia.asunto},
            codigo:${averia.codigo},
            solicitante:${averia.solicitante},
            descripcion:${averia.descripcion},
            fecha:${averia.fecha} ;  `   
            
            fs.writeFileSync(`${id}.txt`,contenido, "utf8");
            console.log("Archivo creado correctamente ",`${id}.txt` )
         /*
        await fs.writeFile(`${id}.txt`, contenido,(err)=>{
            if (err) {
                    console.log(err);
                    return res.send("Error al crear el archivo");
            }
            })*/
            res.download(`${id}.txt`,(err) => {
            if (err) console.log("Error al descargar:", err)})
            }catch(error){
                req.flash("mensajes",[{msg:"Error al descargar"}]);
                return res.redirect("/")   
        }
    }

module.exports={
    leerAveria,
    agregarAveria,
    eliminarAveria,
    editarAveria,
    editarAveriaForm,
    descargar
}