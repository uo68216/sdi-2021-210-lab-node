//Módulos
let express = require('express');
let app = express();
app.get('/usuarios', function (req, res) {
    console.log("depurar aquí");
    res.send('ver usuarios');
});

//Variables
app.set('port',8081);

app.get('/canciones',function (req,res) {
    res.send('ver canciones');
});

//Lanzar el servidor
app.listen(app.get('port'),function (){
    console.log('Servidor activo');
});
