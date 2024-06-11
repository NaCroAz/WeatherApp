// servidor/models/Busqueda.js

const mongoose = require('mongoose');

const BusquedaSchema = new mongoose.Schema({
    ciudad: {
        type: String,
        required: true
    },
    fecha: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Busqueda', BusquedaSchema);
