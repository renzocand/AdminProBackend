// Requires
var express = require('express');
var mongoose = require('mongoose');
var appRoutes = require('./routes/app.routes');
const bodyParser = require('body-parser')
// Inicializar variables
var app = express();


// Conexión a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {

    if (err) throw err;

    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');

});

//Server Index config
// const serveIndex = require('serve-index');
// app.use(express.static(__dirname + '/'))
// app.use('/uploads', serveIndex(__dirname + '/uploads'));



//MIDLEWARES
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())


app.use(appRoutes)





// Escuchar peticiones
app.listen(3000, () => {
    console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});