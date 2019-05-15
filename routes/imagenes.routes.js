const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

app.get('/:tipo/:img', async (req, res) => {
    let tipo = req.params.tipo;
    let img = req.params.img;
    let pathImagen = path.resolve(__dirname, `../uploads/${tipo}/${img}`);
    let pathNoImg = path.resolve(__dirname, '../assets/no-img.jpg')

    if(fs.existsSync(pathImagen)){
        res.sendFile(pathImagen)
    }else{
        res.sendFile(pathNoImg)
    }

})
module.exports = app;