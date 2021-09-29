import fs from 'fs'

export class Archivo{
    constructor(nombre="gen.txt",vector=[]){
        this.nombre=nombre
        this.vector=[]/*
        for(let e of vector){
            this.guardar(e)
        }*/
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
        await this.leer(false).catch(()=>fs.promises.writeFile(this.nombre,""))
                obj['id']=this.vector.length+1
                this.vector.push(obj)
                await fs.promises.writeFile(this.nombre,JSON.stringify(this.vector, null, '\t')) 
            }
    async borrar(){
        return await fs.promises.unlink(this.nombre,(e)=>console.log(e+"e"))
    }
}


//Lote de pruebas

let vLoteMensajes = [
	{
		"mail": "lofarobruno@gmail.com",
		"mensaje": "Por acá se envian mensajes",
		"tiempo": "28/09/2021, 17:09:20 pm",
		"id": 1
	},
	{
		"mail": "lofarobruno@gmail.com",
		"mensaje": "Para enviar uno, hay que completar el campo de mail",
		"tiempo": "28/09/2021, 17:09:30 pm",
		"id": 2
	},
];

function crearLote(nombre, lote){
    let arch=new Archivo(nombre)
    for(let e of lote)
    arch.guardar(e)
}

//crearLote("mensajes.txt",vLoteMensajes)

export {vLoteMensajes}