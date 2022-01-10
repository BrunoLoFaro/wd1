const dotenv = require('dotenv')
dotenv.config({path: './config/.env'})
const routes = require('./routes/productos.routes.js')
const express = require('express')
const { engine } = require('express-handlebars')
const socket_io = require('socket.io')
const Server = socket_io.Server
const https = require('https')
const moment = require('moment')
const autorModel = require('./models/autor.model.js')
const productoModel = require('./models/producto.model.js')
const mensajeModel = require('./models/mensaje.model.js')
const productos = require('./api/productos.js')
const {normalize, schema} = require('normalizr');
const util = require('util')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const passport = require('passport')
const logInRoutes = require('./routes/logInRoutes.js')
const passport_facebook = require('passport-facebook')
const FacebookStrategy = passport_facebook.Strategy;
const fs = require('fs')
const child_process = require('child_process')
const fork = child_process.fork
const cluster = require('cluster');
const os = require('os')
const numCPUs = os.cpus().length;
const compression = require('compression')
const log4js = require("log4js");
const cors = require('cors')
const nodemailer = require('nodemailer')
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

//deployed in heroku
const usuarios = [];



//conexion a db

const url = process.env.MONGODB_URI

const connectionParams={ 
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000
  } 
mongoose.connect(url,connectionParams)
    .then( () => {
        console.log('Connected to database ')
    })
    .catch( (err) => {
        console.error(`Error connecting to the database. \n${err}`);
    })


//logger
log4js.configure({
    appenders: {
      fileWarnAppender: { type: "file", filename: 'warn.log' },
      fileErrorAppender: { type: "file", filename: 'error.log' },
      justWarns: { type: 'logLevelFilter', appender: 'fileWarnAppender', level: 'warn' },
      consoleAppender: { type: "console" }
    },
    categories: {
      default: { appenders: ["consoleAppender"], level: "info" },
      console: { appenders: ["consoleAppender"], level: "info" },
      file: { appenders: ["justWarns"], level: "warn"},
    }
  });

  const logger = log4js.getLogger();//default
  const loggerFile = log4js.getLogger('file');//solo warn
  



let args = process.argv.slice(2);// Me quedo con los argumentos que me sirven
//line to commit
/*
parametros: 
    port 
    modo    (fork o cluster) 
    fb_client_id
    fb_client_secret
*/
let PORT = parseInt(args[0]) || process.env.PORT
loggerFile.warn(PORT)
let modo = args[1] || 'FORK'
let fb_client_id = args[2] || process.env.FACEBOOK_API_KEY
let fb_client_secret = args[3] || process.env.FACEBOOK_API_SECRET

process.on('exit',(code)=>{
    logger.info("Salida");
    if (code != 0) {
        logger.info('Codigo de salida: ', code);
    }
});

//https es necesario para la auth con facebook
const httpsOptions = {
    key: fs.readFileSync('./sslcert/cert.key'),
    cert: fs.readFileSync('./sslcert/cert.pem')
}


//"modelo" para mongo
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

//Funcion auxiliar. Imprime objetos dentro de objetos segun depth
function print(objeto, depth) {
    console.log(util.inspect(objeto,false,depth,true))
}

