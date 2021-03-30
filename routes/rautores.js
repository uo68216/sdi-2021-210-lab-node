module.exports = function (app,swig) {
    app.get("/autores", function (req, res) {

        let autores = [{
            "nombre": "Amaia  Montero",
            "grupo": "La oreja de Van Gogh",
            "rol": "Cantante"

        }, {
            "nombre": "Leire Martínez",
            "grupo": "La oreja de Van Gogh",
            "rol": "Cantante"
        }, {
            "nombre": "Pablo Benegas",
            "grupo": "La oreja de Van Gogh",
            "rol": "Guitarrista"
        }, {
            "nombre": "Haritz Garde",
            "grupo": "La oreja de Van Gogh",
            "rol": "Batería"
        }, {
            "nombre": "Xabier San Martín",
            "grupo": "La oreja de Van Gogh",
            "rol": "Teclista"
        }, {
            "nombre": "Álvaro Fuentes",
            "grupo": "La oreja de Van Gogh",
            "rol": "Bajista"
        }, {
            "nombre": "Raquel del Rosario",
            "grupo": "El sueño de Morfeo",
            "rol": "Cantante"
        }, {
            "nombre": "David Feito",
            "grupo": "El sueño de Morfeo",
            "rol": "Guitarrista"
        }, {
            "nombre": "Juan Luis Suárez",
            "grupo": "El sueño de Morfeo",
            "rol": "Guitarrista"
        }];

        let respuesta = swig.renderFile('views/autores.html', {
            titulo: "Lista de autores",
            autores: autores
        });

        res.send(respuesta);
    });

    app.get('/autores/agregar', function (req, res) {
        let roles = [{
            "value": "cantante",
            "texto": "Cantante"
        },{
            "value": "batería",
            "texto": "Bateria"
        },{
            "value": "guitarrista",
            "texto": "Guitarrista"
        },{
            "value": "bajista",
            "texto": "Bajista"
        },{
            "value": "teclista",
            "texto": "Teclista"
        },{
            "value": "saxofonista",
            "texto": "Saxofonista"
        }];

        let respuesta = swig.renderFile('views/autores-agregar.html', {
            roles: roles
        });
        res.send(respuesta);
    });

    app.post('/autores/agregar', function (req, res) {
        let respuesta = "";
        if (req.body.nombre == null || req.body.nombre == "")
            respuesta += "Autor : Dato no enviado en la petición" + "<br>";
        else
            respuesta += "Autor: " + req.body.nombre + "<br>";

        if (req.body.grupo == null || req.body.grupo == "")
            respuesta += "Grupo: Dato no enviado en la petición" + "<br>";
        else
            respuesta += "Grupo: " + req.body.grupo + "<br>";

        if (req.body.rol == null || req.body.rol == "")
            respuesta += "Rol: Dato no enviado en la petición" + "<br>";
        else
            respuesta += "Rol: " + req.body.rol + "<br>";

        res.send(respuesta);
    });

    app.get('/autores/*', function (req, res) {
        res.redirect("/autores")
    });

}