var express = require('express');

const { get, getById, create, update, destroy } = require('../controllers/CategoryController');
const { validatorCategoryCreate, validatorCategoryUpdate } = require('../validators/CategoryValidator');
const api = express.Router();

api.get('/categorias', get);
api.get('/categorias/:id', getById);
api.post('/categorias', validatorCategoryCreate, create);
api.put('/categorias/:id', validatorCategoryUpdate, update);
api.delete('/categorias/:id', destroy);

module.exports = api;