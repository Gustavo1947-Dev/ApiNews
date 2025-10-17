var express = require('express');

const { login, register, } = require('../controllers/AuthController');
const { validatorLogin, validatorRegister } = require('../validators/AuthValidator');
const api = express.Router();

api.post('/auth/login', validatorLogin, login);
api.post('/auth/registro/', validatorRegister, register)



module.exports = api;