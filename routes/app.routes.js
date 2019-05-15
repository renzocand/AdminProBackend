const express = require('express');
const app = express();

// Rutas

app.use('/usuario',require('./usuario.routes'))
app.use('/login',require('./login.routes'))
app.use('/hospital', require('./hospital.routes'))
app.use('/medico', require('./medico.routes'))
app.use('/busqueda', require('./busqueda.routes'))
app.use('/upload', require('./upload.routes'))
app.use('/img', require('./imagenes.routes'))



module.exports = app;

// const express = require('express');
// const app = express();
// app.get('/', async (req, res) => {
//     try {
//         res.json({
//             ok: true,
//         })
//     } catch (error) {
//         res.status(500).json({
//             ok: false,
//             error
//         })
//     }
// })
// module.exports = app;