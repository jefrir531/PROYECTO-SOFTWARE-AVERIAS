const mongoose=require("mongoose")
const bcrypt=require("bcryptjs")
const {Schema}=mongoose;

const userSchema=new Schema({
    userName:{
        type:String,
        lowercase:true,
        required:true
    },
    correo:{
        type:String,
        lowercase:true,
        required:true,
        unique:true,
        index:{unique:true}
    },

    password:{
        type:String,
        required:true
    },
    tokenConfirm:{
        type:String,
        default:null
    },
    cuentaConfirmada:{
        type:Boolean,
        default:false
    },
    imagen:{
        type:String,
        default:null,
    },
})

userSchema.pre("save", async function(next){ //antes de guardar en la base de datos, se encripte la contraseña
    const usuario=this;
    if(!usuario.isModified("password")) return next()

    try {
        const salto= await bcrypt.genSalt(10)
        const hash= await bcrypt.hash(usuario.password, salto)

        usuario.password=hash
        next()
        
    } catch (error) {
        console.log(error)
        next()
    }    

}) 

userSchema.methods.comparePassword=async function(validaPasswor){
    return await bcrypt.compare(validaPasswor,this.password)
}

module.exports=mongoose.model("usuariosBD",userSchema)