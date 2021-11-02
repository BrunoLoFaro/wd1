import faker from 'faker'

faker.locale = 'es';

export const generador = () => ({
    nombre: faker.commerce.productName(),
    foto: faker.image.business(),
    precio: faker.image.technics()
});