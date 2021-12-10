const mongoose = require('mongoose')
const autoresCollection = 'autores'
const autorschema = new mongoose.Schema({
    id:{type:String, require: true, max:100},
    nombre:{type:String, require: true},
    apellido:{type:String, require: true},
    edad:{type:Number, require: true},
    alias:{type:String, require: true, max:100},
    avatar:{type:String, require: true, max:100}
    }
)
exports.autorschema=autorschema
const autores = mongoose.model(autoresCollection, autorschema);
exports.autores=autores