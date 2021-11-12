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
import {normalize,schema} from 'normalizr'
import util from 'util'
import session from 'express-session'
/*,{},{idAttribute:'_id'}*/


const authorSchema = new schema.Entity('authors')
const textSchema = new schema.Entity('texts')
const creadoEnSchema = new schema.Entity('creadoEn')
const __vSchema = new schema.Entity('__vSchema')



const mensajeSchema = new schema.Entity('mensajes',{
    author: authorSchema,
    creadoEn: creadoEnSchema,
    text: textSchema,
    __v:__vSchema
})

const holdingMensajesSchema = new schema.Entity('holding',{
    mensajes:[mensajeSchema]
})

function print(objeto) {
    console.log(util.inspect(objeto,true,12,true))
}

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
        console.log("db not running")
        ///throw `Error: ${error}`;
    }
}

const PORT = 8080//process.env.PORT
const server = http.listen(PORT,()=>console.log('SERVER ON '+PORT));

//-----websocket triggers-----
    io.on('connection', (socket)=> {

        console.log(`conectado, cliente: ${socket.id}`)


        mensajeModel.mensajes.find({}).then((mensajes)=>{
            io.sockets.emit('mensajes', mensajes);
            
            let holdingMensajes={
                id:1212,
                mensajes:mensajes
            }
            
            const holdingMensajesNormalizado = normalize(holdingMensajes,holdingMensajesSchema)
            //console.log("sin normalizar")
            //print(holdingMensajes);
            //console.log("\n\n\n")
            //console.log("normalizado")
            //print(holdingMensajesNormalizado);
            
            let longAntes = JSON.stringify(holdingMensajes).length
            let longDespues = JSON.stringify(holdingMensajesNormalizado).length
            //console.log("\n\n\n")
            //console.log("\n\n\n")
            //console.log(longAntes)
            //console.log(longDespues)
            //console.log('Compresión:', `${Math.trunc((1 - (longDespues / longAntes)) * 100)} %`);
        
       })
        
        
        /*genMsj.then((msjs_guardados)=>{
            for(let e of msjs_guardados)
            {
                console.log(e)
                const mensajeSaveModel = new mensajeModel.mensajes(e)
                mensajeSaveModel.save()
                .then(()=>{
                    console.log(`${e} guardado`)
                })
            }                

            //io.sockets.emit('mensajes', msjs_guardados)
        })*/
        
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
            mensajeModel.mensajes.deleteOne({creadoEn:tiempo})
                .then((e)=>{
                    mensajeModel.mensajes.find({}).then((mensajes_guardados)=>{
                    io.sockets.emit('mensajes', mensajes_guardados);
                })
            })
            .catch((e)=>{
                console.log(e)
            })
        })
        socket.on('nuevo-mensaje', (mensaje)=>{
            let tiempo = moment().format('DD/MM/YYYY, HH:MM:SS a');
            mensaje.creadoEn= tiempo
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
app.use(session({
    secret: 'secreto',
    resave: true,
    saveUninitialized: true,
    rolling: true, // <-- Set `rolling` to `true`
    cookie: {
      httpOnly: true,
      maxAge: 60000
    }
}));
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

app.get('/logout', (req,res)=>{
    req.session.destroy(err=>{
        if (err){
            res.json({status: 'Logout error', body: err});
        } else {
            res.render('login');
        }
    });
});

app.get('/login', (req,res)=>{
    if (!req.query.username) {
        res.render('login');
    } else{
        req.session.user = req.query.username;
        var scripts = '/layouts/index.js';
        var user = req.session.user
        res.render('main',{script: scripts, user});
    }
});

function auth (req, res, next)  {
    // if (req.session && req.session.admin) {
        console.log(req.session.user)
    if (req.session.user) {
        console.log(req.session.user)
        return next();
    } else {
        //return res.sendStatus(401);
        res.render('login');
    }
}
/*
app.get('/root', (req,res)=>{
    if (req.session.contador) {
        req.session.contador++;
        if (!req.session.usuario) {
            res.send(`Ud. ha visitado el sitio ${req.session.contador} veces`);
        } else {
            res.send(`${req.session.usuario} visitaste la página ${req.session.contador} veces`);
        }
    } else {
        req.session.contador = 1;
        if (!req.query.usuario) {
            res.send('Te damos la bienvenida!');
        } else {
            req.session.usuario = req.query.usuario;
            res.send(`Bienvenido ${req.session.usuario}!`);
        }
    }
});
*/
/*
app.get('/olvidar', (req,res)=>{
    const usuario = req.session.usuario;
    req.session.destroy(err=>{
        if (err){
            res.json({error: err});
        } else {
            if (usuario){
                res.send(`Hasta luego ${usuario}!`);
            } else {
                res.send(`Hasta luego!`);
            }
        }
    });
});*/
/*
app.get('/', (req,res)=>{
var scripts = '/layouts/index.js';
res.render('main',{script: scripts});
})*/

app.get('/vista-test', auth, (req,res)=>{
    var scripts = '/layouts/index.js';
    var user = req.session.user
    res.render('main',{script: scripts, user});
})