//modos de ejecucion. Usi de uno o varios nucleos
if(modo=='CLUSTER' && cluster.isMaster){
    for(let i=0;i<numCPUs;i++)
        cluster.fork()
    cluster.on('exit',worker =>{
        logger.info('worker', worker.process.pid,'died', new Date().toLocaleString())
        cluster.fork()
    })
}
else{

const app = express();

//config del motor de plantillas
app.set('views', 'views'); // especifica el directorio de vistas
app.set('view engine', 'hbs'); // registra el motor de plantillas

//middlewares
app.use(express.json());
app.use|(express.urlencoded({extended: true}));     
//app.use('/api',routes.set());
app.use(express.static('views'));

app.use(cors())
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
//guardo las sesiones en mongo

app.use(session({
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI
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

//declaro middlewares
app.use(passport.initialize());
app.use(passport.session());
//app.use(compression());

//rutas
app.get('/auth/facebook/datos',
  passport.authenticate('facebook', { scope: [ 'email' ], failureRedirect: '/error-login.html' }),
  function(req, res) {
    var scripts = '/layouts/index.js';
    let usuario = usuarios[0]
    res.render('main',{script: scripts,usuario});
/*
    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        auth: {
        user: 'nels.yost71@ethereal.email', // generated ethereal user
        pass: 'wMvBbSXGhrV12cT948', // generated ethereal password
        },
    });
    let date_obj = moment().format('DD/MM/YYYY HH:mm')
    // send mail with defined transport object
    transporter.sendMail({
        from: '"Servidor node', // sender address
        to: usuarios[0].mail, // list of receivers
        subject: "log in " + usuarios[0].name + date_obj, // Subject line
        text: usuarios[0].name + " se logeo al ecommerce de venta de libros a las " + date_obj, // plain text body
        html: "<b>Hello world!</b>", // html body
    },(err,inf)=>{
        if(err){
        console.log(err)
        return err
        }
    });

    console.log('mail 1 de login mandado')

    let transporter2 = nodemailer.createTransport({
        service:"gmail",
        auth: {
          user: 'pruebam097@gmail.com', // generated ethereal user
          pass: 'contra.de.prueba.11', // generated ethereal password
        },
      });
    
      // send mail with defined transport object
      transporter2.sendMail({
        from: '"Servidor node', // sender address
        to: "lofarobruno@gmail.com", // list of receivers
        subject: "log in" + usuarios[0].name + date_obj, // Subject line
        text: "Hello world", // plain text body
        html: "<b>Hello world!</b>", // html body,
        attachments:{
            path: usuarios[0].picture
        }
      },(err,inf)=>{
          if(err){
          console.log(err)
          return err
          }
      });
    
        console.log('mail 2 de login mandado')
        */
});


//esto se saltea el login. Es para probar

app.get('/vista-test', (req,res)=>{
    var scripts = '/layouts/index.js';
    var user = req.session.user
    res.render('main',{script: scripts, user});
})

app.get('/books', (req,res)=>{
    var user = req.session.user
    res.render('books');
})

app.get('/', (req,res)=>{
    res.render('login');
})

function sendMail (req, res, next){
        logger.info('logging out')
            let transporter = nodemailer.createTransport({
                host: "smtp.ethereal.email",
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                user: 'nels.yost71@ethereal.email', // generated ethereal user
                pass: 'wMvBbSXGhrV12cT948', // generated ethereal password
                },
                });
                let date_obj2 = moment().format('DD/MM/YYYY HH:mm')
                // send mail with defined transport object
                    transporter.sendMail({
                    from: '"Servidor node', // sender address
                    to: usuarios[0].mail, // list of receivers
                    subject: "log out", // Subject line
                    text: usuarios[0].name + " se logeo al ecommerce de venta de libros a las " + date_obj2, // plain text body
                    html: "<b>Hello world!</b>", // html body
            },(err,inf)=>{
            if(err){
            logger.waring(err)
            return err
            }
            });
            logger.info('mail de logout mandado')
    next()
}


app.get('/logout',/*sendMail,*/logInRoutes.getLogout)

//app.get('/', checkAuthentication, logInRoutes.getRutaProtegida(req,res));



app.get('/random', function (req, res, next) {
//desactivo el child process
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
    logger.info(data)
    res.render('info',{data});
 });

 app.get('/datos', (req, res)=>{
    logger.warning(`Port: ${PORT} -> Fyh: ${moment().format('DD/MM/YYYY HH:mm')}`)
    res.send(`Servidor express <span style="color: blueviolet;">(Nginx)</span> en ${PORT} - PID ${process.pid} - ${moment().format('DD/MM/YYYY HH:mm')}`);
});

app.get('*', logInRoutes.failRoute);


//creo el servidor
const server = https.createServer(httpsOptions, app)
.listen(PORT, () => {
    logger.info('Server corriendo en ' + PORT)
})
server.on('error', error=>logger.warning('error en servidor',e));

const io = new Server(server);


//-----websocket triggers-----
//websockets. Nexo entre el back y el front
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
        //console.log(data)
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
                io.sockets.emit('producto',data)
            })
    })
    socket.on('productoElim',nombre=>{
        productoModel.productos.deleteMany({nombre:nombre})
            .then((e)=>{
                productoModel.productos.find({}).then((productos_guardados)=>{
                    //console.log(productos_guardados)
                io.sockets.emit('productos', productos_guardados);
            })
        })
        .catch((e)=>{
            logger.warning('error al eliminar producto ',e)
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
            logger.warning('error al eliminar mensaje ',e)
        })
    })
    socket.on('nuevo-mensaje', (mensaje)=>{
       /* if(mensaje.text === 'administrador')
        {
            client.messages
            .create({
                body: 'Este es un sms de prueba',
                from: '+13342315038',
                to: '+541134361122'
            })
            .then(message => console.log('Se envió el mensaje ' + message.sid));
        }
        */
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
            logger.warning('error en insert',e)
        })
    })
})
})

//handlebars. Motor de vistas. Envio vistas con info del back
app.engine('hbs', engine({
    defaultLayout: 'index',
    extname: '.hbs'
}));

app.set('view engine', 'hbs');

}

passport.use(new FacebookStrategy({
    clientID: fb_client_id,
    clientSecret: fb_client_secret,
    //callbackURL: `https://coderhouse--ecommerce.herokuapp.com/auth/facebook/datos`,
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
            mail: userData.email
        }
        usuarios.push(nuevoUsuario);
        return cb(null, nuevoUsuario)
      }
  }
));

//serializar y deserializar son parte de passport
passport.serializeUser((user, done)=>{
    done(null, user.facebookId);
});

passport.deserializeUser((id, done)=>{
    let usuario = usuarios[usuarios.findIndex(e=>e.facebookId == id)];
    done(null, usuario);
}); 

//middleware auth function
function checkAuthentication(req, res, next){
    if (req.isAuthenticated()){
        next();
    } else {
        res.redirect('/auth/facebook/datos');
    }
}
