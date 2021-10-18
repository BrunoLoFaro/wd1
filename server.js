import { productosRouter } from './routes/productos.routes.js';
//import { handleError } from './middleware/errorHandler.js';
import express from 'express';
const app = express();
import handlebars from 'express-handlebars'
import http1 from 'http'
const http = http1.Server(app)
import { Server } from "socket.io";
const io = new Server(http);
import moment from 'moment'
import mongoose from 'mongoose'
import * as model from './models/producto.model.js'

CRUD();

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
        throw `Error: ${error}`;
    }
}

const PORT = 8080//process.env.PORT
const server = http.listen(PORT,()=>console.log('SERVER ON '+PORT));

//-----websocket triggers-----
    io.on('connection', (socket)=> {

        console.log(`conectado, cliente: ${socket}`)

        model.productos.find({}).then((mensajes_guardados)=>{
            io.sockets.emit('mensajes', mensajes_guardados);
        })
        model.productos.find({}).then((productos_guardados)=>{
            io.sockets.emit('productos', productos_guardados);
        })

        socket.on('producto',data=>{
                const productoSaveModel = new model.productos(prodEj)
                productoSaveModel.save()
                .then(()=>{
                    io.sockets.emit('producto',data)
                })
        })

        socket.on('nuevo-mensaje', (data)=>{
            let tiempo = moment().format('DD/MM/YYYY, HH:MM:SS a');
            data.tiempo = tiempo
            const productoSaveModel = new model.productos(prodEj)
            productoSaveModel.save()
            .then ((mensajes_guardados)=>{
                console.log('Fila insertada!');
                knexMensajes.from('mensajes').select('*').then((mensajes_guardados)=>{
                    io.sockets.emit('mensajes', mensajes_guardados);
                })
            })
            .catch(e=>{
                //next(e)
                console.log('Error en Insert:', e);
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

//-----comportamiento de la pagina a los metodos http-----
app.get('/', (req,res)=>{
var scripts = '/layouts/index.js';
res.render('main',{script: scripts});
})
