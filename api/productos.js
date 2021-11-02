import {generador} from'../generador/productos.js'
import {nextId,getFecha,getIndex} from '../util.js'
 
//import {productos} from '../models/productos.js'

export let generar = async function (req){
    let cant = 10 /*req.params.cant || 50;*/
    let productos = [];
    for (let i=0; i<cant; i++){
        let producto = generador();
        producto.id = i + 1;
        productos.push(producto);
    }
    return productos;
}

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