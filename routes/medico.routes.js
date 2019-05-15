const express = require('express');
const app = express();
const Medico = require('../models/medico.model')
const { verificaToken } = require('../middlewares/autenticacion')


app.get('/', async (req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite)
    try {
        let medicos = await Medico.find({}, 'nombre img usuario hospital')
            .populate('hospital')
            .populate('usuario', 'nombre email')
            .skip(desde)
            .limit(limite)

        let total = await Medico.count({});
        res.json({
            ok: true,
            medicos,
            total
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
        let medico = new Medico({
            nombre: body.nombre,
            usuario: req.usuario._id,
            hospital:body.hospital
        })
        let medicoGuardado = await medico.save();
        res.json({
            ok: true,
            mensaje: 'Se guardo correctamente',
            medicoGuardado
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
        let medicoDB = await Medico.findByIdAndUpdate(id, { $set: cambiar }, { new: true })
        if (medicoDB === null) {
            return res.status(400).json({
                ok: false,
                error: 'No se encontro id'
            })
        }
        res.status(200).json({
            ok: true,
            medicoDB
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
        let medicoDB = await Medico.findByIdAndRemove(id)
        if (medicoDB === null) {
            return res.status(400).json({
                ok: false,
                error: 'No se encontro id'
            })
        }
        res.status(200).json({
            ok: true,
            medicoDB
        })
    } catch (error) {
        res.status(500).json({
            ok: false,
            error
        })
    }

})

module.exports = app;