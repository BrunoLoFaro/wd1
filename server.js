const dotenv = require('dotenv')
const routes = require('./routes/productos.routes.js')
const express = require('express')
const app = express();
const handlebars = require('express-handlebars')
const socket_io = require('socket.io')
const Server = socket_io.Server
const https = require('https')
const moment = require('moment')
const mongoose= require('mongoose')
const autorModel = require('./models/autor.model.js')
const productoModel = require('./models/producto.model.js')
const mensajeModel = require('./models/mensaje.model.js')
const productos = require('./api/productos.js')
const normalizr = require('normalizr')
const normalize = normalizr.normalize
const schema = normalizr.schema
const util = require('util')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const passport = require('passport')
const logInRoutes = require('./routes/logInRoutes.js')
const passport_facebook = require('passport-facebook')
const FacebookStrategy = passport_facebook.Strategy;
const fs = require('fs')
const child_process = require('child_process')
const fork = child_process.fork
const os = require('os')
const cluster = require('cluster')
const numCPUs = os.cpus().length;

dotenv.config({path: './config/.env'})

let args = process.argv.slice(2);

let PORT = args[0] || process.env.PORT
let fb_client_id = args[1] || process.env.FACEBOOK_API_KEY
let fb_client_secret = args[2] || process.env.FACEBOOK_API_SECRET
let mode = args[3] || 'FORK'

process.on('exit',(code)=>{
    console.log(salida);
    if (code != 0) {
        console.log('Codigo de salida: ', code);
    }
});

const httpsOptions = {
    key: fs.readFileSync('./sslcert/cert.key'),
    cert: fs.readFileSync('./sslcert/cert.pem')
}


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
    clientID: fb_client_id,
    clientSecret: fb_client_secret,
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
        productos.genMsj.then((msjs_guardados)=>{
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
        /*
        productos.genProd.then((productos_guardados)=>{
            io.sockets.emit('productos', productos_guardados);
        })*/

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
//app.use('/api',routes.set());
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



app.get('/random', function (req, res, next) {

    let cant = req.query.cant || 100000000
    let childProcess = fork('calcRandom')

    childProcess.send({cantidad:cant})
    childProcess.on('message',obj=>{
        res.send(obj.result)
    })
 });


 app.get('/info', function (req, res, next) {
    let platform = process.platform
    let version = process.version
    let memory = process.memoryUsage()
    let execPath = process.execPath
    let pid = process.pid

    let data={
        platform,
        args,
        version,
        memory,
        execPath,
        pid,
        numCPUs
    }
    res.render('info',{data});
 });

app.get('*', logInRoutes.failRoute);


function checkAuthentication(req, res, next){
    if (req.isAuthenticated()){
        next();
    } else {
        res.redirect('/auth/facebook/datos');
    }
}