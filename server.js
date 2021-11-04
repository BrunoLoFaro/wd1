import { productosRouter, set } from './routes/productos.routes.js';
//import { handleError } from './middleware/errorHandler.js';
import express from 'express';
const app = express();
//import {generador} from './generador/productos.js'
import handlebars from 'express-handlebars'
import http1 from 'http'
const http = http1.Server(app)
import { Server } from "socket.io";
const io = new Server(http);
import moment from 'moment'
import mongoose from 'mongoose'
import * as productoModel from './models/producto.model.js'
import * as mensajeModel from './models/mensaje.model.js'
import {genProd, genMsj} from "./api/productos.js"
import normalizr from 'normalizr'
import util from 'util'

const normalize = normalizr.normalize
const schema = normalizr.schema;
/* 
author:{
    id: 
    nombre: 
    apellido:
    edad:
    alias:
    avatar:
},
text:''
*/

const autor = new schema.Entity('autores')
const texto = new schema.Entity('textos')
const mensajes = new schema.Entity('mensajes',{
    autor: autor,
    texto: texto
})

async function CRUD (){
    try {
        const URI = 'mongodb://localhost:27017/ecommerce';
        await mongoose.connect(URI, 
            { 
              useNewUrlParser: true,
              useUnifiedTopology: true,
              serverSelectionTimeoutMS: 1000
            })    
        console.log('Conectado a la base de datos...');
        }
    catch(error) {
        console.log("db not running")
        ///throw `Error: ${error}`;
    }
}

CRUD();

const PORT = 8080//process.env.PORT
const server = http.listen(PORT,()=>console.log('SERVER ON '+PORT));

//-----websocket triggers-----
    io.on('connection', (socket)=> {

        console.log(`conectado, cliente: ${socket}`)

        mensajeModel.mensajes.find({}).then((mensajes_guardados)=>{
            io.sockets.emit('mensajes', mensajes_guardados);
            console.log(util.inspect(mensajes_guardados,false,12,true))
            console.log(JSON.stringify(mensajes_guardados).length)
            const normalizado = normalize(mensajes_guardados,mensajes)
            console.log(util.inspect(normalizado,false,12,true))
            console.log(JSON.stringify(normalizado).length + 'normalizado')
        })
        genMsj.then((msjs_guardados)=>{
            io.sockets.emit('mensajes', msjs_guardados)
        })
        /**productoModel.productos.find({}).then((productos_guardados)=>{
            io.sockets.emit('productos', productos_guardados);
        })**/
        
        genProd.then((productos_guardados)=>{
            io.sockets.emit('productos', productos_guardados);
        })

        socket.on('producto',data=>{
            console.log(data)
            let prod={
                id: 0,
                timestamp: "",
                nombre: data.nombre,
                descripcion: "",
                codigo: "",
                foto: data.foto,
                precio: data.precio
            }
                const productoSaveModel = new productoModel.productos(prod)
                productoSaveModel.save()
                .then(()=>{
                    console.log(prod)
                    io.sockets.emit('producto',data)
                })
        })
        socket.on('productoElim',nombre=>{
            productoModel.productos.deleteMany({nombre:nombre})
                .then((e)=>{
                    console.log(e)
                    productoModel.productos.find({}).then((productos_guardados)=>{
                        //console.log(productos_guardados)
                    io.sockets.emit('productos', productos_guardados);
                })
            })
            .catch((e)=>{
                console.log(e)
            })
        })
        socket.on('mensajeElim',tiempo=>{
            mensajeModel.mensajes.deleteMany({tiempo:tiempo})
                .then((e)=>{
                    mensajeModel.mensajes.find({}).then((mensajes_guardados)=>{
                    io.sockets.emit('mensajes', mensajes_guardados);
                })
            })
            .catch((e)=>{
                console.log(e)
            })
        })
        socket.on('nuevo-mensaje', (data)=>{
            //let tiempo = moment().format('DD/MM/YYYY, HH:MM:SS a');
            let autor = {
                id:data.id,
                nombre:data.nombre,
                apellido:data.apellido,
                edad:data.edad,
                alias:data.alias,
                avatar:data.avatar
            }
            let mensaje={
                autor:autor,
                text:data.text
            }
            console.log(mensaje)
            const mensajeSaveModel = new mensajeModel.mensajes(mensaje)
            mensajeSaveModel.save()
            .then((e)=>{
                mensajeModel.mensajes.find({}).then((mensajes_guardados)=>{
                io.sockets.emit('mensajes', mensajes_guardados);
            })
            .catch(e=>{
                //next(e)
                console.log('Error en Insert:', e);
            })
        })
    })
})

//-----handlebar config-----
server.on('error', error=>console.log('Error en servidor', error));

app.use(express.static('views'));
app.engine(
    "hbs",
    handlebars({
        extname: ".hbs",
        defaultLayout: "index.hbs",
        layoutsDir: "views/layouts",
        partialsDir: "views/partials"
    })
)

app.set('views', 'views'); // especifica el directorio de vistas
app.set('view engine', 'hbs'); // registra el motor de plantillas
app.use(express.json());
app.use(express.urlencoded({extended: true}));     
app.use('/api',set());


app.get('/', (req,res)=>{
var scripts = '/layouts/index.js';
res.render('main',{script: scripts});
})

app.get('/vista-test', (req,res)=>{
    var scripts = '/layouts/index.js';
    res.render('main',{script: scripts});
})
