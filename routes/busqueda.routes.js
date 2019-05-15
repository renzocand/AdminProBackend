const express = require('express');
const app = express();
const Hospital = require('../models/hospital.model');
const Medico = require('../models/medico.model');
const Usuario = require('../models/usuario.model');

// BUSQUEDA POR COLECCION
app.get('/coleccion/:tabla/:busqueda', async (req, res) => {
    let tabla = req.params.tabla;
    let busqueda = req.params.busqueda;
    let regExpr = new RegExp(busqueda, 'i');
    let promesa;
    try {
        switch (tabla) {
            case 'usuarios':
                promesa = await Usuario.find({}, 'nombre email role').or([{ 'nombre': regExpr }, { 'email': regExpr }]).limit(5)
                break;

            case 'medicos':
                promesa = await Medico.find({ nombre: regExpr }).limit(5).populate('usuario', 'nombre email').populate('hospitales', 'hospital')
                break;

            case 'hospitales':
                promesa = await Hospital.find({ nombre: regExpr }).limit(5).populate('usuario', 'id nombre role')
                break;

            default:
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Los tipos de busqueda solo son usuarios, medicos y hospitales'
                })
        }

        res.json({
            ok: true,
            promesa
        })
    } catch (error) {
        res.status(500).json({
            ok: false,
            error
        })
    }
})



// BUSQUEDA GENERAL
app.get('/todo/:busqueda', async (req, res) => {
    let busqueda = req.params.busqueda;
    let regexp = new RegExp(busqueda, 'i');
    try {
        let usuarios = await Usuario.find({}, 'nombre email role').or([{ 'nombre': regexp }, { 'email': regexp }]).limit(5)
        let hospitales = await Hospital.find({ nombre: regexp }).limit(5).populate('usuario', 'id nombre role')
        let medicos = await Medico.find({ nombre: regexp }).limit(5).populate('usuario', 'nombre email').populate('hospitales', 'hospital')
        res.json({
            ok: true,
            hospitales,
            medicos,
            usuarios
        })
    } catch (error) {
        res.status(500).json({
            ok: false,
            error
        })
    }

})


module.exports = app