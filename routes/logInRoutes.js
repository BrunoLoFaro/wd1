function getLogout(req, res){
    console.log("passed")
    req.logout();
    res.redirect('/register');
}
exports.getLogout=getLogout

function failRoute(req, res){
    res.status(404).send('Ruta no encontrada');
}
exports.failRoute=failRoute

function getRutaProtegida(req, res){
    res.send('<h1>Pude ingresar a la ruta protegida</h1>');
}
exports.getRutaProtegida=getRutaProtegida