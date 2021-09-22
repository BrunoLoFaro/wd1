import express from 'express';
import path from 'path'
import handlebars from 'express-handlebars'
import { ListaProductos,vLote, listaProd } from './claseProducto.js';

const app = express();
const PORT = 8080;
const router = express.Router();

const server = app.listen(PORT, ()=>{
    console.log('Servidor HTTP escuchando en el puerto', server.address().port);
});
server.on('error', error=>console.log('Error en servidor', error));

app.use(express.static('../public'));

app.engine(
    "hbs",
    handlebars({
        extname: ".hbs",
        defaultLayout: "index.hbs",
        layoutsDir: "../views/layouts",
        partialsDir: "../views/partials"
    })
);
app.set('views', '../views'); // especifica el directorio de vistas
app.set('view engine', 'hbs'); // registra el motor de plantillas

app.use('/api', router);


app.get('/', function(req, res){
    res.sendFile('index.html', { root: ''} );
});

app.use(express.urlencoded({extended: true}));



app.get('/productos/listar', (req,res)=>{
    let vProductos
    try{
        vProductos=listaProd.getProductos()
    }
    catch{
        vProductos={}
    }
    res.json({vProductos})
});

app.get('/productos/listar/:id', (req,res)=>{
    let params = req.params;
    let id = params.id;
    let busq;
    try{
        busq= listaProd.getProducto(id)
    }
    catch{
        busq={}
    }
    res.json(busq);
});

app.get('/productos/vista', (req,res)=>{
    let vProductos
    vProductos=listaProd.getProductos()

    res.render('main',{productos: vProductos})
});

app.post('/productos/guardar/',(req,res)=>{
    let body = req.body;
    let vProductos=listaProd.getProductos()
    let pos=vProductos.length
    let id=vProductos[pos-1].id
    let incorporado
    try{
        incorporado = body
        listaProd.setProducto(body,++id)
    }
    catch{
        incorporado={}
    }
    res.json({incorporado});
});

app.put('/productos/actualizar/:id/:titulo/:precio/:imagen', (req,res)=>{
    let params = req.params;
    let id = params.id;
    let prod ={		
        title: params.titulo,//por query los params vienen como string.
        price: parseInt(params.precio),//tendría efecto si usaramos una bd.
        thumbnail: params.imagen,
        id: id, 
    }
    let actualizado
    try{
        listaProd.updateProducto(prod,id)
        actualizado=listaProd.getProducto(id)
    }
    catch{
        actualizado={}     
    }

    res.json({actualizado});
});

app.delete('/productos/eliminar/:id', (req,res)=>{
    let params = req.params;
    let id = params.id;
    let eliminado
    try{
        listaProd.eliminateProducto(id)
        eliminado=listaProd.getProducto(id)
    }
    catch{
        eliminado={}
    }
    res.json({eliminado});
});
