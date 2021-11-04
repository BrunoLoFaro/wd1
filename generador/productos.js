import faker from 'faker'

faker.locale = 'es';

export let generadorProd = () => ({
    nombre: faker.commerce.productName(),
    precio: faker.commerce.price(),
    foto: faker.image.avatar()
});


export let generadorMensaje = () => ({
    author:{
        id:faker.internet.email(),
        nombre: faker.name.firstName(),
        apellido: faker.name.lastName(),
        edad: faker.datatype.number(),
        alias: faker.internet.userName(),
        avatar: faker.image.avatar()
    },
    text:{
        id:faker.datatype.uuid(),
        content: faker.lorem.text()
    }
});