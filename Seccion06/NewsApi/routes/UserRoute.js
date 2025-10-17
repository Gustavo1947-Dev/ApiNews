var express = require('express');

const { get, getById, create, update, destroy } = require('../controllers/UserController');
const api = express.Router();

api.get('/usuarios', get);
api.get('/usuarios/:id', getById)
api.post('/usuarios', create)
api.put('/usuarios/:id', update)
api.delete('/usuarios/:id', destroy)


module.exports = api;