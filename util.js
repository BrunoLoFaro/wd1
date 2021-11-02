export const getIndex = (id, productos) => productos.findIndex(usuario => usuario.id == id);

export const getFecha = () => new Date().toLocaleString();

export const nextId = (productos) => productos.length ? (productos[productos.length-1].id + 1) : 1;
