const AveriaBD =require("../modelos/AveriaBD")
const fs=require("fs")

const leerAveria=async(req,res)=>{
        try {
            const lista_tickets=await AveriaBD.find().lean()
            res.render("home",{lista_tickets:lista_tickets})
        } catch (error) {
            console.log(error)
            res.send("algo fallo")
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
            fecha:fecha
    })
        await averia.save()
        res.redirect("/")
    } catch (error) {
        console.log(error)
        res.send("algo fallo")
    }
}

const eliminarAveria=async(req,res)=>{
    const {id} =req.params
    try {
        await AveriaBD.findByIdAndDelete(id)
        res.redirect("/");
    } catch (error) {
        console.log(error)
        res.send("algo fallo")
    }
}

const editarAveria=async(req,res)=>{
        const{id}=req.params;
    try {
        const averia= await AveriaBD.findById(id).lean()
        res.render("componentes/form",{averia})
    } catch (error) {
        console.log(error)
        res.send("algo fallo")
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
        res.redirect("/");
    } catch (error) {
        console.log(error)
        res.send("algo fallo")
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
        console.log(error)
        res.send("algo fallo")   
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