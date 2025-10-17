const { check } = require('express-validator');
const { Profile } = require('../models/ProfileModel');

const validatorProfileCreate = [
    check('nombre').notEmpty().withMessage('El campo nombre es obligatorio')
        .isString().withMessage('El campo nombre debe ser texto')
        .isLength({ min: 2, max: 50 }).withMessage('El campo debe tener entre 2 y 50 caracteres')
        .custom((value) => {
            return Profile.findOne({ where: { nombre: value } })
                .then((profile) => {
                    if (profile) {
                        return Promise.reject('Ya existe un perfil con el mismo nombre');
                    }
                });
        }),
];

const validatorProfileUpdate = [
    check('nombre').optional()
        .isString().withMessage('El campo nombre debe ser texto')
        .isLength({ min: 2, max: 50 }).withMessage('El campo debe tener entre 2 y 50 caracteres')
        .custom((value, { req }) => {
            return Profile.findOne({ where: { nombre: value } })
                .then((profile) => {
                    if (profile && profile.id !== parseInt(req.params.id)) {
                        return Promise.reject('Ya existe un perfil con el mismo nombre');
                    }
                });
        }),
];

module.exports = { validatorProfileCreate, validatorProfileUpdate };