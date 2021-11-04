import faker from 'faker'
import mongoose from 'mongoose'
faker.locale = 'es';

export let generadorProd = () => ({
    nombre: faker.commerce.productName(),
    precio: faker.commerce.price(),
    foto: faker.image.avatar()
});


export let generadorMensaje = () => {
    let obj = {
        id:1212,
        author:autores[randomIntFromInterval(0,1)]
        /*{
            id:faker.internet.email(),
            nombre: faker.name.firstName(),
            apellido: faker.name.lastName(),
            edad: faker.datatype.number(),
            alias: faker.internet.userName(),
            avatar: faker.image.avatar()
        }*/
        ,
        text: faker.lorem.text()
    }
    return obj
};

function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}

let autores=[
    {
        id: 'Ral.Hurtado@gmail.com',
        nombre: 'José Luis',
        apellido: 'Villegas',
        edad: 16495,
        alias: 'Estela59',
        avatar: 'https://cdn.fakercloud.com/avatars/mikebeecham_128.jpg',
        _id: new mongoose.Types.ObjectId("618421e8bf636b4b15ab1ccd")
    },
    {
       id: 'Mariana_Solorzano9@yahoo.com',
       nombre: 'Ana',
       apellido: 'Bahena',
       edad: 10148,
       alias: 'Sofía29',
       avatar: 'https://cdn.fakercloud.com/avatars/jarsen_128.jpg',
       _id: new mongoose.Types.ObjectId("618421e8bf636b4b15ab1ccb")
     }
]