export function getLogout(req, res){
    req.logout();
    res.redirect('/');
}

export function failRoute(req, res){
    res.status(404).send('Ruta no encontrada');
}

export function getRutaProtegida(req, res){
    res.send('<h1>Pude ingresar a la ruta protegida</h1>');
}

export function getDatos(req,res){
    if (req.isAuthenticated()) {
        let user = req.user;
        res.json({user});
    } else {
        res.redirect('/index.html');
    }
}
