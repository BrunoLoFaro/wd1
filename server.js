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
import {vProductos, vMensajes} from './lotes.js'
import {optionsMensajes, optionsProductos} from './options/SQLite3.js';
import knex from 'knex';


CRUD();

async function CRUD (){
    try {
        
        const URI = 'mongodb://localhost:27017/colegio';
        await mongoose.connect(URI, 
            { 
              useNewUrlParser: true,
              useUnifiedTopology: true,
              serverSelectionTimeoutMS: 1000
            })    
        console.log('Conectado a la base de datos...');

        await Estudiante.updateOne({nombre: 'Lucas', apellido: 'Blanco'},  {dni: '333'});
        console.log('DNI actualizado...');

        await Estudiante.updateMany({}, {$set: {ingreso: false}});
        console.log('Campo ingreso inicializado...');

        await Estudiante.updateMany({curso: '1A'}, {$set: {ingreso: true}});
        console.log('Campo ingreso actualizado...');

        let estudiantes = await Estudiante.find({nota: {$gte: 4}}, {_id: 0, __v: 0});
        console.log('Estudiantes que aprobaron:', estudiantes);

        estudiantes = await Estudiante.find({ingreso: true}, {_id: 0, __v: 0});
        console.log('Estudiantes que tienen ingreso en true:', estudiantes);

        await Estudiante.deleteMany({ingreso: true});
        console.log('Estudiantes con ingreso en true borrados');

        estudiantes = await Estudiante.find({},{__v: 0});
        console.log('Lista final de estudiantes:');
        for (let estudiante of estudiantes){
            let fechaCreacion = new Date(parseInt(estudiante['_id'].toString().substring(0, 8), 16) * 1000);
            console.log(`${estudiante} -> Fecha de creación: ${fechaCreacion}`);
        }

        await mongoose.connection.close();
    }
    catch(error) {
        throw `Error: ${error}`;
    }
}


let knexMensajes = knex(optionsMensajes)
let knexProductos = knex(optionsProductos)

const PORT = 8080//process.env.PORT
const server = http.listen(PORT,()=>console.log('SERVER ON '+PORT));

(async ()=>{
    await knexMensajes.schema.hasTable('mensajes')
    .then(()=>console.log("table mensajes already exists"))
    .catch(()=>{
        knexMensajes.schema.createTable('mensajes', table => {
            table.string('mail'),
            table.string('mensaje'),
            table.string('tiempo'),
            table.increments('id')
            console.log('Tabla de mensajes creada...');
        }).then(()=>{
            knex('mensajes').insert(vMensajes);
            console.log('Mensajes insertados...');
        })      
    })
    await knexProductos.schema.hasTable('productos')
    .then(()=>console.log("table mensajes already exists"))
    .catch(()=>{
        knexMensajes.schema.createTable('productos', table => {
            table.string('title'),
            table.float('price'),
            table.string('thumbnail'),
            table.increments('id')
            console.log('Tabla de productos creada...');
        }).then(()=>{
            knex('productos').insert(vProductos);
            console.log('Mensajes insertados...');
        })      
    })
})();

//-----websocket triggers-----
    io.on('connection', (socket)=> {
        knexMensajes = knex(optionsMensajes)
        knexProductos = knex(optionsProductos)
        console.log(`conectado, cliente: ${socket}`)
        knexMensajes.from('mensajes').select('*').then((mensajes_guardados)=>{
            io.sockets.emit('mensajes', mensajes_guardados);
        })
        knexProductos.from('productos').select('*').then((productos_guardados)=>{
            io.sockets.emit('productos', productos_guardados);

        })

        socket.on('producto',data=>{
            listaProd.setProducto(data)
                io.sockets.emit('producto',data)
        })

        socket.on('nuevo-mensaje', (data)=>{
            let tiempo = moment().format('DD/MM/YYYY, HH:MM:SS a');
            data.tiempo = tiempo
            knexMensajes('mensajes').insert(data)
            .then (()=>{
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
);

app.set('views', 'views'); // especifica el directorio de vistas
app.set('view engine', 'hbs'); // registra el motor de plantillas
app.use(express.json());
app.use(express.urlencoded({extended: true}));     

//-----comportamiento de la pagina a los metodos http-----
app.get('/', (req,res)=>{
    var scripts = '/layouts/index.js';
    res.render('main',{script: scripts});
});