const express = require('express');

const { get, getById, create, update, destroy } = require('../controllers/StateController');
const { stateValidator } = require('../StateValidator');

const api = express.Router();

api.get('/estados', get);
api.get('/estados/:id', getById);
api.post('/estados', stateValidator, create);
api.put('/estados/:id', stateValidator, update);
api.delete('/estados/:id', destroy);

module.exports = api;