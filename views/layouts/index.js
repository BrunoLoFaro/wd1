//socket io definido en script embebido en main.hbs 

//funciones referentes a webSockets
socket.on('producto', (data) => {
    createTable(data);
})

socket.on('productos', (data) => {
    //limpio los elementos de tabla, para evitar duplicados al recargar
    console.log(data)
    let tbody = document.getElementsByTagName('tbody')[0];
    tbody.innerHTML = '';
    for(let e of data){
        createTable(e);
    }
})

socket.on('mensajes', (data)=>{
    console.log("recibí")
    let div = document.getElementsByTagName('div')[0];
    div.innerHTML = '';
    console.log(data)
    render(data);
});

//funciones que manipulan el DOM

function createTable(e){
    let tabla = document.getElementById('tabla');
        let fila = document.createElement('tr');
            let contenedor = document.createElement('div');
            let img = document.createElement('img');
                let campoNombre = document.createElement('th');    
                let campoPrecio = document.createElement('th');    
                let campoImagen = document.createElement('th');   
                    contenedor.className='col-md-4'
                    img.src=e.foto
                    img.width=100
                    fila.id='addr0'   
                    campoNombre.classList.add("text-center");
                    campoPrecio.classList.add("text-center");
                    campoNombre.innerHTML = e.nombre
                    campoPrecio.innerHTML = e.precio+"$"
                contenedor.append(img)
                campoImagen.append(contenedor)
                fila.append(campoNombre)
                fila.append(campoPrecio)
            fila.append(campoImagen)
            //fila.onclick = eliminar(this);
            campoNombre.setAttribute("onclick","eliminar(this,'productoElim');");
            tabla.append(fila)
}

function ValidateEmail(mail) 
{
 if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail))
  {
    return (true)
  }
    alert("Ingresó una direccion de mail incorrecta!")
    return (false)
}

let render = (data) => {
    let html = data.map((e,i)=>`
        <div>
            <img src=${e.author.avatar} alt="Avatar" style="width:4%; border-radius: 50%;;></img>
            <strong style="color:blue">${e.author.id}</strong>
            <a style="color:green;" onCLick=eliminar(this,'mensajeElim');>${e.creadoEn}</a>
            <br><a style="color:brown; margin-left:5%;" onCLick=eliminar(this,'mensajeElim');>${e.text}</a>
        </div>
    `).join(' ');
    document.getElementById("mensajes").innerHTML = html;
}
