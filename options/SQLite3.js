export const optionsMensajes = {
    client: 'sqlite3',
    connection: {
        filename: './DB/mydb.sqlite'
    },
    useNullAsDefault: true
}
export const optionsProductos = {
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        port: 3306,
        user: 'root',
        password: '',
        database: 'productos'
    },
    useNullAsDefault: true
}
console.log('Conectando a la base de datos...');
/*
module.exports = {
    options
}*/