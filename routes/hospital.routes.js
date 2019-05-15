const express = require('express');
const app = express();
const Hospital = require('../models/hospital.model')
const { verificaToken } = require('../middlewares/autenticacion')


app.get('/', async (req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde)
    let limite = Number(req.query.limite || 5)
    try {
        let hospitales = await Hospital.find({}, 'nombre img usuario')
            .populate("usuario", 'nombre email')
            .skip(desde)
            .limit(limite)
        let contar = await Hospital.count();
        res.json({
            ok: true,
            hospitales,
            total: contar
        })
    } catch (error) {
        res.status(500).json({
            ok: false,
            error
        })
    }

})

app.post('/', verificaToken, async (req, res) => {
    try {
        let body = req.body;
        let hospital = new Hospital({
            nombre: body.nombre,
            usuario: req.usuario._id
        })
        let hospitalGuardado = await hospital.save();
        res.json({
            ok: true,
            mensaje: 'Se guardo correctamente',
            hospitalGuardado
        })

    } catch (error) {
        res.status(500).json({
            ok: false,
            error
        })
    }
})

app.put('/:id', verificaToken, async (req, res) => {
    let id = req.params.id
    let body = req.body;
    let cambiar = {
        nombre: body.nombre
    }
    try {
        let hospitaDB = await Hospital.findByIdAndUpdate(id, { $set: cambiar }, { new: true })
        if (hospitaDB === null) {
            return res.status(400).json({
                ok: false,
                error: 'No se encontro id'
            })
        }
        res.status(200).json({
            ok: true,
            hospitaDB
        })
    } catch (error) {
        res.status(500).json({
            ok: false,
            error
        })
    }

})

app.delete('/:id', verificaToken, async (req, res) => {
    let id = req.params.id
    try {
        let hospitaDB = await Hospital.findByIdAndRemove(id)
        if (hospitaDB === null) {
            return res.status(400).json({
                ok: false,
                error: 'No se encontro id'
            })
        }
        res.status(200).json({
            ok: true,
            hospitaDB
        })
    } catch (error) {
        res.status(500).json({
            ok: false,
            error
        })
    }

})

module.exports = app;