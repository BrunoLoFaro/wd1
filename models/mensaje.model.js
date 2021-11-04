import mongoose from 'mongoose'
import {autorschema} from './autor.model.js'
const mensajesCollection = 'mensajes'
const mensajeschema = new mongoose.Schema({
    author: autorschema,
    text: {type:String, require: true, max:100}
})

export const mensajes = mongoose.model(mensajesCollection, mensajeschema);