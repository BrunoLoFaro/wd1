//-----imports-----
import express from 'express';
const app = express();
import handlebars from 'express-handlebars'
import http1 from 'http'
const http = http1.Server(app)
import { Server } from "socket.io";
const io = new Server(http);
import validator from 'email-validator'
import moment from 'moment'

import {optionsMensajes, optionsProductos} from './options/SQLite3.js';
import knex from 'knex';
import { nextTick } from 'process';
let knexMensajes = knex(optionsMensajes)
let knexProductos = knex(optionsProductos)

const PORT = 8080//process.env.PORT
const router = express.Router();
const server = http.listen(PORT,()=>console.log('SERVER ON '+PORT))


const vMensajes = [ 
	{
		"mail": "lofarobruno@gmail.com", 
		"mensaje": "Por acá se envian mensajes", 
		"tiempo": "28/09/2021, 17:09:20 pm", 
		"id": 1
	}, 
	{
		"mail": "lofarobruno@gmail.com", 
		"mensaje": "Para enviar uno, hay que completar el campo de mail", 
		"tiempo": "28/09/2021, 17:09:30 pm", 
        "id": 2
	} 
];

let vProductos =
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
];

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
        }).then(()=>{
            //knexMensajes.destroy()
        })
        knexProductos.from('productos').select('*').then((productos_guardados)=>{
            io.sockets.emit('productos', productos_guardados);
            //console.log(productos_guardados)
        }).then(()=>{
            //knexProductos.destroy()
        })

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

app.get('/productos/listar', (req,res)=>{
    let r
    knexProductos.from('productos').select('*')
    .then(prods => {
        res.json(prods)
    })
    .catch(e=>{
        console.log('Error en Select:', e);
        res.json({})
    });
});

app.get('/productos/listar/:id', (req,res)=>{
    let id = req.params;
    let producto
    knexProductos.from('productos').select('*').where('id', '=', id)
        .then (prods=>{
            res.json(producto);
        })
        .catch(e=>{
            //next(e)
            console.log('Error en select:', e);
        })
});


app.post('/productos/guardar/',(req,res)=>{
    let producto = req.body;
        knexProductos('productos').insert(producto)
        .then (()=>{
            console.log('Fila insertada!');
            res.json();
            io.sockets.emit('producto',producto)
        })
        .catch(e=>{
            //next(e)
            console.log('Error en Insert:', e);
        })
});


app.put('/productos/actualizar', (req,res)=>{
    let producto = req.body;
        knexProductos.from('productos').where('id', '=', producto.id).update(producto)
        .then (()=>{
            console.log('Fila insertada!');
            res.json(producto);
        })
        .catch(e=>{
            //next(e)
            console.log('Error en Insert:', e);
        })
});

app.delete('/productos/eliminar/:id', (req,res)=>{
    let id = req.params.id;
    console.log(id)
        knexProductos.from('productos').where('id', '=', id).del()
        .then ((e)=>{
            console.log('Fila borrada!');
            res.json(e);
        })
        .catch(e=>{
            //next(e)
            console.log('Error en Delete:', e);
        })
});

