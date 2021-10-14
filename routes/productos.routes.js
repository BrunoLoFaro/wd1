import {Router} from "express"

import {
    getProducto,
    getProductoById,
    postProducto,
    putProducto,
    deleteProducto,
} from "../controllers/productos.controller.js"

export const productosRouter = Router()

productosRouter
    .get("/listar", getProducto)
    .get("/listar/:id", getProductoById)
    .post("/agregar", postProducto)
    .put("/actualizar", putProducto)
    .delete("/borrar/:id", deleteProducto);