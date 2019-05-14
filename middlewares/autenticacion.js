const jwt = require('jsonwebtoken')
let SEED = require('../config/config').SEED

//MIDLEWARE VERIFICA TOKEN
let verificaToken = async (req, res, next) => {
    var token = req.query.token;
    await jwt.verify(token, SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Token incorrecto',
                errors: err
            })
        }
        req.usuario = decoded.usuario
        next()        
    })
}


module.exports = {
    verificaToken
}