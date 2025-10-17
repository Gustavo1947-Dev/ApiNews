var express = require('express');

const { get, getById, create, update, destroy } = require('../controllers/UserController');
const { validatorUserCreate, validatorUserUpdate } = require('../validators/UserValidator');
const api = express.Router();

api.get('/usuarios', get);
api.get('/usuarios/:id', getById);
api.post('/usuarios', validatorUserCreate, create);
api.put('/usuarios/:id', validatorUserUpdate, update);
api.delete('/usuarios/:id', destroy);

module.exports = api;