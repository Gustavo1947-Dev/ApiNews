const { check } = require('express-validator');

const stateValidator = [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('abreviacion', 'La abreviación es obligatoria').not().isEmpty(),
    check('abreviacion', 'La abreviación debe tener entre 2 y 3 caracteres').isLength({ min: 2, max: 3 })
];

module.exports = {
    stateValidator
};