const { User } = require('../models/UserModel')
const { Profile } = require('../models/ProfileModel')
const { validationResult } = require('express-validator');

const relations = [
    { model: Profile, attributes: ['id', 'nombre'], as: 'perfil' }
]

const get = async (request, response) => {
    try {
        const { nombre, apellidos, nick } = request.query;
        const filters = { ...nombre && { nombre }, ...apellidos && { apellidos }, ...nick && { nick } };
        const entities = await User.findAll({
            where: filters,
            include: relations
        });
        response.json(entities);
    } catch (err) {
        console.log(err);
        response.status(500).send('Error consultando los datos');
    }
}


const getById = async (request, response) => {
    try {
        const id = request.params.id;
        const entitie = await User.findByPk(id, {
            include: relations
        });
        if (entitie) {
            response.json(entitie);
        } else {
            response.status(404).send('Recurso no encontrado');
        }
    } catch (err) {
        console.log(err);
        response.status(500).send('Error al consultar el dato');
    }
}

const create = async (request, response) => {
    try {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            return response.status(422).json({ errors: errors.mapped() });
        }
        const newEntitie = await User.create(request.body);
        response.status(201).json(newEntitie);
    } catch (err) {
        console.log(err);
        response.status(500).send('Error al crear');
    }
}

const update = async (request, response) => {
    try {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            return response.status(422).json({ errors: errors.mapped() });
        }
        const id = request.params.id;
        const [numRowsUpdated] = await User.update(request.body, {
            where: {
                id: id
            }
        });
        response.status(200).send(`${numRowsUpdated} registro actualizado`);
    } catch (err) {
        console.log(err);
        response.status(500).send('Error al actualizar');
    }
}

const destroy = async (request, response) => {
    try {
        const id = request.params.id;
        const numRowsDeleted = await User.destroy({
            where: {
                id: id
            }
        });
        response.status(200).send(`${numRowsDeleted} registro eliminado`);
    } catch (err) {
        console.log(err);
        response.status(500).send('Error al eliminar');
    }
}

module.exports = {
    get,
    getById,
    create,
    update,
    destroy
};