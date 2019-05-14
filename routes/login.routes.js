const express = require('express');
const app = express();
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
let SEED = require('../config/config').SEED
let Usuario = require('../models/usuario.model');


app.post('/', async (req, res) => {
    try {
        var body = req.body
        usuarioDB = await Usuario.findOne({ email: body.email })
        if (usuarioDB === null) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - email'
            })
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - password'
            })
        }

        //Crear un token
        usuarioDB.password = ':)'
        let token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 });

        res.status(200).json({
            ok: true,
            usuarioDB,
            token
        })
    } catch (error) {
        res.status(500).json({
            ok: false,
            error
        })
    }

})





module.exports = app;