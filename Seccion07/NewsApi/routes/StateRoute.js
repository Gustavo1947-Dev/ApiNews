var express = require('express');


const { get, getById, create, update, destroy } = require('../controllers/StateController');
const { validatorStateRequire, validatorStateOptional } = require('../validators/StateValidator')
const api = express.Router();

api.get('/estados', get);
api.get('/estados/:id', getById)
api.post('/estados', validatorStateRequire, create)
api.put('/estados/:id', validatorStateOptional, update)
api.delete('/estados/:id', destroy)


module.exports = api;