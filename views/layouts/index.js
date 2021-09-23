//import { BroadcastOperator } from "socket.io";

var socket = io();

function vaciar(){
    socket.emit('vaciar', "");
    console.log('vacio')
}

function enviar(valor) {
    let prod={
        title:document.getElementById('title').value,
        price:document.getElementById('price').value,
        thumbnail:document.getElementById('thumbnail').value
    };
    console.log("apretaron el boton "+ prod)
    socket.emit('producto', prod);
    return false
}

socket.on('producto', (data) => {
    console.log(data)
    let tabla = document.getElementById('tabla');
        let fila = document.createElement('tr');
            let contenedor = document.createElement('div');
            let img = document.createElement('img');
                let campoNombre = document.createElement('th');    
                let campoPrecio = document.createElement('th');    
                let campoImagen = document.createElement('th');   
                    contenedor.className='col-md-4'
                    img.src=data.thumbnail
                    img.width="20%"
                    fila.id='addr0'   
                    campoNombre.classList.add("text-center");
                    campoPrecio.classList.add("text-center");
                    campoNombre.innerHTML = data.title
                    campoPrecio.innerHTML = data.price
                contenedor.append(img)
                campoImagen.append(contenedor)
                fila.append(campoNombre)
                fila.append(campoPrecio)
            fila.append(campoImagen)
        tabla.append(fila)
})

socket.on('productos', (data) => {
    console.log(data)
    for(e of data){
    let tabla = document.getElementById('tabla');
        let fila = document.createElement('tr');
            let contenedor = document.createElement('div');
            let img = document.createElement('img');
                let campoNombre = document.createElement('th');    
                let campoPrecio = document.createElement('th');    
                let campoImagen = document.createElement('th');   
                    contenedor.className='col-md-4'
                    img.src=e.thumbnail
                    img.width=100
                    fila.id='addr0'   
                    campoNombre.classList.add("text-center");
                    campoPrecio.classList.add("text-center");
                    campoNombre.innerHTML = e.title
                    campoPrecio.innerHTML = e.price+"$"
                contenedor.append(img)
                campoImagen.append(contenedor)
                fila.append(campoNombre)
                fila.append(campoPrecio)
            fila.append(campoImagen)
        tabla.append(fila)
    }
})

/*
socket.on('atodos', (data) => {
    let ul = document.getElementsByTagName('ul')[0];
    ul.innerHTML = '';
    for (mensaje of data) {
        let ul = document.getElementsByTagName('ul')[0];
        let li = document.createElement('li');
        ul.appendChild(li);
        li.innerHTML = `SocketId: ${mensaje.socketId} - Mensaje: ${mensaje.mensaje}`;
    }
})*/