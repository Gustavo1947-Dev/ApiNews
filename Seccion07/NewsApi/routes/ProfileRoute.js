var express = require('express');

const { get, getById, create, update, destroy } = require('../controllers/ProfileController');
const { validatorProfileCreate, validatorProfileUpdate } = require('../validators/ProfileValidator');
const api = express.Router();

api.get('/perfiles', get);
api.get('/perfiles/:id', getById);
api.post('/perfiles', validatorProfileCreate, create);
api.put('/perfiles/:id', validatorProfileUpdate, update);
api.delete('/perfiles/:id', destroy);

module.exports = api;