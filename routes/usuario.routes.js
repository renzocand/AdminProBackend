const express = require('express');
const app = express();
const bcrypt = require('bcryptjs')
let Usuario = require('../models/usuario.model');
let {verificaToken} = require('../middlewares/autenticacion')
// const jwt = require('jsonwebtoken')
// let SEED = require('../config/config').SEED

// Rutas
app.get('/', async (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite)
    try {
        let usuarios = await Usuario.find({}, 'nombre email img role')
        .skip(desde)
        .limit(limite)
        let contar = await Usuario.count({})
        res.status(200).json({
            ok: true,
            usuarios,
            total: contar
        });

    } catch (error) {
        res.json({
            ok: false
        })
    }
});


app.post('/', verificaToken ,async (req, res) => {
    try {
        let body = req.body;

        let usuario = new Usuario({
            nombre: body.nombre,
            email: body.email,
            password: bcrypt.hashSync(body.password, 10),
            img: body.img,
            role: body.role
        })
        usuarioGuardado = await usuario.save()
    
        res.status(201).json({
            ok: true,
            mensaje: 'Se guardo correctamente',
            usuarioToken : req.usuario
        });
    } catch (error) {
        res.json({
            ok:false,
            error
        })
    }
})

app.put('/:id',verificaToken, async (req,res)=>{
    try {
        var id = req.params.id;
        let body = req.body;
        let cambio = {
            nombre: body.nombre,
            email: body.email,
            role: body.role
        }
        let usuario = await Usuario.findByIdAndUpdate(id, {$set:cambio}, {new:true});
        usuario.password = ':)';
        res.json({
            ok:true,
            usuario,
        })
    } catch (error) {
        res.json(error)
    }
})


app.delete('/:id',verificaToken, async (req,res)=>{
    try {
        var id = req.params.id;

        let usuario = await Usuario.findByIdAndRemove(id);
        if(usuario === null){
           return res.json({
                ok:false,
                mensaje:'No existe un usuario con ese ID'
            })
        }
        res.json({
            ok:true,
            mensaje:'Usuario Eliminado',
            usuario
        })
    } catch (error) {
        res.json(error)
    }
})


module.exports = app;