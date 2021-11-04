import util from 'util'
import {normalize, schema} from 'normalizr'

let holding = {
    id:1212,
    posts:[
    {
        "id":1,
        "usuario":{
            "id":1,
            "nombre":"Bruno",
            "apellido":"Lo Faro",
            "edad":21,
        },
        "comentario":"aguante node js"
    },
    {
        "id":2,
        "usuario":{
            "id":2,
            "nombre":"Bill",
            "apellido":"Evans",
            "edad":54,
        },
        "comentario":"In a sentimental mood is the best jazz standard of all times"
    },
    {
        "id":3,
        "usuario":{
            "id":1,
            "nombre":"Bruno",
            "apellido":"Lo Faro",
            "edad":21,
        },
        "comentario":"You are right, Bill"
    },
    {
        "id":4,
        "usuario":{
            "id":2,
            "nombre":"Bill",
            "apellido":"Evans",
            "edad":54,
        },
        "comentario":"See ya in the jam"
    },
    {
        "id":5,
        "usuario":{
            "id":1,
            "nombre":"Bruno",
            "apellido":"Lo Faro",
            "edad":21,
        },
        "comentario":"See ya!"
    },
    {
        "id":6,
        "usuario":{
            "id":1,
            "nombre":"Bruno",
            "apellido":"Lo Faro",
            "edad":21,
        },
        "comentario":"Ur the best"
    }
    ]
}
const usuarioSchema = new schema.Entity('usuarios')
const comentarioSchema = new schema.Entity('comentarios')
const postSchema = new schema.Entity('posts',{
    usuario: usuarioSchema,
    comentario: comentarioSchema
})
const holdingSchema = new schema.Entity('holding',{
    posts:[postSchema]
})

const holdingNormalizado = normalize(holding,holdingSchema)

function print(objeto) {
    console.log(util.inspect(objeto,false,12,true))
}

console.log("normalizados")

print(holdingNormalizado);

console.log(JSON.stringify(holding).length + ' sin normalizar')
console.log(JSON.stringify(holdingNormalizado).length + ' normalizado')
let longDespues = JSON.stringify(holdingNormalizado).length
let longAntes = JSON.stringify(holding).length
console.log('Compresión:', `${Math.trunc((1 - (longDespues / longAntes)) * 100)} %`);