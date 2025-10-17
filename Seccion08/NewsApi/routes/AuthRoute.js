var express = require('express');

const { login, register, } = require('../controllers/AuthController');
const { validatorLogin, validatorRegister } = require('../validators/AuthValidator');
const api = express.Router();

api.post('/login', validatorLogin, login);
api.post('/register', validatorRegister, register);

module.exports = api;