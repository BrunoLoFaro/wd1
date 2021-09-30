'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _expressHandlebars = require('express-handlebars');

var _expressHandlebars2 = _interopRequireDefault(_expressHandlebars);

var _claseProducto = require('./claseProducto.js');

var _claseArchivo = require('./claseArchivo.js');

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _socket = require('socket.io');

var _emailValidator = require('email-validator');

var _emailValidator2 = _interopRequireDefault(_emailValidator);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)(); //-----imports-----

var http = _http2.default.Server(app);

var io = new _socket.Server(http);


var PORT = 3000;
var router = _express2.default.Router();
var server = http.listen(PORT, function () {
    return console.log('SERVER ON ' + PORT);
});

var archMensajes = new _claseArchivo.Archivo("mensajes.txt");

//-----websocket triggers-----
io.on('connection', function (socket) {
    console.log('conectado, cliente: ' + socket);
    archMensajes.leer().then(function (mensajes_guardados) {
        io.sockets.emit('mensajes', mensajes_guardados);
    });

    socket.emit('productos', _claseProducto.listaProd.getProductos());

    socket.on('producto', function (data) {
        _claseProducto.listaProd.setProducto(data);
        io.sockets.emit('producto', data);
    });

    socket.on('nuevo-mensaje', function (data) {
        var tiempo = (0, _moment2.default)().format('DD/MM/YYYY, HH:MM:SS a');
        data.tiempo = tiempo;
        archMensajes.guardar(data).then(function () {
            archMensajes.leer().then(function (vMensajes) {
                io.sockets.emit('mensajes', vMensajes);
            });
        });
    });
    socket.on('vaciar', function (data) {
        _claseProducto.listaProd.empty();
        socket.emit('productos', lista);
    });
});

//-----handlebar config-----
server.on('error', function (error) {
    return console.log('Error en servidor', error);
});
app.use(_express2.default.urlencoded({ extended: false }));
app.use(_express2.default.static('views'));
app.engine("hbs", (0, _expressHandlebars2.default)({
    extname: ".hbs",
    defaultLayout: "index.hbs",
    layoutsDir: "views/layouts",
    partialsDir: "views/partials"
}));
app.set('views', 'views'); // especifica el directorio de vistas
app.set('view engine', 'hbs'); // registra el motor de plantillas
app.use('/api', router);

//-----comportamiento de la pagina a los metodos http-----
app.get('/', function (req, res) {
    var scripts = '/layouts/index.js';
    res.render('main', { script: scripts });
});

app.get('/productos/listar', function (req, res) {
    var vProductos = void 0;
    try {
        vProductos = _claseProducto.listaProd.getProductos();
    } catch (e) {
        vProductos = {};
    }
    res.json({ vProductos: vProductos });
});

app.get('/productos/listar/:id', function (req, res) {
    var params = req.params;
    var id = params.id;
    var busq = void 0;
    try {
        busq = _claseProducto.listaProd.getProducto(id);
    } catch (e) {
        busq = {};
    }
    res.json(busq);
});

app.post('/productos/guardar/', function (req, res) {
    var body = req.body;
    var vProductos = _claseProducto.listaProd.getProductos();
    var pos = vProductos.length;
    var id = vProductos[pos - 1].id;
    var incorporado = void 0;
    try {
        incorporado = body;
        _claseProducto.listaProd.setProducto(body, ++id);
    } catch (e) {
        incorporado = {};
    }
    res.json({ incorporado: incorporado });
});

app.put('/productos/actualizar/:id/:titulo/:precio/:imagen', function (req, res) {
    var params = req.params;
    var id = params.id;
    var prod = {
        title: params.titulo, //por query los params vienen como string.
        price: parseInt(params.precio), //tendría efecto si usaramos una bd.
        thumbnail: params.imagen,
        id: id
    };
    var actualizado = void 0;
    try {
        _claseProducto.listaProd.updateProducto(prod, id);
        actualizado = _claseProducto.listaProd.getProducto(id);
    } catch (e) {
        actualizado = {};
    }

    res.json({ actualizado: actualizado });
});

app.delete('/productos/eliminar/:id', function (req, res) {
    var params = req.params;
    var id = params.id;
    var eliminado = void 0;
    try {
        _claseProducto.listaProd.eliminateProducto(id);
        eliminado = _claseProducto.listaProd.getProducto(id);
    } catch (e) {
        eliminado = {};
    }
    res.json({ eliminado: eliminado });
});
