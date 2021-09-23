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
    setProducto(prod, id=2){
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
    empty(){
        this.vLista.splice(0, this.vLista.length)
    }
}

let vLote =
[
	{
		title: "Kendall - analisis y diseño de sistemas",
		price: 124,
		thumbnail: "http://2.bp.blogspot.com/_n0EM_zLV8hI/SzVkcaB9RxI/AAAAAAAAEzw/Hv37qoPvy7s/s400/Kendall+%26+Kendall+-+Analisis+y+dise%C3%B1o+de+sistemas+-+box.jpg",
		id: 1
	},
	{
		title: "Dan Brown - La fortaleza digital",
		price: 434,
		thumbnail: "https://bibliotecaquijote.files.wordpress.com/2012/02/la-fortaleza-digital.jpg",
		id: 2
	},
	{
		title: "Raymond Chang - Química",
		price: 72,
		thumbnail: "https://contentv2.tap-commerce.com/cover/large/9786071513939_1.jpg?id_com=1113",
		id: 3
	}
]
let listaProd = new ListaProductos(vLote)

export {vLote, listaProd}