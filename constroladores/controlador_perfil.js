const formidable = require("formidable");
const Jimp=require("jimp").Jimp
const path = require("path")
const usuariosBD=require("../modelos/usuariosBD")
const fs=require("fs");
const { dir } = require("console");

module.exports.formulario_perfil=async(req,res)=>{
    try {
        const user= await usuariosBD.findById(req.user.id);
        return res.render("perfil",{user:req.user,imagen:user.imagen})
        
    } catch (error) {
            req.flash("mensajes", [{ msg: "Error al leer el usuario" }]);
            return res.redirect("/perfil");
    }
    
    //res.render("perfil")
}

module.exports.editarFotoPerfil=async(req,res)=>{
    const form = new formidable.IncomingForm();

    //form.maxFileSize = 50 * 1024 * 1024; // 5MB

    form.parse(req, async (err, fields, files) => {
        try{
        if (err) {
            throw new Error("fallo la subida de imagen")
        }
        console.log(fields);
        //console.log(files);
        const file=files.myFile[0]

        if(file.originalFilename===""){
            throw new Error("Por favor agregar una imagen")
        };

        // if(!(file.mimetype==="image/jpeg" ||file.mimetype==="image/png" )){
        //     throw new Error("Por favor agregar una imagen .jpg o png")
        // }


        const imageTypes=["image/jpeg","image/png"]


        if(!imageTypes.includes(file.mimetype)){
            throw new Error("Por favor agregar una imagen .jpg o png")
        }

        if(file.size>50*1024*1024){
            throw new Error("Menos de 5MB por favor")  
        }

        const extension=file.mimetype.split("/")[1]
        const dirFile=path.join(__dirname,`../public/imagenes/perfiles/${req.user.id}.${extension}`);
        console.log(dirFile)

        fs.copyFileSync(file.filepath, dirFile);  // Copia de C → D
        fs.unlinkSync(file.filepath);

        const imagen = await Jimp.read(dirFile);
        imagen.resize({w:200,h:200});
       // console.log("despues del rezise")
        //imagen.quality (80).
        //imagen.writeAsync(dirFile);
        await imagen.write(dirFile)

        const user = await usuariosBD.findById(req.user.id);
        user.imagen =`${req.user.id}.${extension}`;
        await user.save()



            req.flash("mensajes", [{ msg: "ya se subio la imagen" }]);
            return res.redirect("/perfil");
        }catch(error){
            req.flash("mensajes", [{ msg: error.message}])   
            return res.redirect("/perfil")  }   
        // }finally{
        //     return res.redirect("/perfil")
        // }

})
}

