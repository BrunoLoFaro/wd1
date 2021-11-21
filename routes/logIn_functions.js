export function getLogin(req, res){
    if (req.isAuthenticated()){
        let user = req.user;
        console.log('Usuario logueado');
        res.json(user);
    } else {
        console.log('Usuario no logueado');
        res.redirect('/');
    }
}

export function postLogin(req, res){
    let user = req.user;
    user.visitas++;
    res.redirect('/datos');
}

export function getFailLogin(req, res){
    res.redirect('/error-login.html');
}

export function getSignUp(req, res){
    res.redirect('../register.html');
}

export function postSignUp(req, res){
    console.log(req)
    res.redirect('/datos');
}

export function getFailSignUp(req, res){
    res.redirect('/error-signup.html');
}

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
        res.json({
            id: user._id,
            usuario: user.username,
            direccion: user.direccion,
            visitas: user.visitas
        });
    } else {
        res.redirect('/index.html');
    }
}