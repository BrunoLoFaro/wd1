const mongoose = require('mongoose')
const productosCollection = 'productos'
const productoSchema = new mongoose.Schema({
    //timestamp:{type:String, require: true, max:100},
    nombre:{type:String, require: true, max:100},
    precio:{type:Number, require: true, max:5000},
    foto:{type:String, require: true, max:100},
    descripcion:{type:String, require: true, max:100},
    codigo:{type:String, require: true, max:100},
    id:{type:Number, require: true}
})

const productos = mongoose.model(productosCollection, productoSchema);
exports.productos=productos