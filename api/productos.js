import generador from'../generador/usuarios'
import util from '../util'
 
import usuarios from '../model/usuarios'

export const generar = (req, res) => {
    let cant = req.params.cant || 50;
    usuarios = [];
    for (let i=0; i<cant; i++){
        let usuario = generador.get();
        usuario.id = i + 1;
        usuario.fecha = util.getFecha();
        usuarios.push(usuario);
    }
    res.send(usuarios);
}

export const get = (req, res) => {
    let id = Number(req.params.id);
    if (id) {
        let index = util.getIndex(id, usuarios);
        let usuario = usuarios[index];
        res.send(usuario);
    } else {
        res.send(usuarios);
    }
}