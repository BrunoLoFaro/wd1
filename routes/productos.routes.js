const Router = require('express')
const logInRoutes = require('./logInRoutes.js')
//import * as logInRoutes from "./logInRoutes.js"
const controller = require from "../controllers/productos.controller.js"*/

const prodController = require('../controllers/productos.controller.js')

const productosRouter = Router()
exports.productosRouter = productosRouter

productosRouter
    .get("/producto", prodController.getProducto)
    .get("/producto/:id", prodController.getProductoById)
    .post("/producto", prodController.postProducto)
    .put("/productor", prodController.putProducto)
    .delete("/producto/:id", prodController.deleteProducto);

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