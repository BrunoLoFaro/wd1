//import {generadorProd, generadorMensaje} from'../generador/productos.js'
//import {nextId,getFecha,getIndex} from '../util.js'

const gProd = require('../generador/productos.js')
let generadorProd = gProd.generadorProd
let generadorMensaje = gProd.generadorMensaje

const util = require('../util.js')
let nextId = util.nextId
let getFecha = util.getFecha
let getIndex = util.getIndex

//import {productos} from '../models/productos.js'

async function generar (req=10, generador){
    let cant = req /*req.params.cant || 50;*/
    let vec = [];
    for (let i=0; i<cant; i++){
        let elem = generador();
        elem.id = i + 1;
        vec.push(elem);
    }
    return vec;
}
exports.generar = generar

let genProd = generar(10, generadorProd)
let genMsj = generar(10, generadorMensaje)
exports.genProd = genProd
exports.genMsj = genMsj
/*
export const get = (req, res) => {
    let id = Number(req.params.id);
    if (id) {
        let index = util.getIndex(id, productos);
        let producto = productos[index];
        res.send(producto);
    } else {
        res.send(productos);
    }
}*/