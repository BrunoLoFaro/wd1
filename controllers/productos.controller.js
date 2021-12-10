const getProducto = (req,res)=>{
    let r
    knexProductos.from('productos').select('*')
    .then(prods => {
        res.json(prods)
    })
    .catch(e=>{
        console.log('Error en Select:', e);
        res.json({})
    });
};
exports.getProducto = getProducto

const getProductoById = (req,res)=>{
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
};
exports.getProductoById=getProductoById

const postProducto = (req,res)=>{
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
};
exports.postProducto=postProducto

const putProducto = (req,res)=>{
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
};
exports.putProducto=putProducto

const deleteProducto = (req,res)=>{
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
};
exports.deleteProducto=deleteProducto