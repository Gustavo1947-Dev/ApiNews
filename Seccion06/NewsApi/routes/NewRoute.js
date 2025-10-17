const express = require('express');

const { get, getById, create, update, destroy } = require('../controllers/NewController');

const api = express.Router();

api.get('/noticias', get);
api.get('/noticias/:id', getById)
api.post('/noticias', create)
api.put('/noticias/:id', update)
api.delete('/noticias/:id', destroy)

module.exports = api;