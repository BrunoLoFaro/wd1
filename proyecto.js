//-----imports-----
import express from 'express';
const app = express();
import handlebars from 'express-handlebars'
import { ListaProductos,vLote, listaProd } from './claseProducto.js';
import {Archivo} from './claseArchivo.js';
import http1 from 'http'
const http = http1.Server(app)
import { Server } from "socket.io";
const io = new Server(http);
import validator from 'email-validator'
import moment from 'moment'

//import options, * as options2 from './options/SQLite3.js';
import options from './options/SQLite3.js';
import knex_ from 'knex';
const knex = knex_(options)

const PORT = 8080//process.env.PORT
const router = express.Router();
const server = http.listen(PORT,()=>console.log('SERVER ON '+PORT))
        
let archMensajes = new Archivo("mensajes.txt");


//-----websocket triggers-----
    io.on('connection', (socket)=> {
        console.log(`conectado, cliente: ${socket}`)
        archMensajes.leer().then((mensajes_guardados)=>{
            io.sockets.emit('mensajes', mensajes_guardados);
        })

        socket.emit('productos',listaProd.getProductos())

            socket.on('producto',data=>{
                listaProd.setProducto(data)
                    io.sockets.emit('producto',data)
            })

        socket.on('nuevo-mensaje', (data)=>{
            let tiempo = moment().format('DD/MM/YYYY, HH:MM:SS a');
            data.tiempo = tiempo
            archMensajes.guardar(data).then(()=>{
                archMensajes.leer().then((vMensajes)=>{
                io.sockets.emit('mensajes', vMensajes);
                })
            });
        })
        socket.on('vaciar',data=>{
            listaProd.empty();
            socket.emit('productos',lista)       
        })       
    })



//-----handlebar config-----
server.on('error', error=>console.log('Error en servidor', error));
app.use(express.urlencoded({extended: false}));
app.use(express.static('views'));
app.engine(
    "hbs",
    handlebars({
        extname: ".hbs",
        defaultLayout: "index.hbs",
        layoutsDir: "views/layouts",
        partialsDir: "views/partials"
    })
);
app.set('views', 'views'); // especifica el directorio de vistas
app.set('view engine', 'hbs'); // registra el motor de plantillas
app.use('/api', router);




//-----comportamiento de la pagina a los metodos http-----
app.get('/', (req,res)=>{
    var scripts = '/layouts/index.js';
    res.render('main',{script: scripts});
});

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

