var express = require('express');

const { get, getById, create, update, destroy } = require('../controllers/NewController');
const { validatorNewCreate, validatorNewUpdate } = require('../validators/NewValidator');
const api = express.Router();

api.get('/noticias', get);
api.get('/noticias/:id', getById);
api.post('/noticias', validatorNewCreate, create);
api.put('/noticias/:id', validatorNewUpdate, update);
api.delete('/noticias/:id', destroy);

module.exports = api;