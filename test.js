import util from 'util'
import {normalize, schema} from 'normalizr'

let holding = {
    id:1212,
    posts:[
    {
        "_id":1,
        "usuario":{
            "_id":1,
            "nombre":"Bruno",
            "apellido":"Lo Faro",
            "edad":21,
        },
        "comentario":"aguante node js"
    },
    {
        "_id":2,
        "usuario":{
            "_id":2,
            "nombre":"Bill",
            "apellido":"Evans",
            "edad":54,
        },
        "comentario":"In a sentimental mood is the best jazz standard of all times"
    },
    {
        "_id":3,
        "usuario":{
            "_id":1,
            "nombre":"Bruno",
            "apellido":"Lo Faro",
            "edad":21,
        },
        "comentario":"You are right, Bill"
    },
    {
        "_id":4,
        "usuario":{
            "_id":2,
            "nombre":"Bill",
            "apellido":"Evans",
            "edad":54,
        },
        "comentario":"See ya in the jam"
    },
    {
        "_id":5,
        "usuario":{
            "_id": 1,
            "nombre":"Bruno",
            "apellido":"Lo Faro",
            "edad":21,
        },
        "comentario":"See ya!"
    },
    {
        "_id":6,
        "usuario":{
            "_id": 1,
            "nombre":"Bruno",
            "apellido":"Lo Faro",
            "edad":21,
        },
        "comentario":"Ur the best"
    }
    ]
}
/*,{idAttribute:'id'}*/
const usuarioSchema = new schema.Entity('usuarios',{},{idAttribute:'_id'})
const comentarioSchema = new schema.Entity('comentarios')
const postSchema = new schema.Entity('posts',{
    usuario: usuarioSchema,
    comentario: comentarioSchema
},{idAttribute:'_id'})
const holdingSchema = new schema.Entity('holding',{
    posts:[postSchema]
})

const holdingNormalizado = normalize(holding,holdingSchema)

function print(objeto) {
    console.log(util.inspect(objeto,false,12,true))
}

console.log("sin normalizar")
print(holding);
console.log("normalizado")
print(holdingNormalizado);



let longAntes = JSON.stringify(holding).length
let longDespues = JSON.stringify(holdingNormalizado).length
console.log(longAntes)
console.log(longDespues)
console.log('Compresión:', `${Math.trunc((1 - (longDespues / longAntes)) * 100)} %`);