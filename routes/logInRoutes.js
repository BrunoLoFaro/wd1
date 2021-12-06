export function getLogout(req, res){
    req.logout();
    res.redirect('/register');
}

export function failRoute(req, res){
    res.status(404).send('Ruta no encontrada');
}

export function getRutaProtegida(req, res){
    res.send('<h1>Pude ingresar a la ruta protegida</h1>');
}
