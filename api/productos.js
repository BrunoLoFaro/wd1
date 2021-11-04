import {generadorProd, generadorMensaje} from'../generador/productos.js'
import {nextId,getFecha,getIndex} from '../util.js'
 
//import {productos} from '../models/productos.js'

export async function generar (req=10, generador){
    let cant = req /*req.params.cant || 50;*/
    let vec = [];
    for (let i=0; i<cant; i++){
        let elem = generador();
        elem.id = i + 1;
        vec.push(elem);
    }
    return vec;
}
export let genProd = generar(10, generadorProd)
export let genMsj = generar(10, generadorMensaje)
/*
var mensaje = {
    author: {
        id:'mail del usuario',
        nombre:'nombre del usuario',
        apellido:'apelldio del usuario',
        edad:'edad del usuario',
        alias:'alisa del usuario',
        avatar:'url avatar (foto, logo) del usuario',
    },
    text: 'mensaje del usuario'
}
*/
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