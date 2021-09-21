export class ListaProductos{
    #vLista
    constructor(vProductos){
        this.vLista=vProductos
    }
    getProductos(){
        return this.vLista
    }
    getProducto(id){
        let busq= this.vLista.find(x=>x.id==id)
        return busq
    }
    setProducto(prod, id){
        try{
            prod.id=id
            this.vLista.push(prod)
        }
        catch(err){
            console.log(err)
        }
        let busq= this.vLista.find(x=>x.id==id)
        return busq
    }
    updateProducto(prod, id){
        try{
            let index = this.vLista.findIndex(x=>x.id==id)
            this.vLista[index]=prod
            return this.vLista[index]
        }
        catch(err){
            console.log(err)
        }
    }
    eliminateProducto(id){
        try{
            let index = this.vLista.findIndex(x=>x.id==id)
            //shallow copy. El objeto se borra con splice y una referencia no me sirve. 
            var auxEliminado = JSON.parse(JSON.stringify(this.vLista[index]));
            this.vLista.splice(index,1)
            for(let i=index;i<this.vLista.length;i++)
            this.vLista[i].id--
        }
        catch(err){
            console.log(err)
        }
        return auxEliminado
    }
}

let vLote =
[
	{
		title: "vaso",
		price: 124,
		thumbnail: "https://w7.pngwing.com/pngs/859/290/png-transparent-table-glass-drawing-idea-glass-angle-white-thumbnail.png",
		id: 1
	},
	{
		title: "reloj",
		price: 434,
		thumbnail: "https://e7.pngegg.com/pngimages/764/942/png-clipart-alarm-clocks-watch-manecilla-clock-alarm-clocks-watch.png",
		id: 2
	},
	{
		title: "miel",
		price: 72,
		thumbnail: "https://cdn-icons-png.flaticon.com/512/1378/1378481.png",
		id: 3
	}
]
let listaProd = new ListaProductos(vLote)

export {vLote, listaProd}