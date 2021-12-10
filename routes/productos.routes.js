const Router = require('express')
//import {Router} from "express"
const generar = require('../api/productos.js')
//import {generar} from "../api/productos.js"
const logInRoutes = require('./logInRoutes.js')
//import * as logInRoutes from "./logInRoutes.js"
/*import {
    getProducto,
    getProductoById,
    postProducto,
    putProducto,
    deleteProducto,
} from "../controllers/productos.controller.js"*/

const prodController = require('../controllers/productos.controller.js')

const productosRouter = Router()
exports.productosRouter = productosRouter

productosRouter
    .get("/listar", prodController.getProducto)
    .get("/listar/:id", prodController.getProductoById)
    .post("/agregar", prodController.postProducto)
    .put("/actualizar", prodController.putProducto)
    .delete("/borrar/:id", prodController.deleteProducto);

const productosTestRouter = Router()
exports.productosTestRouter = productosTestRouter

function set(){
    productosTestRouter
        .get("/listar", generar)
        /*.get("/listar/:id", getProductoById)
        .post("/agregar", postProducto)
        .put("/actualizar", putProducto)
        .delete("/borrar/:id", deleteProducto);*/
        return Router
    }
exports.set=set

  /*  export const passportRoutes = Router()

    passportRoutes
        //.get("/", logInFunctions.getRoot)
        .get("/login", logInFunctions.getLogin)
        .get("/register", logInFunctions.getSignup)*/