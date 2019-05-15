const express = require('express');
const app = express();
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
let SEED = require('../config/config').SEED
let Usuario = require('../models/usuario.model');

//Google
let CLIENT_ID = require('../config/config').CLIENT_ID
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);


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


//Autentificacion de google
app.post('/google', async (req, res) => {
    let token = req.body.token;
    try {
        let googleUser = await verify(token)
            .catch(e => {
                return res.status(403).json({
                    ok: false,
                    mensaje: 'Token no valido'
                })
            })
        let usuarioDB = await Usuario.findOne({ email: googleUser.email })
        if (usuarioDB) {
            if (usuarioDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Debe de usar su autentificacion normal'
                })
            } else {
                let token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 });
                res.status(200).json({
                    ok: true,
                    usuarioDB,
                    token
                })
            }
        } else {
            //EL usuario no existe hay que crearlo
            let usuario = new Usuario({
                nombre: googleUser.nombre,
                email: googleUser.email,
                img: googleUser.img,
                google: true,
                password: '=)'
            })
            let guardarUsuario = await usuario.save()
            return res.status(200).json({
                ok: true,
                usuario: guardarUsuario,
                token
            })
        }
    } catch (error) {
        res.status(500).json({
            ok: false,
            error
        })
    }

})


async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    // const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}



module.exports = app;