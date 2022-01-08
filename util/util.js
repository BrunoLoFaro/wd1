const getIndex = (id, productos) => productos.findIndex(usuario => usuario.id == id);
exports.getIndex=getIndex
const getFecha = () => new Date().toLocaleString();
exports.getFecha=getFecha
const nextId = (productos) => productos.length ? (productos[productos.length-1].id + 1) : 1;
exports.nextId=nextId