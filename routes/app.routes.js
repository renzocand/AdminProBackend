const express = require('express');
const app = express();

// Rutas

app.use('/usuario',require('./usuario.routes'))
app.use('/login',require('./login.routes'))



module.exports = app;