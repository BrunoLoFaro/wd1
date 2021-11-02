import faker from 'faker'

faker.locale = 'es';

const get = () => ({
    nombre: faker.commerce.productName(),
    precio: faker.commerce.price(),
    foto: faker.image.imageUrl()
});

module.exports = {
    get
}