import {Router} from "express"
import {generar} from "../api/productos.js"
import * as logInRoutes from "./logInRoutes.js"
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

export const productosTestRouter = Router()

export function set(){
    productosTestRouter
        .get("/listar", generar)
        /*.get("/listar/:id", getProductoById)
        .post("/agregar", postProducto)
        .put("/actualizar", putProducto)
        .delete("/borrar/:id", deleteProducto);*/
        return Router
    }

  /*  export const passportRoutes = Router()

    passportRoutes
        //.get("/", logInFunctions.getRoot)
        .get("/login", logInFunctions.getLogin)
        .get("/register", logInFunctions.getSignup)*/