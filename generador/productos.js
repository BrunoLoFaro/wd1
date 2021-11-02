import faker from 'faker'

faker.locale = 'es';

export let generador = () => ({
    nombre: faker.commerce.productName(),
    precio: faker.commerce.price(),
    foto: faker.image.technics()
});