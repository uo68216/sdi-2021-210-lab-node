//Módulos
let express = require('express');
let app = express();


let fileUpload = require('express-fileupload');
app.use(fileUpload());

let mongo = require('mongodb');
let swig = require('swig');

let bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let gestorBD = require("./modules/gestorBD.js");
gestorBD.init(app,mongo);

let crypto = require('crypto');

let expressSession = require('express-session');
app.use(expressSession({
    secret: 'abcdefg',
    resave: true,
    saveUninitialized: true
}));

//routerUsuarioSession
var routerUsuarioSession = express.Router();
routerUsuarioSession.use(function (req, res, next) {
    console.log("routerUsuarioSession");
    if (req.session.usuario) {
        // dejamos correr la petición
        console.log("va a : " + req.originalUrl);
        next();
    } else {
        console.log("va a : " + req.originalUrl);
        console.log("se redirige a : /identificarse");
        res.redirect("/identificarse");
    }
});
//Aplicar routerUsuarioSession
app.use("/canciones/agregar",routerUsuarioSession);
app.use("/publicaciones",routerUsuarioSession);


//routerAudios
let routerAudios = express.Router();
routerAudios.use(function (req, res, next) {
    console.log("routerAudios");
    let path = require('path');
    let idCancion = path.basename(req.originalUrl, '.mp3');
    gestorBD.obtenerCanciones({ "_id": mongo.ObjectID(idCancion) }, function (canciones) {
        if (req.session.usuario && canciones[0].autor == req.session.usuario) {
            console.log("va a : " + req.originalUrl);
            next();
        } else {
            console.log("va a : " + req.originalUrl);
            console.log("se redirige a : /tienda");
            res.redirect("/tienda");
        }
    })
});
//Aplicar routerAudios
app.use("/audios/", routerAudios);

//Variables
app.set('port',8081);
app.set('db','mongodb://admin:6272-GDT@tiendamusica-shard-00-00.zuvhy.mongodb.net:27017,tiendamusica-shard-00-01.zuvhy.mongodb.net:27017,tiendamusica-shard-00-02.zuvhy.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-ay6h0a-shard-0&authSource=admin&retryWrites=true&w=majority');
app.set('clave','abcdefg');
app.set('crypto',crypto);

//Declaramos el directorio public como estático. Tiene que ir obligatoriamente después de la declaración del router.
app.use(express.static('public'));

//Rutas/controladores por lógica
require("./routes/rusuarios.js")(app,swig,gestorBD); //(app, param1, param2, etc.)
require("./routes/rcanciones.js")(app,swig,gestorBD); //(app, param1, param2, etc.)
require("./routes/rautores.js")(app,swig,gestorBD); //(app, param1, param2, etc.)
require("./routes/rcomentarios.js")(app,swig,gestorBD); //(app, param1, param2, etc.)

//Lanzar el servidor
app.listen(app.get('port'),function (){
    console.log('Servidor activo');
});
