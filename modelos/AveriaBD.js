const mongoose=require("mongoose")

const {Schema} =mongoose;

const averiaSchema=new Schema({
    asunto:{
        type:String,
        required:true
    },

    codigo:{
        type:String,
        unique:true,
        required:true
    },

    solicitante:{
        type:String,
        required:true
    },

    descripcion:{
        type:String,
        required:true
    },

    fecha:{
        type:String,
        required:true
    },

})

const AveriaBD=mongoose.model("AveriaBd",averiaSchema)
module.exports=AveriaBD