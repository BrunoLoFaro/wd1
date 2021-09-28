import fs from 'fs'

class archivo{
    constructor(nombre="gen.txt",vector=[]){
        this.nombre=nombre
        this.vector=vector
    }

    async leer(mostrar=true){
        try{
            let lect = await fs.promises.readFile(this.nombre,'utf-8')
            this.vector=JSON.parse(lect)
            if(mostrar)
            return this.vector
        }
        catch{
            return []
        }
    }
    async guardar(obj){
        await this.leer(false).catch(()=>fs.promises.writeFile(nombreArch,""))
                obj['id']=this.vector.length+1
                this.vector.push(obj)
                await fs.promises.writeFile(nombreArch,JSON.stringify(this.vector, null, '\t')) 
            }
    async borrar(){
        return await fs.promises.unlink(this.nombre,(e)=>console.log(e+"e"))
    }
}

const nombreArch="./mensajes.txt"
/*
let mensajes = [
    {autor: "Mariano", texto: "Hola a tod@s!"},
    {autor: "Romina", texto: "Buenísimo!!!"},
    {autor: "Dario", texto: "Hay alguien ahi?"}
];*/

let archMensajes = new archivo(nombreArch)

/*
async function cargarLoteArchivo(){
    for(let e of mensajes){
        await archMensajes.guardar(e)
    }
} 
*/

//cargarLoteArchivo()

export {archMensajes}