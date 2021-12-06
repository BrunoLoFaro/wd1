import dotenv from 'dotenv'
import { productosRouter, set } from './routes/productos.routes.js';
//import { handleError } from './middleware/errorHandler.js';
import express from 'express';
const app = express();
//import {generador} from './generador/productos.js'
import handlebars from 'express-handlebars'
import { Server } from "socket.io";
import https from 'https'; 
import moment from 'moment'
import mongoose from 'mongoose'
import * as autorModel from './models/autor.model.js'
import * as productoModel from './models/producto.model.js'
import * as mensajeModel from './models/mensaje.model.js'
import {genProd, genMsj} from "./api/productos.js"
import {normalize,schema} from 'normalizr'
import util from 'util'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import passport from 'passport'
import * as logInRoutes from "./routes/logInRoutes.js"
import passport_facebook from 'passport-facebook';
const FacebookStrategy = passport_facebook.Strategy;
import fs from 'fs'; 
import fork from 'child_process'
//import routes from '/routes/logIn_functions.js'


const httpsOptions = {
    key: fs.readFileSync('./sslcert/cert.key'),
    cert: fs.readFileSync('./sslcert/cert.pem')
}

//dotenv.config({path: './config/.env'})
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

function print(objeto, depth) {
    console.log(util.inspect(objeto,false,depth,true))
}

app.use(session({
    store: MongoStore.create({
        mongoUrl: 'mongodb://localhost/sesiones'
    }),
    secret: 'secreto',
    resave: true,
    saveUninitialized: true,
    rolling: true, // <-- Set `rolling` to `true`
    cookie: {
      httpOnly: false,//true
      maxAge: 10//60000
    }
}));

const usuarios = [];

app.use(passport.initialize());
app.use(passport.session());


passport.use(new FacebookStrategy({
    clientID: '881042735939498',
    clientSecret: 'f02aec876f3d8071916df4984225a56a',
    callbackURL: `https://localhost:8443/auth/facebook/datos`,
    profileFields: ['id','name','emails','photos']
  },
  function(accessToken, refreshToken, profile, cb) {
      let indice = usuarios.findIndex(e=>e.facebookId  == profile.id);
      if (indice != -1) {
          //console.log("encontré")
        return cb(null, usuarios[indice]);
      }
      else{
        //console.log("no encontré")
        let userData = profile._json
        let nuevoUsuario = {
            facebookId: userData.id, 
            name: userData.first_name+' '+userData.last_name, 
            picture: userData.picture.data.url,
        }
        usuarios.push(nuevoUsuario);
        return cb(null, nuevoUsuario)
      }
  }
));


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

const PORT = 8443//process.env.PORT

const server = https.createServer(httpsOptions, app)
    .listen(PORT, () => {
        console.log('Server corriendo en ' + PORT)
    })

const io = new Server(server);

passport.serializeUser((user, done)=>{
    done(null, user.facebookId);
});

passport.deserializeUser((id, done)=>{
    let usuario = usuarios[usuarios.findIndex(e=>e.facebookId == id)];
    done(null, usuario);
}); 

//-----websocket triggers-----
    io.on('connection', (socket)=> {

        //console.log(`conectado, cliente: ${socket.id}`)


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
        
        /*
        genMsj.then((msjs_guardados)=>{
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
        
        productoModel.productos.find({}).then((productos_guardados)=>{
            io.sockets.emit('productos', productos_guardados);
        })
        
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

server.on('error', error=>console.log('Error en servidor', error));

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
app.use|(express.urlencoded({extended: true}));     
app.use('/api',set());
app.use(express.static('views'));

/*
app.get('/mainPage', (req,res)=>{
    console.log("1")
    passport.authenticate('facebook', { failureRedirect: '/error-login.html' }),
    function(req, res) {
        console.log("2")
    //var scripts = '/layouts/index.js';
    var user = req.session.user
    //res.render('main',{script: scripts, user});
    res.render('main',{user});
    }
})
*/


app.get('/auth/facebook/datos',
  passport.authenticate('facebook', { failureRedirect: '/error-login.html' }),
  function(req, res) {
    var scripts = '/layouts/index.js';
    let usuario = usuarios[0]
    res.render('main',{script: scripts,usuario});
});


//esto se saltea el login. Es para probar

app.get('/vista-test', (req,res)=>{
    var scripts = '/layouts/index.js';
    var user = req.session.user
    res.render('main',{script: scripts, user});
})

app.get('/logout', logInRoutes.getLogout);

app.get('/', checkAuthentication, logInRoutes.getRutaProtegida);


/*
app.get('/randoms', function (req, res, next) {
    res.render('info', {layout: true});
    let cantidad
    if(req.cant==null)
    {
        cantidad=100000000
    }
    else
        cantidad=req.cantp
    const calcRandom = fork('./calcRandom.js');
    calcRandom.send('start');
    calcRandom.on('message', sum=>res.end(`La suma es ${sum}`));
    console.log('Es no bloqueante!');
 });
 */

app.get('*', logInRoutes.failRoute);


function checkAuthentication(req, res, next){
    if (req.isAuthenticated()){
        next();
    } else {
        res.redirect('/auth/facebook/datos');
    }
}