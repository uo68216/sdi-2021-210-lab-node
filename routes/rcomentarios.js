module.exports = function (app,swig,gestorBD){
    app.post('/comentarios/:id', function (req, res) {
        if ( req.session.usuario == null) {
            res.send("Error: No hay un usuario en sesión.");
            //Aquí mejor redirigir a login o añadir la ruta a routerUsuarioSession
        }
        let id = req.params.id;
        let comentario = {
            autor: req.session.usuario,
            texto: req.body.comentario,
            cancion_id: gestorBD.mongo.ObjectID(id)
        }

        gestorBD.insertarComentario(comentario,function (id) {
            if (id == null) {
                res.send("Error al insertar el comentario");
            } else {
                res.redirect("/cancion/"+req.params.id);
            }
        });

    });

}