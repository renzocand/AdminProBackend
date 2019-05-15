const express = require('express');
const fileUpload = require('express-fileupload')
const path = require('path');
const fs = require('fs')
const Hospital = require('../models/hospital.model');
const Medico = require('../models/medico.model');
const Usuario = require('../models/usuario.model');
const app = express();

//Middleware
app.use(fileUpload());

app.put('/:tipo/:id', async (req, res) => {
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            error: 'No selecciono nada'
        })
    }
    let tipo = req.params.tipo;
    let id = req.params.id;
    let archivo = req.files.imagen;
    let nombreCortado = archivo.name.split('.');
    let extensionArchivo = nombreCortado[nombreCortado.length - 1]

    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];
    let tiposValidos = ['hospitales', 'medicos', 'usuarios'];

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            error: 'Tipo no valida',
            mensaje: `Use ${tiposValidos.join(', ')}`
        })
    }

    if (extensionesValidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            error: 'Extension no valida',
            mensaje: `Use ${extensionesValidas.join(', ')}`
        })
    }

    try {

        // Nombre de archivo personalizado
        let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`;
        let ubicacion = path.resolve(__dirname, `../uploads/${tipo}/${nombreArchivo}`);

        //MOVER ARCHIVO
        await archivo.mv(ubicacion)

        subirPorTipo(tipo, id, nombreArchivo, res)


    } catch (error) {
        res.status(500).json({
            ok: false,
            error
        })
    }
})

let subirPorTipo = async (tipo, id, nombreArchivo, res) => {
    try {
        if (tipo === 'usuarios') {
            let usuarioDB = await Usuario.findById(id);
            if(usuarioDB === null){
                return res.json({
                    ok: false,
                    mensaje: 'Usuario no existe'
                }) 
            }
            let pathViejo = './uploads/usuarios/' + usuarioDB.img
            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo)
            }
            usuarioDB.img = nombreArchivo;

            let usuarioActualizado = await usuarioDB.save()
            usuarioActualizado.password = ':)';
            return res.json({
                ok: true,
                usuarioActualizado
            })
        }

        if (tipo === 'medicos') {
            let medicoDB = await Medico.findById(id);
            if(medicoDB === null){
                return res.json({
                    ok: false,
                    mensaje: 'Medico no existe'
                }) 
            }
            let pathViejo = './uploads/medicos/' + medicoDB.img
            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo)
            }
            medicoDB.img = nombreArchivo;

            let medicoActualizado = await medicoDB.save()
            return res.json({
                ok: true,
                medicoActualizado
            })
        }

        if (tipo === 'hospitales') {
            let hospitalDB = await Hospital.findById(id);
            if(hospitalDB === null){
                return res.json({
                    ok: false,
                    mensaje: 'Hospital no existe'
                }) 
            }
            let pathViejo = './uploads/hospitales/' + hospitalDB.img
            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo)
            }
            hospitalDB.img = nombreArchivo;

            let hospitalActualizado = await hospitalDB.save()
            return res.json({
                ok: true,
                hospitalActualizado
            })
        }

    } catch (error) {
        res.status(500).json({
            ok: false,
            error
        })
    }

}

module.exports = app;