module.exports = function (app,swig,gestorBD){
    app.get("/canciones",function (req,res) {

        let canciones = [{
            "nombre": "Blak space",
            "precio": "1.2"
        },{
            "nombre": "See you again",
            "precio": "1.3"
        },{
            "nombre": "Uptown Funk",
            "precio": "1.1"
        }];

        let respuesta = swig.renderFile('views/btienda.html', {
            vendedor : "Tienda de canciones",
            canciones : canciones
        });

        res.send(respuesta);
    });

    app.get('/canciones/agregar', function (req, res) {
        let respuesta = swig.renderFile('views/bagregar.html',{
           });
        res.send(respuesta);
    });

    app.get('/canciones/:id', function (req, res) {
        let respuesta = 'id: ' + req.params.id;
        res.send(respuesta);
    });

    app.get('/canciones/:genero/:id', function (req, res) {
        let respuesta = 'id: ' + req.params.id + '<br>'
            + 'Género: ' + req.params.genero;
        res.send(respuesta);
    });

    app.post("/cancion",function (req,res) {
        let cancion={
            nombre: req.body.nombre,
            genero: req.body.genero,
            precio: req.body.precio,
        }

        //Conectarse a la base de datos
        gestorBD.insertarCancion(cancion, function (id) {
            if (id == null) {
                res.send("Error al insertar canción");
            } else {
                res.send("Agregada canción con id: "+ id);
            }
        });

    });

    app.get('/suma', function(req, res) {
        let respuesta = parseInt(req.query.num1) + parseInt(req.query.num2);
        res.send(String(respuesta));
    });

    app.get('/promo*', function (req, res) {
        res.send('Respuesta patrón promo* ');
    });
};