import mongoose from 'mongoose'
const mensajesCollection = 'mensajes'
const mensajeschema = new mongoose.Schema({
    id:{type:Number, require: true},
    mail:{type:String, require: true, max:100},
    mensaje:{type:String, require: true, max:100},
    tiempo:{type:String, require: true, max:100}
})

export const mensajes = mongoose.model(mensajesCollection, mensajeschema);