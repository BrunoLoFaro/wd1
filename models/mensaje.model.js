import mongoose from 'mongoose'
import {autorschema} from './autor.model.js'
const mensajesCollection = 'mensajes'
const mensajeschema = new mongoose.Schema({
    author: autorschema,
    creadoEn: {type:String, require: true, max:100},
    text: {type:String, require: true, max:100}
}/*,{ timestamps: { createdAt: 'created_at' } }*/)

export const mensajes = mongoose.model(mensajesCollection, mensajeschema);