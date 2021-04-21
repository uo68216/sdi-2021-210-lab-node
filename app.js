//Módulos
let express = require('express');
let app = express();

let fs = require ('fs');
let https = require ('https');

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
app.use("/cancion/comprar",routerUsuarioSession);
app.use("/compras",routerUsuarioSession);

//routerUsuarioAutor
let routerUsuarioAutor = express.Router();
routerUsuarioAutor.use(function (req, res, next) {
    console.log("routerUsuarioAutor");
    let path = require('path');
    let id = path.basename(req.originalUrl);
    // Cuidado porque req.params no funciona
    // en el router si los params van en la URL.
    gestorBD.obtenerCanciones({_id: mongo.ObjectID(id)}, function (canciones) {
        console.log(canciones[0]);
        if (canciones[0].autor == req.session.usuario) {
            next();
        } else {
           res.redirect("/tienda");
        }
    })
});
//Aplicar routerUsuarioAutor
app.use("/cancion/modificar", routerUsuarioAutor);
app.use("/cancion/eliminar", routerUsuarioAutor);


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
            let criterio = {
                usuario: req.session.usuario,
                cancionId: mongo.ObjectID(idCancion)
            };
            gestorBD.obtenerCompras(criterio, function (compras) {
                if (compras != null && compras.length > 0) {
                    next();
                } else {
                    console.log("va a : " + req.originalUrl);
                    console.log("se redirige a : /tienda");
                    res.redirect("/tienda");
                }
            });
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
require("./routes/rusuarios.js")(app,swig,gestorBD);
require("./routes/rcanciones.js")(app,swig,gestorBD);
require("./routes/rautores.js")(app,swig,gestorBD);
require("./routes/rcomentarios.js")(app,swig,gestorBD);
require("./routes/rapicanciones.js")(app, gestorBD);

//Funcion básica de manejo de errores
app.use(function (err,req, res,next) {
   console.log("Error producido: "+err); //mostramos el error en consola
   if(!res.headersSent){
       res.status(400);
       res.send("Recurso no disponible");
   }
});

//Redirección de la página principal
app.get('/', function (req, res) {
    res.redirect('/tienda');
});

//Lanzar el servidor
//app.listen(app.get('port'),function (){ console.log('Servidor activo'); });

https.createServer({
    key: fs.readFileSync('certificates/alice.key'),
    cert: fs.readFileSync('certificates/alice.crt')
},app).listen(app.get('port'),function (){
    console.log("servidor activo");
});

app.listen(80,function (){
    console.log('http puerto 80');
});