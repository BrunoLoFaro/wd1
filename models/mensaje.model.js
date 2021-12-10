const mongoose = require('mongoose')
const autorModel = require('./autor.model.js')
autorschema = autorModel.autorschema

const mensajesCollection = 'mensajes'
const mensajeschema = new mongoose.Schema({
    author: autorschema,
    creadoEn: {type:String, require: true, max:100},
    text: {type:String, require: true, max:100}
}/*,{ timestamps: { createdAt: 'created_at' } }*/)

const mensajes = mongoose.model(mensajesCollection, mensajeschema);
exports.mensajes=mensajes